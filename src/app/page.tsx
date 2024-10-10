import HeroComponent from "./hero.component";

export default function Home() {
  return (
    <main className="min-h-screen flex-col items-center  flex flex-grow">
      <div className="max-w-6xl">
        <HeroComponent />
      </div>
      <div className="max-w-4xl">
        <HeroComponent />
      </div>

      <div className="max-w-2xl">
        <HeroComponent />
      </div>
    </main >
  );
}
