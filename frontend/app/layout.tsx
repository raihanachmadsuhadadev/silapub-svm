import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SILAPUB SVM",
  description: "Sistem Layanan Aspirasi Publik berbasis web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full overflow-x-hidden">{children}</body>
    </html>
  );
}
