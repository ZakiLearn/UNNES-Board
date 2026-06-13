import React from "react";
import { db } from "@/lib/db";
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
  const tags = await db.query.tag.findMany({
    orderBy: (t, { asc }) => [asc(t.name)]
  });
  const tagsList = tags.length > 0 ? tags.map(t => t.name) : ["Akademik", "Sosial", "Curhat", "Kantin"];

  // 2. Fetch posts
  const posts = await db.query.post.findMany({
    with: {
      author: {
        columns: {
          aliasName: true
        }
      },
      tag: {
        columns: {
          id: true,
          name: true
        }
      },
      comments: {
        with: {
          author: {
            columns: {
              aliasName: true
            }
          }
        },
        orderBy: (c, { asc }) => [asc(c.createdAt)]
      },
      reactions: {
        columns: {
          id: true,
          emoji: true,
          profileId: true
        }
      }
    },
    orderBy: (p, { desc }) => [desc(p.createdAt)]
  });

  // 3. Fetch latest poll
  const poll = await db.query.poll.findFirst({
    with: {
      options: {
        with: {
          votes: {
            columns: {
              profileId: true
            }
          }
        }
      }
    },
    orderBy: (p, { desc }) => [desc(p.createdAt)]
  });

  return (
    <FeedClient 
      initialPosts={posts as any} 
      initialPoll={poll as any} 
      currentUserId={user.id}
      tagsList={tagsList}
    />
  );
}
