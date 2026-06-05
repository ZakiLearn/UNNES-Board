'use client';

export default function ProductCard({ product, onContactSeller }) {
  const isAvailable = product.status === 'Tersedia';

  return (
    <div className="neo-card interactive" style={{
      margin: 0,
      backgroundColor: 'var(--bg-white)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <div>
        {/* Product image mockup */}
        <div style={{
          aspectRatio: '16/10',
          background: 'var(--bg-cream)',
          border: 'var(--border-stroke)',
          borderRadius: 'var(--border-radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          marginBottom: '16px',
          boxShadow: 'inner 2px 2px 0 0 var(--color-black)',
          position: 'relative'
        }}>
          {product.image || '📦'}
          <span className="neo-badge" style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: isAvailable ? 'var(--accent-mint)' : 'var(--accent-orange)',
            fontSize: '0.65rem'
          }}>
            {product.status}
          </span>
        </div>

        {/* Product Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h4 style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>{product.title}</h4>
          <span className="neo-badge" style={{ backgroundColor: 'var(--bg-white)', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
            {product.condition}
          </span>
        </div>

        <div style={{
          fontSize: '1.2rem',
          fontWeight: 900,
          color: 'var(--accent-blue)',
          marginBottom: '8px'
        }}>
          {product.price}
        </div>

        <p style={{
          fontSize: '0.85rem',
          color: 'rgba(26,26,26,0.7)',
          fontWeight: 600,
          marginBottom: '16px',
          lineHeight: '1.4'
        }}>
          {product.description}
        </p>
      </div>

      {/* Footer / Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '2px dashed var(--color-black)',
        paddingTop: '12px',
        marginTop: '12px'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(26,26,26,0.5)' }}>
          📍 {product.location}
        </div>

        <button 
          onClick={() => onContactSeller(product.seller)}
          className="neo-btn small blue"
          style={{ padding: '6px 12px', fontSize: '0.75rem', margin: 0 }}
        >
          Hubungi Penjual 💬
        </button>
      </div>
    </div>
  );
}
