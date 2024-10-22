import Hero from "@/src/components/landing/Hero";
import Nav from "@/src/components/landing/Nav";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-start relative">
      <Nav />
      <Hero />
    </div>
  );
}
