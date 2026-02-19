export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in fade-in duration-300 flex flex-col flex-1 gap-3 min-h-0 overflow-hidden">
      {children}
    </div>
  );
}
