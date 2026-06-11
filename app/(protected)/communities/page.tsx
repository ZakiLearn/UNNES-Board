import React from "react";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CommunitiesClient from "./CommunitiesClient";

export default async function CommunitiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch current user's profile
  const profile = await db.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  // Fetch all communities and include the count of approved members
  const communities = await db.community.findMany({
    include: {
      _count: {
        select: {
          members: {
            where: {
              status: "APPROVED"
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Fetch the current user's memberships
  const myMemberships = await db.communityMember.findMany({
    where: {
      profileId: user.id
    }
  });

  // Fetch all profiles to populate the dropdown for selecting initial moderator (for ADMINs)
  const allProfiles = await db.profile.findMany({
    select: {
      id: true,
      aliasName: true
    },
    orderBy: {
      aliasName: "asc"
    }
  });

  // Map the structures to simple serialization-safe formats
  const serializedCommunities = communities.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description,
    memberCount: c._count.members,
    createdAt: c.createdAt.toISOString()
  }));

  const serializedMemberships = myMemberships.map(m => ({
    communityId: m.communityId,
    status: m.status,
    role: m.role
  }));

  const serializedProfiles = allProfiles.map(p => ({
    id: p.id,
    aliasName: p.aliasName || "Anonim"
  }));

  return (
    <CommunitiesPageContent
      profile={{
        id: profile.id,
        role: profile.role,
        aliasName: profile.aliasName
      }}
      communities={serializedCommunities}
      memberships={serializedMemberships}
      allProfiles={serializedProfiles}
    />
  );
}

// Separate container component to pass variables clean to CommunitiesClient (client component)
function CommunitiesPageContent({
  profile,
  communities,
  memberships,
  allProfiles
}: {
  profile: { id: string; role: string; aliasName: string | null };
  communities: Array<{ id: number; name: string; description: string; memberCount: number; createdAt: string }>;
  memberships: Array<{ communityId: number; status: string; role: string }>;
  allProfiles: Array<{ id: string; aliasName: string }>;
}) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-black text-neo-black tracking-tight uppercase">
            Komunitas UNNES-Board
          </h1>
          <p className="font-heading font-bold text-neo-black/80">
            Temukan ruang diskusi, himpunan mahasiswa, dan grup belajar resmi di lingkungan Universitas Negeri Semarang.
          </p>
        </div>
      </div>
      <CommunitiesClient
        profile={profile}
        communities={communities}
        initialMemberships={memberships}
        allProfiles={allProfiles}
      />
    </div>
  );
}
