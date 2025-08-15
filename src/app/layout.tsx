import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // FIX: Import Inter
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import './globals.css';

// FIX: Configure the font using next/font/google and CSS variables
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'FocusFlow',
  description: 'A minimalist music app designed to enhance focus during study sessions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIX: Apply the font variable class to html
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      {/* FIX: Removed manual <link> tags from <head> */}
      <body className={cn("font-body antialiased")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
