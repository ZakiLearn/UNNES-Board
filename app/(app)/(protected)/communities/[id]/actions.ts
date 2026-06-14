'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profile as profileTable, communityMember as communityMemberTable, communityMessage as communityMessageTable } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Helper to get authenticated user profile
async function getAuthenticatedProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Sesi Anda telah berakhir. Silakan masuk kembali.');
  }

  const existing = await db.select().from(profileTable).where(eq(profileTable.id, user.id)).limit(1);
  const profile = existing[0];

  if (!profile) {
    throw new Error('Profil tidak ditemukan.');
  }

  return profile;
}

// Send message to a community chat room
export async function sendMessage(communityId: number, roomName: string, content: string) {
  try {
    const profile = await getAuthenticatedProfile();

    // Check membership status
    const membershipList = await db.select().from(communityMemberTable).where(
      and(
        eq(communityMemberTable.profileId, profile.id),
        eq(communityMemberTable.communityId, communityId)
      )
    ).limit(1);
    const membership = membershipList[0];

    if (profile.role !== 'ADMIN' && (!membership || membership.status !== 'APPROVED')) {
      return { success: false, error: 'Akses ditolak. Anda bukan anggota resmi dari komunitas ini.' };
    }

    if (!content || content.trim() === '') {
      return { success: false, error: 'Pesan tidak boleh kosong.' };
    }

    // Role-based write permission check for '#pengumuman'
    const cleanRoomName = roomName.replace('#', '').trim();
    if (cleanRoomName === 'pengumuman') {
      const isModerator = membership?.role === 'MODERATOR';
      const isAdmin = profile.role === 'ADMIN';

      if (!isModerator && !isAdmin) {
        return { success: false, error: 'Hanya Moderator atau Admin yang dapat mengirim pesan di saluran pengumuman.' };
      }
    }

    // Save message to database
    const [message] = await db.insert(communityMessageTable).values({
      content: content.trim(),
      roomName: cleanRoomName,
      profileId: profile.id,
      communityId
    }).returning();

    const msgWithProfile = {
      ...message,
      profile: profile
    };

    revalidatePath(`/communities/${communityId}`);
    return { success: true, data: msgWithProfile };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// Delegate moderator role to another APPROVED member (max 3 moderators)
export async function delegateModerator(communityId: number, targetProfileId: string) {
  try {
    const profile = await getAuthenticatedProfile();

    // Check sender's authorization (must be MODERATOR in the community or ADMIN in profile)
    const senderMembershipList = await db.select().from(communityMemberTable).where(
      and(
        eq(communityMemberTable.profileId, profile.id),
        eq(communityMemberTable.communityId, communityId)
      )
    ).limit(1);
    const senderMembership = senderMembershipList[0];

    const isSenderAuthorized = profile.role === 'ADMIN' || senderMembership?.role === 'MODERATOR';
    if (!isSenderAuthorized) {
      return { success: false, error: 'Akses ditolak. Anda tidak memiliki wewenang untuk mendelegasikan moderator.' };
    }

    // Check target's membership status (must be APPROVED)
    const targetMembershipList = await db.select().from(communityMemberTable).where(
      and(
        eq(communityMemberTable.profileId, targetProfileId),
        eq(communityMemberTable.communityId, communityId)
      )
    ).limit(1);
    const targetMembership = targetMembershipList[0];

    if (!targetMembership || targetMembership.status !== 'APPROVED') {
      return { success: false, error: 'Target pengguna belum menjadi anggota yang disetujui di komunitas ini.' };
    }

    if (targetMembership.role === 'MODERATOR') {
      return { success: false, error: 'Target pengguna sudah menjadi moderator.' };
    }

    // Check current moderator count limit (max 3)
    const countRes = await db.select({ value: count() }).from(communityMemberTable).where(
      and(
        eq(communityMemberTable.communityId, communityId),
        eq(communityMemberTable.role, 'MODERATOR'),
        eq(communityMemberTable.status, 'APPROVED')
      )
    );
    const modCount = countRes[0]?.value || 0;

    if (modCount >= 3) {
      return { success: false, error: 'Jumlah moderator maksimal (3) telah tercapai.' };
    }

    // Update role
    const [updated] = await db.update(communityMemberTable)
      .set({ role: 'MODERATOR' })
      .where(
        and(
          eq(communityMemberTable.profileId, targetProfileId),
          eq(communityMemberTable.communityId, communityId)
        )
      )
      .returning();

    revalidatePath(`/communities/${communityId}`);
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
