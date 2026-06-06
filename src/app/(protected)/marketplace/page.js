'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/features/marketplace/ProductCard';
import AddProductForm from '@/components/features/marketplace/AddProductForm';

const initialProducts = [
  {
    id: 1,
    title: 'Sepeda Gunung Phoenix',
    price: 'Rp 650.000',
    condition: 'Baik',
    location: 'Gg. Kalimasada',
    description: 'Sepeda jarang dipakai, ban masih tebal. Rem depan belakang pakem. Minus agak berkarat dikit di rantai tapi sudah diberi pelumas.',
    image: '🚲',
    status: 'Tersedia',
    seller: 'KatingAlmetKuning'
  },
  {
    id: 2,
    title: 'Jaket Hoodie H&M Grey (Size L)',
    price: 'Rp 120.000',
    condition: 'Sangat Baik',
    location: 'Sekaran Barat',
    description: 'Hoodie original, jarang dipakai. Warna masih pekat, tidak melar. Dijual karena kekecilan.',
    image: '🧥',
    status: 'Tersedia',
    seller: 'AnonKimia'
  },
  {
    id: 3,
    title: 'Magic Com Miyako Kecil',
    price: 'Rp 90.000',
    condition: 'Bekas',
    location: 'Gg. Pete',
    description: 'Magic com mini pas buat anak kos. Masih berfungsi normal buat masak nasi dan angetin makanan. Panci anti lengket ada baret halus.',
    image: '🍳',
    status: 'Tersedia',
    seller: 'MabaSambatTI'
  }
];

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedProducts = localStorage.getItem('unnes_marketplace_products');
    setProducts(savedProducts ? JSON.parse(savedProducts) : initialProducts);
  }, []);

  const handleAddProduct = (newProduct) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('unnes_marketplace_products', JSON.stringify(updated));
    setIsModalOpen(false);
  };

  const handleContactSeller = (sellerName) => {
    // Navigate to messages page
    router.push('/messages');
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_0.8fr] gap-4 md:gap-5">
      {/* Left Column */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl md:text-2xl uppercase mb-1">🛍️ Sekaran Marketplace</h2>
          <p className="text-neo-black/70 font-semibold text-xs md:text-sm">Pasar loak digital mahasiswa UNNES. COD gampang di sekitar Sekaran.</p>
        </div>

        {/* Search Bar */}
        <div className="neo-card !p-3.5 !mb-0">
          <input
            type="text"
            className="form-control !p-2.5 !m-0 !text-xs !shadow-neo-sm"
            placeholder="Cari barang bekas kosan (sepeda, rice cooker, jas lab, hoodie)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="neo-card text-center py-8 px-4">
            <span className="text-4xl block mb-2">📦</span>
            <h3 className="text-sm font-extrabold">Barang tidak ditemukan</h3>
            <p className="text-neo-black/60 mt-1 text-xs">Coba cari dengan kata kunci lain atau jadilah yang pertama menjual barang ini!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onContactSeller={handleContactSeller} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="hidden lg:flex flex-col gap-4">
        {/* Sell Button Widget */}
        <div className="neo-card !p-4 !mb-0 bg-blue text-white">
          <h3 className="text-base text-white mb-2">Punya barang tak terpakai? 📦</h3>
          <p className="text-xs text-white/90 font-semibold mb-3">Jual barang kosan Anda ke sesama mahasiswa UNNES dengan cepat.</p>
          <button className="neo-btn small orange w-full justify-center !m-0" onClick={() => setIsModalOpen(true)}>
            Jual Barang ➕
          </button>
        </div>

        {/* COD Safety Widget */}
        <div className="neo-card !p-4 !mb-0">
          <h3 className="text-sm mb-2.5">🛡️ Panduan COD Aman</h3>
          <ul className="list-disc pl-4 text-[11px] font-semibold text-neo-black/80 space-y-1.5">
            <li>Lakukan COD di tempat ramai/terbuka (seperti perpustakaan, teras GSG, atau depan rektorat).</li>
            <li>Cek kondisi barang secara teliti sebelum menyerahkan uang.</li>
            <li>Gunakan pembayaran nontunai (QRIS/Transfer) jika nominalnya besar.</li>
          </ul>
        </div>
      </div>

      <AddProductForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}
