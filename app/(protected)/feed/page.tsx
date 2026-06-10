import React from "react";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import FeedClient from "./FeedClient";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="neo-card bg-white text-center py-10 max-w-xl mx-auto mt-10">
        <p className="font-heading font-black text-neo-black">Sesi Anda telah berakhir. Silakan masuk kembali.</p>
      </div>
    );
  }

  // 1. Fetch tags
  const tags = await db.tag.findMany({
    orderBy: { name: "asc" }
  });
  const tagsList = tags.length > 0 ? tags.map(t => t.name) : ["Akademik", "Sosial", "Curhat", "Kantin"];

  // 2. Fetch posts
  const posts = await db.post.findMany({
    include: {
      author: {
        select: {
          aliasName: true
        }
      },
      tag: {
        select: {
          id: true,
          name: true
        }
      },
      comments: {
        include: {
          author: {
            select: {
              aliasName: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      reactions: {
        select: {
          id: true,
          emoji: true,
          profileId: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // 3. Fetch latest poll
  const poll = await db.poll.findFirst({
    include: {
      options: {
        include: {
          votes: {
            select: {
              profileId: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <FeedClient 
      initialPosts={posts} 
      initialPoll={poll} 
      currentUserId={user.id}
      tagsList={tagsList}
    />
  );
}
