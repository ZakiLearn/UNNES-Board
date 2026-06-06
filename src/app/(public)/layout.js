import GuestHeader from '@/components/layout/GuestHeader';

export default function PublicLayout({ children }) {
  return (
    <>
      <GuestHeader />
      <div className="max-w-[1200px] mx-auto px-4 md:px-5 py-5 min-h-[80vh]">
        {children}
      </div>
    </>
  );
}
