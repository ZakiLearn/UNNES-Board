import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch accepted connections and pending requests
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get accepted chat connections
    const acceptedConnections = await db.chatConnection.findMany({
      where: {
        OR: [
          { senderId: user.id, status: "ACCEPTED" },
          { receiverId: user.id, status: "ACCEPTED" },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            aliasName: true,
          },
        },
        receiver: {
          select: {
            id: true,
            aliasName: true,
          },
        },
      },
    });

    // Format connections to easily access the target profile
    const activeChats = acceptedConnections.map((conn) => {
      const counterpart = conn.senderId === user.id ? conn.receiver : conn.sender;
      return {
        connectionId: conn.id,
        profile: counterpart,
      };
    });

    // 2. Get pending received connection requests
    const pendingRequests = await db.chatConnection.findMany({
      where: {
        receiverId: user.id,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            aliasName: true,
          },
        },
      },
    });

    return NextResponse.json({
      activeChats,
      pendingRequests: pendingRequests.map(r => ({
        connectionId: r.id,
        sender: r.sender,
        createdAt: r.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("GET connections error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Send connection request or update connection status (Accept/Reject)
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
    const { receiverId, connectionId, status } = body;

    // Case 1: Send a new chat connection request
    if (receiverId) {
      if (receiverId === user.id) {
        return NextResponse.json(
          { error: "Cannot connect to yourself" },
          { status: 400 }
        );
      }

      // Check if connection already exists
      const existing = await db.chatConnection.findFirst({
        where: {
          OR: [
            { senderId: user.id, receiverId },
            { senderId: receiverId, receiverId: user.id },
          ],
        },
      });

      if (existing) {
        return NextResponse.json({
          message: "Connection already exists",
          connection: existing,
        });
      }

      // Create new connection request
      const newConnection = await db.chatConnection.create({
        data: {
          senderId: user.id,
          receiverId,
          status: "PENDING",
        },
      });

      return NextResponse.json({
        message: "Connection request sent",
        connection: newConnection,
      });
    }

    // Case 2: Accept or reject connection request
    if (connectionId && status) {
      if (!["ACCEPTED", "REJECTED"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      // Verify the connection belongs to the user (only the receiver can accept/reject)
      const conn = await db.chatConnection.findUnique({
        where: { id: connectionId },
      });

      if (!conn) {
        return NextResponse.json({ error: "Connection not found" }, { status: 404 });
      }

      if (conn.receiverId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (status === "REJECTED") {
        await db.chatConnection.delete({
          where: { id: connectionId },
        });
        return NextResponse.json({ message: "Request rejected and deleted" });
      }

      const updated = await db.chatConnection.update({
        where: { id: connectionId },
        data: { status: "ACCEPTED" },
      });

      return NextResponse.json({
        message: "Connection request accepted",
        connection: updated,
      });
    }

    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  } catch (error: any) {
    console.error("POST connections error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
