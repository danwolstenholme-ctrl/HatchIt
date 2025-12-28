import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ErrorBoundary from '@/components/ErrorBoundary'

export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return <ErrorBoundary>{children}</ErrorBoundary>
}