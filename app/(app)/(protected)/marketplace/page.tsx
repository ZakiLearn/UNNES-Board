import React from "react";
import { db } from "@/lib/db";
import { marketplaceItem, profile } from "@/lib/db/schema";
import { eq, desc, and, ilike } from "drizzle-orm";
import Link from "next/link";
import MarketplaceFilter from "./_components/MarketplaceFilter";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function MarketplacePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const searchVal = resolvedParams.search || "";
  const categoryVal = resolvedParams.category || "";

  // Bangun query conditions secara dinamis
  const conditions = [eq(marketplaceItem.sold, false)];

  if (searchVal) {
    conditions.push(ilike(marketplaceItem.title, `%${searchVal}%`));
  }

  if (categoryVal) {
    conditions.push(eq(marketplaceItem.category, categoryVal));
  }

  // Ambil data produk aktif dari database Drizzle, join dengan profil penjual
  const activeItems = await db
    .select({
      id: marketplaceItem.id,
      title: marketplaceItem.title,
      price: marketplaceItem.price,
      condition: marketplaceItem.condition,
      category: marketplaceItem.category,
      imageUrl: marketplaceItem.imageUrl,
      location: marketplaceItem.location,
      createdAt: marketplaceItem.createdAt,
      sellerAlias: profile.aliasName,
    })
    .from(marketplaceItem)
    .leftJoin(profile, eq(marketplaceItem.sellerId, profile.id))
    .where(and(...conditions))
    .orderBy(desc(marketplaceItem.createdAt));

  // Helper formatting rupiah
  const formatRupiah = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  // Helper untuk badge color neobrutalist berdasarkan category/condition
  const getBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "buku":
        return "bg-sky";
      case "gadget":
        return "bg-mint";
      case "kos":
        return "bg-orange";
      case "fashion":
        return "bg-cream";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-black text-neo-black tracking-tight uppercase">
            Pasar Kampus
          </h1>
          <p className="font-heading font-bold text-neo-black/80">
            Cari buku pelajaran bekas, kost-kostan, atau tawarkan keahlian Anda di sini.
          </p>
        </div>
        <Link href="/marketplace/create" className="neo-btn flex items-center gap-2 w-fit">
          <span>➕</span> Pasang Iklan Baru
        </Link>
      </div>

      {/* Filter Component */}
      <MarketplaceFilter initialSearch={searchVal} initialCategory={categoryVal} />

      {/* Grid of Listings */}
      {activeItems.length === 0 ? (
        <div className="neo-card bg-cream text-center p-12">
          <p className="text-2xl font-heading font-black text-neo-black">
            Tidak ada iklan barang dagangan yang cocok.
          </p>
          <p className="font-semibold text-neo-black/80 mt-2">
            Coba sesuaikan kata kunci pencarian atau kategori filter Anda.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeItems.map((item) => (
            <div
              key={item.id}
              className="neo-card interactive bg-white flex flex-col justify-between"
            >
              <div>
                {/* Product preview */}
                <div className="relative aspect-video w-full bg-cream border-2 border-neo-black rounded-md overflow-hidden shadow-neo-sm mb-4">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex w-full h-full items-center justify-center text-6xl">
                      📦
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`neo-badge ${getBadgeColor(item.category)} small`}>
                      {item.category}
                    </span>
                    <span className="neo-badge bg-white small">
                      {item.condition}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-lg text-neo-black line-clamp-2 min-h-[56px]">
                    {item.title}
                  </h3>
                  <p className="text-2xl font-heading font-black text-neo-black bg-orange/20 border-2 border-neo-black inline-block px-3 py-1 rounded-sm shadow-neo-sm">
                    {formatRupiah(item.price)}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-neo-black/10 space-y-4">
                <div className="text-xs font-semibold text-neo-black/75 space-y-1">
                  <p>
                    👤 Penjual:{" "}
                    <span className="font-heading font-black text-neo-black">
                      {item.sellerAlias || "Anonim"}
                    </span>
                  </p>
                  <p>📍 Lokasi: {item.location}</p>
                  <p>
                    🕒 Diiklankan:{" "}
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <Link href={`/marketplace/${item.id}`} className="block w-full">
                  <button className="w-full neo-btn sky text-center font-heading font-black">
                    Detail Barang
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

