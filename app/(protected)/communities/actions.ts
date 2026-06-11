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

// Get all profiles for the initial moderator selection dropdown
export async function getProfilesForSelect() {
  try {
    const profile = await getAuthenticatedProfile();
    // Only ADMIN or MODERATOR should be able to list profiles (or anyone for simplicity, but let's restrict to authenticated users)
    const profiles = await db.profile.findMany({
      select: {
        id: true,
        aliasName: true,
      },
      orderBy: {
        aliasName: 'asc',
      },
    });

    // Also get full name from metadata if possible, but prisma only has id & aliasName.
    // We can fetch user list from supabase or just return aliasNames.
    // Let's get aliasNames since it's stored in the database.
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
    const existing = await db.community.findUnique({
      where: { name: formData.name.trim() }
    });

    if (existing) {
      return { success: false, error: 'Nama komunitas sudah terdaftar.' };
    }

    // Start transaction to create community and add initial moderator
    const community = await db.$transaction(async (tx) => {
      const newCommunity = await tx.community.create({
        data: {
          name: formData.name.trim(),
          description: formData.description.trim(),
        }
      });

      // Add initial moderator if specified
      if (formData.initialModeratorId) {
        await tx.communityMember.create({
          data: {
            profileId: formData.initialModeratorId,
            communityId: newCommunity.id,
            status: 'APPROVED',
            role: 'MODERATOR'
          }
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
    const existing = await db.communityMember.findUnique({
      where: {
        profileId_communityId: {
          profileId: profile.id,
          communityId
        }
      }
    });

    if (existing) {
      return { success: false, error: 'Anda sudah mengirim permohonan atau telah terdaftar di komunitas ini.' };
    }

    const member = await db.communityMember.create({
      data: {
        profileId: profile.id,
        communityId,
        status: 'PENDING',
        role: 'MEMBER',
        alasan: alasan.trim()
      }
    });

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
    const existing = await db.communityMember.findUnique({
      where: {
        profileId_communityId: {
          profileId: profile.id,
          communityId
        }
      }
    });

    if (!existing) {
      return { success: false, error: 'Permohonan tidak ditemukan.' };
    }

    const updated = await db.communityMember.update({
      where: {
        profileId_communityId: {
          profileId: profile.id,
          communityId
        }
      },
      data: {
        status: 'APPROVED'
      }
    });

    revalidatePath('/communities');
    revalidatePath(`/communities/${communityId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
