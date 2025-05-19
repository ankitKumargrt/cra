import { L3Dashboard } from "@/components/dashboard/L3Dashboard"
import { PageTransition } from "@/components/ui/page-transition"
import AuthenticatedPage from "@/components/auth/AuthenticatedPage"

export default function Dashboard() {
  return (
    <AuthenticatedPage requiredRole="L3">
      <PageTransition>
        <L3Dashboard />
      </PageTransition>
    </AuthenticatedPage>
  )
}
