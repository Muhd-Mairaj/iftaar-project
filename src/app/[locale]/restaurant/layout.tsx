export default async function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in fade-in duration-300 min-h-0 flex flex-col flex-1 gap-3">
      {children}
    </div>
  );
}
