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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', marginBottom: '8px' }}>🛍️ Sekaran Marketplace</h2>
          <p style={{ color: 'rgba(26,26,26,0.7)', fontWeight: 600 }}>Pasar loak digital mahasiswa UNNES. COD gampang di sekitar Sekaran.</p>
        </div>
        
        <button className="neo-btn blue" onClick={() => setIsModalOpen(true)} style={{ margin: 0 }}>
          Jual Barang ➕
        </button>
      </div>

      {/* Search Bar */}
      <div className="neo-card" style={{ padding: '16px', marginBottom: 0 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Cari barang bekas kosan (sepeda, rice cooker, jas lab, hoodie)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '12px 16px', margin: 0 }}
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="neo-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <span style={{ fontSize: '3rem' }}>📦</span>
          <h3 style={{ marginTop: '12px' }}>Barang tidak ditemukan</h3>
          <p style={{ color: 'rgba(26,26,26,0.6)', marginTop: '8px' }}>Coba cari dengan kata kunci lain atau jadilah yang pertama menjual barang ini!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onContactSeller={handleContactSeller} 
            />
          ))}
        </div>
      )}

      <AddProductForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}
