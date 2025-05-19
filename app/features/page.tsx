import FeatureCardsSection from "@/components/feature-cards-section"
import { PageTransition } from "@/components/ui/page-transition"

export default function FeaturesPage() {
  return (
    <PageTransition>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Our Features</h1>
        <FeatureCardsSection />
      </div>
    </PageTransition>
  )
}
