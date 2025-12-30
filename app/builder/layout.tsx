import ErrorBoundary from '@/components/ErrorBoundary'

export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Allow unauthenticated users - they'll get demo mode
  // Auth check happens in BuildFlowController for project persistence
  
  return <ErrorBoundary>{children}</ErrorBoundary>
}