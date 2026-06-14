'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profile as profileTable, tag as tagTable, post as postTable, comment as commentTable, reaction as reactionTable, poll as pollTable, pollOption as pollOptionTable, pollVote as pollVoteTable } from '@/lib/db/schema';
import { eq, and, inArray, ilike } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Helper to get authenticated user profile
async function getAuthenticatedProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Sesi Anda telah berakhir. Silakan masuk kembali.');
  }

  // Ensure profile exists in DB (fallback if onboarding was bypassed)
  const existingProfiles = await db.select().from(profileTable).where(eq(profileTable.id, user.id)).limit(1);
  let profile = existingProfiles[0];

  if (!profile) {
    const defaultAlias = `Anon-${Math.floor(1000 + Math.random() * 9000)}`;
    const [newProfile] = await db.insert(profileTable).values({
      id: user.id,
      aliasName: defaultAlias,
      hasSetAlias: false
    }).returning();
    profile = newProfile;
  }

  return profile;
}

// 1. Create a Menfess post
export async function createMenfessPost(prevState: unknown, formData: FormData) {
  try {
    const profile = await getAuthenticatedProfile();
    const content = formData.get('content') as string;
    const rawTag = formData.get('tag') as string; // e.g. "Curhat", "Akademik"

    if (!content || content.trim() === '') {
      return { error: 'Konten menfess tidak boleh kosong.' };
    }

    if (content.length > 500) {
      return { error: 'Konten menfess tidak boleh lebih dari 500 karakter.' };
    }

    const cleanedTag = (rawTag || 'Curhat').replace('#', '').trim();

    // Find or create tag
    let tagRecord;
    const existingTags = await db.select().from(tagTable).where(ilike(tagTable.name, cleanedTag)).limit(1);

    if (existingTags.length > 0) {
      tagRecord = existingTags[0];
    } else {
      const [newTag] = await db.insert(tagTable).values({ name: cleanedTag }).returning();
      tagRecord = newTag;
    }

    await db.insert(postTable).values({
      content: content.trim(),
      authorId: profile.id,
      tagId: tagRecord.id
    });

    revalidatePath('/feed');
    return { success: true, error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal mengirim menfess.' };
  }
}

// 2. Toggle reaction on a post
export async function togglePostReaction(postId: number, emoji: string) {
  try {
    const profile = await getAuthenticatedProfile();

    const existingReactions = await db.select().from(reactionTable).where(
      and(
        eq(reactionTable.profileId, profile.id),
        eq(reactionTable.postId, postId),
        eq(reactionTable.emoji, emoji)
      )
    ).limit(1);

    const existingReaction = existingReactions[0];

    if (existingReaction) {
      // Remove reaction
      await db.delete(reactionTable).where(eq(reactionTable.id, existingReaction.id));
    } else {
      // Add reaction
      await db.insert(reactionTable).values({
        profileId: profile.id,
        postId: postId,
        emoji: emoji
      });
    }

    revalidatePath('/feed');
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal mengubah reaksi.' };
  }
}

// 3. Add a comment to a post
export async function addPostComment(postId: number, content: string) {
  try {
    const profile = await getAuthenticatedProfile();

    if (!content || content.trim() === '') {
      return { error: 'Komentar tidak boleh kosong.' };
    }

    await db.insert(commentTable).values({
      content: content.trim(),
      authorId: profile.id,
      postId: postId
    });

    revalidatePath('/feed');
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal menambahkan komentar.' };
  }
}

// 4. Submit a vote on a poll option
export async function submitPollVote(optionId: number) {
  try {
    const profile = await getAuthenticatedProfile();

    // Find the option to check the pollId
    const existingOptions = await db.select().from(pollOptionTable).where(eq(pollOptionTable.id, optionId)).limit(1);
    const option = existingOptions[0];

    if (!option) {
      return { error: 'Pilihan polling tidak ditemukan.' };
    }

    // Get all options for this poll
    const pollOptionsList = await db.select().from(pollOptionTable).where(eq(pollOptionTable.pollId, option.pollId));
    const optionIds = pollOptionsList.map(opt => opt.id);

    // Check if the user has already voted on ANY option in this poll
    const existingVotesList = await db.select().from(pollVoteTable).where(
      and(
        eq(pollVoteTable.profileId, profile.id),
        inArray(pollVoteTable.optionId, optionIds)
      )
    ).limit(1);

    const existingVote = existingVotesList[0];

    if (existingVote) {
      if (existingVote.optionId === optionId) {
        // If clicking the same option, retract the vote
        await db.delete(pollVoteTable).where(eq(pollVoteTable.id, existingVote.id));
      } else {
        // Switch the vote to the new option
        await db.update(pollVoteTable)
          .set({ optionId: optionId })
          .where(eq(pollVoteTable.id, existingVote.id));
      }
    } else {
      // Cast new vote
      await db.insert(pollVoteTable).values({
        profileId: profile.id,
        optionId: optionId
      });
    }

    revalidatePath('/feed');
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal mengirim suara.' };
  }
}
