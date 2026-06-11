import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch message history with a specific user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get("receiverId");

    if (!receiverId) {
      return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await db.directMessage.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId },
          { senderId: receiverId, receiverId: user.id }
        ]
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json({
      messages: messages.map(m => ({
        id: m.id,
        senderId: m.senderId,
        receiverId: m.receiverId,
        content: m.content,
        createdAt: m.createdAt.toISOString()
      }))
    });
  } catch (error: any) {
    console.error("GET private messages error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Save a new private message
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content || content.trim() === "") {
      return NextResponse.json({ error: "Receiver ID and content are required" }, { status: 400 });
    }

    // Verify chat connection status (must be ACCEPTED to send messages)
    const connection = await db.chatConnection.findFirst({
      where: {
        OR: [
          { senderId: user.id, receiverId, status: "ACCEPTED" },
          { senderId: receiverId, receiverId: user.id, status: "ACCEPTED" }
        ]
      }
    });

    if (!connection) {
      return NextResponse.json({ error: "No active chat connection found" }, { status: 403 });
    }

    const message = await db.directMessage.create({
      data: {
        senderId: user.id,
        receiverId,
        content: content.trim()
      }
    });

    return NextResponse.json({
      message: {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        createdAt: message.createdAt.toISOString()
      }
    });
  } catch (error: any) {
    console.error("POST private message error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
