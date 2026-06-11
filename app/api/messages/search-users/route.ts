import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!query) {
      return NextResponse.json({ users: [] });
    }

    // Search profiles by aliasName (excluding current user)
    const profiles = await db.profile.findMany({
      where: {
        aliasName: {
          contains: query,
          mode: "insensitive",
        },
        id: {
          not: user.id,
        },
      },
      select: {
        id: true,
        aliasName: true,
      },
      take: 10,
    });

    // For each profile found, fetch connection status
    const usersWithStatus = await Promise.all(
      profiles.map(async (profile) => {
        const conn = await db.chatConnection.findFirst({
          where: {
            OR: [
              { senderId: user.id, receiverId: profile.id },
              { senderId: profile.id, receiverId: user.id },
            ],
          },
        });

        return {
          id: profile.id,
          aliasName: profile.aliasName,
          connection: conn
            ? {
                id: conn.id,
                status: conn.status,
                isSender: conn.senderId === user.id,
              }
            : null,
        };
      })
    );

    return NextResponse.json({ users: usersWithStatus });
  } catch (error: any) {
    console.error("Search users error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
