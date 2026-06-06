'use client';

export default function ProductCard({ product, onContactSeller }) {
  const isAvailable = product.status === 'Tersedia';

  return (
    <div className="neo-card interactive !m-0 bg-white flex flex-col justify-between">
      <div>
        {/* Product image mockup */}
        <div className="aspect-[16/10] bg-cream border-2 border-neo-black rounded-md flex items-center justify-center text-5xl mb-4 relative shadow-[inset_2px_2px_0_0_#1A1A1A]">
          {product.image || '📦'}
          <span className={`neo-badge absolute top-2 right-2 !text-[10px] !py-0.5 !px-2 ${
            isAvailable ? '!bg-mint' : '!bg-orange'
          }`}>
            {product.status}
          </span>
        </div>

        {/* Product Details */}
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-base md:text-lg leading-tight m-0">{product.title}</h4>
          <span className="neo-badge !bg-white !text-[10px] !py-0.5 !px-2 whitespace-nowrap">
            {product.condition}
          </span>
        </div>

        <div className="text-lg md:text-xl font-black text-blue mb-2">
          {product.price}
        </div>

        <p className="text-xs md:text-sm text-neo-black/70 font-semibold mb-4 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Footer / Actions */}
      <div className="flex justify-between items-center border-t-2 border-dashed border-neo-black pt-3 mt-3">
        <div className="text-[10px] md:text-xs font-bold text-neo-black/50">
          📍 {product.location}
        </div>

        <button 
          onClick={() => onContactSeller(product.seller)}
          className="neo-btn small blue !m-0 !py-1 !px-2.5 text-[10px] md:text-xs"
        >
          Hubungi Penjual 💬
        </button>
      </div>
    </div>
  );
}
