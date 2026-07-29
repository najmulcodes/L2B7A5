import type { Metadata } from "next";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthHydrator } from "@/components/providers/auth-hydrator";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GearUp - Rent Sports & Outdoor Gear Instantly",
    template: "%s | GearUp",
  },
  description:
    "Browse and rent sports and outdoor equipment from local providers. Kayaks, tents, bikes, and more - delivered or picked up, paid securely online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="gearup">
      <body className="min-h-screen flex flex-col antialiased">
        <QueryProvider>
          <AuthHydrator />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toaster position="top-center" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
