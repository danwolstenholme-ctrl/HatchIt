import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// PROTECTED: Everything behind the gate
// Keep build/refine APIs public so /demo guests can generate sections.
const isProtectedRoute = createRouteMatcher([
  '/builder(.*)',
  '/dashboard(.*)',
  '/api/project(.*)',
  '/api/generate(.*)',
  '/api/export(.*)',
  '/api/deploy(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
