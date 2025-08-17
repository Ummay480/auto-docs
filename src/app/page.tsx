import { Header } from '@/components/layout/header';
import { DocuFillClient } from '@/components/docufill/docufill-client';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <DocuFillClient />
      </main>
    </div>
  );
}
