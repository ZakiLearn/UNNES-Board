'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Helper to get authenticated user profile
async function getAuthenticatedProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Sesi Anda telah berakhir. Silakan masuk kembali.');
  }

  // Ensure profile exists in DB (fallback if onboarding was bypassed)
  let profile = await db.profile.findUnique({
    where: { id: user.id }
  });

  if (!profile) {
    const defaultAlias = `Anon-${Math.floor(1000 + Math.random() * 9000)}`;
    profile = await db.profile.create({
      data: {
        id: user.id,
        aliasName: defaultAlias,
        hasSetAlias: false
      }
    });
  }

  return profile;
}

// 1. Create a Menfess post
export async function createMenfessPost(prevState: any, formData: FormData) {
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
    let tagRecord = await db.tag.findFirst({
      where: { name: { equals: cleanedTag, mode: 'insensitive' } }
    });

    if (!tagRecord) {
      tagRecord = await db.tag.create({
        data: { name: cleanedTag }
      });
    }

    await db.post.create({
      data: {
        content: content.trim(),
        authorId: profile.id,
        tagId: tagRecord.id
      }
    });

    revalidatePath('/feed');
    return { success: true, error: null };
  } catch (err: any) {
    return { error: err.message || 'Gagal mengirim menfess.' };
  }
}

// 2. Toggle reaction on a post
export async function togglePostReaction(postId: number, emoji: string) {
  try {
    const profile = await getAuthenticatedProfile();

    const existingReaction = await db.reaction.findFirst({
      where: {
        profileId: profile.id,
        postId: postId,
        emoji: emoji
      }
    });

    if (existingReaction) {
      // Remove reaction
      await db.reaction.delete({
        where: { id: existingReaction.id }
      });
    } else {
      // Add reaction
      await db.reaction.create({
        data: {
          profileId: profile.id,
          postId: postId,
          emoji: emoji
        }
      });
    }

    revalidatePath('/feed');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Gagal mengubah reaksi.' };
  }
}

// 3. Add a comment to a post
export async function addPostComment(postId: number, content: string) {
  try {
    const profile = await getAuthenticatedProfile();

    if (!content || content.trim() === '') {
      return { error: 'Komentar tidak boleh kosong.' };
    }

    await db.comment.create({
      data: {
        content: content.trim(),
        authorId: profile.id,
        postId: postId
      }
    });

    revalidatePath('/feed');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Gagal menambahkan komentar.' };
  }
}

// 4. Submit a vote on a poll option
export async function submitPollVote(optionId: number) {
  try {
    const profile = await getAuthenticatedProfile();

    // Find the option to check the pollId
    const option = await db.pollOption.findUnique({
      where: { id: optionId },
      include: { poll: { include: { options: true } } }
    });

    if (!option) {
      return { error: 'Pilihan polling tidak ditemukan.' };
    }

    // Get all options for this poll
    const optionIds = option.poll.options.map(opt => opt.id);

    // Check if the user has already voted on ANY option in this poll
    const existingVote = await db.pollVote.findFirst({
      where: {
        profileId: profile.id,
        optionId: { in: optionIds }
      }
    });

    if (existingVote) {
      if (existingVote.optionId === optionId) {
        // If clicking the same option, retract the vote
        await db.pollVote.delete({
          where: { id: existingVote.id }
        });
      } else {
        // Switch the vote to the new option
        await db.pollVote.update({
          where: { id: existingVote.id },
          data: { optionId: optionId }
        });
      }
    } else {
      // Cast new vote
      await db.pollVote.create({
        data: {
          profileId: profile.id,
          optionId: optionId
        }
      });
    }

    revalidatePath('/feed');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Gagal mengirim suara.' };
  }
}
