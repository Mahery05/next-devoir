// ...
import Header from "@/components/Header";
// ...
 
export default function ReservationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}