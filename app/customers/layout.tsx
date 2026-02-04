export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
}
