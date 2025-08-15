import Header from '@/components/Header';
import FocusFlowApp from '@/components/FocusFlowApp';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <FocusFlowApp />
      </main>
    </div>
  );
}
