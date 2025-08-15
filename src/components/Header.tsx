import { Music4 } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-4 px-6 md:px-8 border-b bg-card">
      <div className="container mx-auto flex items-center gap-3">
        <Music4 className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">
          FocusFlow
        </h1>
      </div>
    </header>
  );
}
