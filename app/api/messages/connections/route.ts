import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chatConnection as chatConnectionTable } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";
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
    const acceptedConnections = await db.query.chatConnection.findMany({
      where: and(
        or(
          eq(chatConnectionTable.senderId, user.id),
          eq(chatConnectionTable.receiverId, user.id)
        ),
        eq(chatConnectionTable.status, "ACCEPTED")
      ),
      with: {
        sender: {
          columns: {
            id: true,
            aliasName: true,
          }
        },
        receiver: {
          columns: {
            id: true,
            aliasName: true,
          }
        }
      }
    });

    // Format connections to easily access the target profile
    const activeChats = acceptedConnections.map((conn: any) => {
      const counterpart = conn.senderId === user.id ? conn.receiver : conn.sender;
      return {
        connectionId: conn.id,
        profile: counterpart,
      };
    });

    // 2. Get pending received connection requests
    const pendingRequests = await db.query.chatConnection.findMany({
      where: and(
        eq(chatConnectionTable.receiverId, user.id),
        eq(chatConnectionTable.status, "PENDING")
      ),
      with: {
        sender: {
          columns: {
            id: true,
            aliasName: true,
          }
        }
      }
    });

    return NextResponse.json({
      activeChats,
      pendingRequests: pendingRequests.map((r: any) => ({
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
      const existingList = await db.select().from(chatConnectionTable).where(
        or(
          and(eq(chatConnectionTable.senderId, user.id), eq(chatConnectionTable.receiverId, receiverId)),
          and(eq(chatConnectionTable.senderId, receiverId), eq(chatConnectionTable.receiverId, user.id))
        )
      ).limit(1);

      const existing = existingList[0];

      if (existing) {
        return NextResponse.json({
          message: "Connection already exists",
          connection: existing,
        });
      }

      // Create new connection request
      const [newConnection] = await db.insert(chatConnectionTable).values({
        senderId: user.id,
        receiverId,
        status: "PENDING",
      }).returning();

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
      const connList = await db.select().from(chatConnectionTable).where(
        eq(chatConnectionTable.id, connectionId)
      ).limit(1);

      const conn = connList[0];

      if (!conn) {
        return NextResponse.json({ error: "Connection not found" }, { status: 404 });
      }

      if (conn.receiverId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (status === "REJECTED") {
        await db.delete(chatConnectionTable).where(eq(chatConnectionTable.id, connectionId));
        return NextResponse.json({ message: "Request rejected and deleted" });
      }

      const [updated] = await db.update(chatConnectionTable)
        .set({ status: "ACCEPTED" })
        .where(eq(chatConnectionTable.id, connectionId))
        .returning();

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
