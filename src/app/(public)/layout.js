import GuestHeader from '@/components/layout/GuestHeader';

export default function PublicLayout({ children }) {
  return (
    <>
      <GuestHeader />
      <div className="app-container" style={{ minHeight: '80vh' }}>
        {children}
      </div>
    </>
  );
}
