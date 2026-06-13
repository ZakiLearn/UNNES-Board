import React from "react";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profile as profileTable, community as communityTable, communityMember as communityMemberTable, communityMessage as communityMessageTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import CommunityClient from "./CommunityClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const communityId = parseInt(resolvedParams.id, 10);

  if (isNaN(communityId)) {
    redirect("/communities");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch active user profile
  const profileList = await db.select().from(profileTable).where(eq(profileTable.id, user.id)).limit(1);
  const profile = profileList[0];

  if (!profile) {
    redirect("/onboarding");
  }

  // Verify membership status (must be APPROVED, or user is global ADMIN)
  const membershipList = await db.select().from(communityMemberTable).where(
    and(
      eq(communityMemberTable.profileId, user.id),
      eq(communityMemberTable.communityId, communityId),
    )
  ).limit(1);
  const membership = membershipList[0];

  const isGlobalAdmin = profile.role === "ADMIN";
  const isApproved = membership?.status === "APPROVED";

  if (!isGlobalAdmin && !isApproved) {
    // If not approved (e.g. PENDING or not requested yet), block and redirect
    redirect("/communities");
  }

  // Fetch community details
  const communityList = await db.select().from(communityTable).where(eq(communityTable.id, communityId)).limit(1);
  const community = communityList[0];

  if (!community) {
    redirect("/communities");
  }

  // Fetch approved members for this community
  const membersWithProfiles = await db.query.communityMember.findMany({
    where: and(
      eq(communityMemberTable.communityId, communityId),
      eq(communityMemberTable.status, "APPROVED")
    ),
    with: {
      profile: true
    }
  });

  // Fetch all chat messages for this community
  const messages = await db.query.communityMessage.findMany({
    where: eq(communityMessageTable.communityId, communityId),
    with: {
      profile: true,
    },
    orderBy: (m, { asc }) => [asc(m.createdAt)]
  });

  const serializedCommunity = {
    id: community.id,
    name: community.name,
    description: community.description
  };

  const serializedMessages = messages.map(m => ({
    id: m.id,
    content: m.content,
    roomName: m.roomName,
    createdAt: m.createdAt.toISOString(),
    profileId: m.profileId,
    aliasName: m.profile.aliasName || "Anonim",
    isMe: m.profileId === user.id
  }));

  const serializedMembers = membersWithProfiles.map(m => ({
    profileId: m.profileId,
    aliasName: m.profile.aliasName || "Anonim",
    role: m.role
  }));

  return (
    <CommunityClient
      community={serializedCommunity}
      activeProfile={{
        id: profile.id,
        role: profile.role, // Global Profile Role (ADMIN, USER)
        aliasName: profile.aliasName,
        fullName: user.user_metadata?.full_name || profile.aliasName || "Nama Lengkap",
        membershipRole: membership?.role || "MEMBER" // Community Membership Role (MODERATOR, MEMBER)
      }}
      initialMessages={serializedMessages}
      members={serializedMembers}
    />
  );
}
