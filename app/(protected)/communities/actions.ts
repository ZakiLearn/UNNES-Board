'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profile as profileTable, community as communityTable, communityMember as communityMemberTable } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Helper to get authenticated user profile
async function getAuthenticatedProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Sesi Anda telah berakhir. Silakan masuk kembali.');
  }

  const existing = await db.select().from(profileTable).where(eq(profileTable.id, user.id)).limit(1);
  let profile = existing[0];

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

// Get all profiles for the initial moderator selection dropdown
export async function getProfilesForSelect() {
  try {
    const profile = await getAuthenticatedProfile();
    const profiles = await db.select({
      id: profileTable.id,
      aliasName: profileTable.aliasName,
    }).from(profileTable).orderBy(asc(profileTable.aliasName));

    return { success: true, data: profiles };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Create a new community (ADMIN only)
export async function createCommunity(formData: { name: string; description: string; initialModeratorId: string }) {
  try {
    const profile = await getAuthenticatedProfile();

    if (profile.role !== 'ADMIN') {
      return { success: false, error: 'Akses ditolak. Hanya Admin yang dapat membuat komunitas.' };
    }

    if (!formData.name || formData.name.trim() === '') {
      return { success: false, error: 'Nama komunitas tidak boleh kosong.' };
    }

    if (!formData.description || formData.description.trim() === '') {
      return { success: false, error: 'Deskripsi komunitas tidak boleh kosong.' };
    }

    // Check if name is unique
    const existingList = await db.select().from(communityTable).where(eq(communityTable.name, formData.name.trim())).limit(1);

    if (existingList.length > 0) {
      return { success: false, error: 'Nama komunitas sudah terdaftar.' };
    }

    // Start transaction to create community and add initial moderator
    const community = await db.transaction(async (tx) => {
      const [newCommunity] = await tx.insert(communityTable).values({
        name: formData.name.trim(),
        description: formData.description.trim(),
      }).returning();

      // Add initial moderator if specified
      if (formData.initialModeratorId) {
        await tx.insert(communityMemberTable).values({
          profileId: formData.initialModeratorId,
          communityId: newCommunity.id,
          status: 'APPROVED',
          role: 'MODERATOR'
        });
      }

      return newCommunity;
    });

    revalidatePath('/communities');
    return { success: true, data: community };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Request to join a community (Mahasiswa)
export async function joinCommunityRequest(communityId: number, alasan: string) {
  try {
    const profile = await getAuthenticatedProfile();

    if (!alasan || alasan.trim() === '') {
      return { success: false, error: 'Alasan bergabung wajib diisi.' };
    }

    // Check if already a member or pending
    const existingList = await db.select().from(communityMemberTable).where(
      and(
        eq(communityMemberTable.profileId, profile.id),
        eq(communityMemberTable.communityId, communityId)
      )
    ).limit(1);

    if (existingList.length > 0) {
      return { success: false, error: 'Anda sudah mengirim permohonan atau telah terdaftar di komunitas ini.' };
    }

    const [member] = await db.insert(communityMemberTable).values({
      profileId: profile.id,
      communityId,
      status: 'PENDING',
      role: 'MEMBER',
      alasan: alasan.trim()
    }).returning();

    revalidatePath('/communities');
    return { success: true, data: member };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Simulated auto-approval after 2 seconds
export async function simulatedApproveMember(communityId: number) {
  try {
    const profile = await getAuthenticatedProfile();

    // Verify record exists and is pending
    const existingList = await db.select().from(communityMemberTable).where(
      and(
        eq(communityMemberTable.profileId, profile.id),
        eq(communityMemberTable.communityId, communityId)
      )
    ).limit(1);

    if (existingList.length === 0) {
      return { success: false, error: 'Permohonan tidak ditemukan.' };
    }

    const [updated] = await db.update(communityMemberTable)
      .set({ status: 'APPROVED' })
      .where(
        and(
          eq(communityMemberTable.profileId, profile.id),
          eq(communityMemberTable.communityId, communityId)
        )
      )
      .returning();

    revalidatePath('/communities');
    revalidatePath(`/communities/${communityId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
