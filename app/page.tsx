import { PageTransition } from "@/components/ui/page-transition"
import { LandingPage } from "@/components/landing/LandingPage"

export default function Home() {
  return (
    <PageTransition>
      <LandingPage />
    </PageTransition>
  )
}
