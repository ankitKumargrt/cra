import L1Dashboard from "@/components/dashboard/L1Dashboard"
import { PageTransition } from "@/components/ui/page-transition"
import AuthenticatedPage from "@/components/auth/AuthenticatedPage"

export default function Dashboard() {
  return (
    <AuthenticatedPage requiredRole="L1">
      <PageTransition>
        <L1Dashboard />
      </PageTransition>
    </AuthenticatedPage>
  )
}
