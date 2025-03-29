import Hero from "@/components/hero";
import Paragraph from "@/components/paragraph";
import Gallery from "@/components/gallery";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eedac5] to-[#ffe1e4]">
      <Hero />
      <Paragraph />
      <Gallery />
    </main>
  );
}
