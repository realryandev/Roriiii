import Hero from "@/components/hero";
import Paragraph from "@/components/paragraph";
import Gallery from "@/components/gallery";
import { FloatingAnimals } from "@/components/floating-animals";
import Affirmations from "@/components/Affirmations";
import BackgroundMusic from "@/components/BackgroundMusic";


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fc94af] to-[#f25278]">
      <BackgroundMusic />
      <FloatingAnimals />
      <Hero />
      <Paragraph />
      <Gallery />
      <Affirmations />
    </main>
  );
}
