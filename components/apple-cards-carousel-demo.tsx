"use client"
import Image from "next/image"
import { Card } from "@/components/ui/apple-cards-carousel"

export default function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => <Card key={card.src} card={card} index={index} />)

  return (
    <div className="w-full h-full py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">{cards}</div>
      </div>
    </div>
  )
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(1).fill(1)].map((_, index) => {
        return (
          <div key={"dummy-content" + index} className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
            <p className="text-neutral-600 dark:text-neutral-400 text-xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first step in our streamlined process.
              </span>{" "}
              Our AI-powered platform analyzes your financial documents and delivers accurate credit assessments in just
              minutes. Upload your key documents, and let our system determine your eligible loan amount—with all
              figures calculated in Indian Rupees (₹).
            </p>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250403_1456_Document%20Upload%20Animations_simple_compose_01jqxfj7zkfbds0ydx9yramnv7-MdFS1xCZurvAA41oET0zF4nQkUqvkV.png"
              alt="Document upload interface"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        )
      })}
    </>
  )
}

const data = [
  {
    category: "Step 1",
    title: "Document Upload",
    src: "/images/ai-document-management.png",
    content: (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 dark:text-neutral-400 text-xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">Upload your documents with ease.</span>{" "}
          Drag and drop your five financial documents (PAN, Aadhaar, Form 16, etc.). Enjoy smooth animations that
          confirm each successful upload.
        </p>
        <Image
          src="/images/ai-document-management.png"
          alt="Document upload interface"
          height="500"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8"
        />
      </div>
    ),
  },
  {
    category: "Step 2",
    title: "Data Extraction",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1132_Image%20Generation_simple_compose_01jr4v3mwnfs38nca5874efszn-d21lBNBCNsqISrOdOzSBULjmNL6qUa.png",
    content: (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 dark:text-neutral-400 text-xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">Intelligent data extraction.</span> Our
          system quickly reads and extracts critical data from your documents, populating interactive fields with
          real-time feedback.
        </p>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1132_Image%20Generation_simple_compose_01jr4v3mwnfs38nca5874efszn-d21lBNBCNsqISrOdOzSBULjmNL6qUa.png"
          alt="Data extraction visualization"
          height="500"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8"
        />
      </div>
    ),
  },
  {
    category: "Step 3",
    title: "Credit Score Calculation",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1136_Image%20Generation_simple_compose_01jr4v9r3wf89vt1gqwbvdexvh-WxPBmRgbtFgJIr3xD16EX92Rrq2u6I.png",
    content: (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 dark:text-neutral-400 text-xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">Advanced AI credit analysis.</span> AI will
          compute your creditworthiness, using precise algorithms that consider every financial nuance.
        </p>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1136_Image%20Generation_simple_compose_01jr4v9r3wf89vt1gqwbvdexvh-WxPBmRgbtFgJIr3xD16EX92Rrq2u6I.png"
          alt="Credit score calculation"
          height="500"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8"
        />
      </div>
    ),
  },
  {
    category: "Step 4",
    title: "Loan Recommendation",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1155_Image%20Generation_simple_compose_01jr4wdrybe8q8qrb832cja20j-jMgRnU5R1zGbxwq4gdZZPQSN3DfYWt.png",
    content: (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 dark:text-neutral-400 text-xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">Personalized loan recommendations.</span>{" "}
          Receive a personalized loan amount recommendation along with an AI generated report of financial wellbeing and
          spending habits.
        </p>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1155_Image%20Generation_simple_compose_01jr4wdrybe8q8qrb832cja20j-jMgRnU5R1zGbxwq4gdZZPQSN3DfYWt.png"
          alt="Loan recommendation interface"
          height="500"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8"
        />
      </div>
    ),
  },
]
