'use client'

import { logClient } from '@/lib/logging/client-logger';

export default function ErrorPage({ error }: { error: Error }) {
	logClient('error', 'PAGE ERROR', { error });

  return (
		<div>
			<h2>
				<a href='/'>Volver a la página principal</a>
			</h2>
      <hr />
			<h1>Oops!</h1>
			<p>Algo salió mal, ¡inténtalo de nuevo!</p>

			<p>
				Detalles del error:
				<pre>{JSON.stringify(error, null, 2)}</pre>
			</p>
			<p>Si el problema persiste, por favor contacta al soporte.</p>
			<p>{error.message}</p>
		</div>
	);
}
