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

  const profile = await db.profile.findUnique({
    where: { id: user.id }
  });

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
    const membership = await db.communityMember.findUnique({
      where: {
        profileId_communityId: {
          profileId: profile.id,
          communityId
        }
      }
    });

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
    const message = await db.communityMessage.create({
      data: {
        content: content.trim(),
        roomName: cleanRoomName,
        profileId: profile.id,
        communityId
      },
      include: {
        profile: true
      }
    });

    revalidatePath(`/communities/${communityId}`);
    return { success: true, data: message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Delegate moderator role to another APPROVED member (max 3 moderators)
export async function delegateModerator(communityId: number, targetProfileId: string) {
  try {
    const profile = await getAuthenticatedProfile();

    // Check sender's authorization (must be MODERATOR in the community or ADMIN in profile)
    const senderMembership = await db.communityMember.findUnique({
      where: {
        profileId_communityId: {
          profileId: profile.id,
          communityId
        }
      }
    });

    const isSenderAuthorized = profile.role === 'ADMIN' || senderMembership?.role === 'MODERATOR';
    if (!isSenderAuthorized) {
      return { success: false, error: 'Akses ditolak. Anda tidak memiliki wewenang untuk mendelegasikan moderator.' };
    }

    // Check target's membership status (must be APPROVED)
    const targetMembership = await db.communityMember.findUnique({
      where: {
        profileId_communityId: {
          profileId: targetProfileId,
          communityId
        }
      }
    });

    if (!targetMembership || targetMembership.status !== 'APPROVED') {
      return { success: false, error: 'Target pengguna belum menjadi anggota yang disetujui di komunitas ini.' };
    }

    if (targetMembership.role === 'MODERATOR') {
      return { success: false, error: 'Target pengguna sudah menjadi moderator.' };
    }

    // Check current moderator count limit (max 3)
    const modCount = await db.communityMember.count({
      where: {
        communityId,
        role: 'MODERATOR',
        status: 'APPROVED'
      }
    });

    if (modCount >= 3) {
      return { success: false, error: 'Jumlah moderator maksimal (3) telah tercapai.' };
    }

    // Update role
    const updated = await db.communityMember.update({
      where: {
        profileId_communityId: {
          profileId: targetProfileId,
          communityId
        }
      },
      data: {
        role: 'MODERATOR'
      }
    });

    revalidatePath(`/communities/${communityId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
