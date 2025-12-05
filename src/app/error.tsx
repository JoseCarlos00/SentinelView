'use client'

export default function ErrorPage({ error }: { error: Error }) {
  console.error(error);

  return <div>Algo salió mal, ¡inténtalo de nuevo!</div>;
}
