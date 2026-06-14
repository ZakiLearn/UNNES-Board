import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { profile as profileTable, chatConnection as chatConnectionTable } from "@/lib/db/schema";
import { eq, and, or, ilike, ne } from "drizzle-orm";
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
    const profiles = await db.select({
      id: profileTable.id,
      aliasName: profileTable.aliasName,
    })
    .from(profileTable)
    .where(
      and(
        ilike(profileTable.aliasName, `%${query}%`),
        ne(profileTable.id, user.id)
      )
    )
    .limit(10);

    // For each profile found, fetch connection status
    const usersWithStatus = await Promise.all(
      profiles.map(async (p) => {
        const connList = await db.select().from(chatConnectionTable).where(
          or(
            and(eq(chatConnectionTable.senderId, user.id), eq(chatConnectionTable.receiverId, p.id)),
            and(eq(chatConnectionTable.senderId, p.id), eq(chatConnectionTable.receiverId, user.id))
          )
        ).limit(1);

        const conn = connList[0];

        return {
          id: p.id,
          aliasName: p.aliasName,
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
  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
