import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Nombres de las cookies que usas para la autenticación
const REFRESH_TOKEN_COOKIE_NAME = 'jwt-refresh-token'; // La cookie HttpOnly que establece tu backend
const ACCESS_TOKEN_COOKIE_NAME = 'jwt-access-token';

export function proxy(request: NextRequest) {
  // 1. Obtener las cookies de la petición
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME);
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME);

  const { pathname } = request.nextUrl;

  console.log({pathname, refreshToken, accessToken});
  

  // 2. Si el usuario no está autenticado (no tiene tokens) y intenta acceder a una ruta protegida
  if (!refreshToken && !accessToken && pathname !== '/login') {
    // Redirigir a la página de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Si el usuario ya está autenticado y intenta visitar la página de login,
  // redirigirlo a la página principal.
  if ((refreshToken || accessToken) && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. Si ninguna de las condiciones anteriores se cumple, permitir que la petición continúe.
  return NextResponse.next();
}

// 5. Configuración del Matcher
// Esto define en qué rutas se ejecutará el middleware.
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de petición excepto las que empiezan por:
     * - api (rutas de API)
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico (icono de la página)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
