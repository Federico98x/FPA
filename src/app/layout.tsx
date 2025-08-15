import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import './globals.css';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
