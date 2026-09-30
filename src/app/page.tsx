import Image from "next/image";

export default function Home() {
  const renderedAt = new Date().toISOString();
  console.log("Rendering Home at", renderedAt);

  return (
    <main className="min-h-screen grid place-items-center">
      <h1 className="text-5xl">Lorecrafter</h1>
      <p className="text-sm opacity-60">Rendered at {renderedAt}</p>
    </main>
  );
}
