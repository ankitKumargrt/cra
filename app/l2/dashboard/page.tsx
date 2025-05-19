import { L2Dashboard } from "@/components/dashboard/L2Dashboard"
import { PageTransition } from "@/components/ui/page-transition"
import AuthenticatedPage from "@/components/auth/AuthenticatedPage"

export default function Dashboard() {
  return (
    <AuthenticatedPage requiredRole="L2">
      <PageTransition>
        <L2Dashboard />
      </PageTransition>
    </AuthenticatedPage>
  )
}
