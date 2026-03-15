import Hero from "@/components/Hero";
import About from "@/components/About";
import SignatureDishes from "@/components/SignatureDishes";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import AIChatbot from "@/components/AIChatbot";
import WelcomeEntry from "@/components/WelcomeEntry";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <WelcomeEntry />
      <Hero />
      <About />
      <SignatureDishes />
      <Experience />
      <Gallery />
      <Contact />
      <AIChatbot />
    </div>
  );
}
