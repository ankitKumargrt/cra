"use client"
import { ThreeDMarquee } from "@/components/ui/3d-marquee"

export default function ThreeDMarqueeDemo() {
  // Financial-themed images for the marquee
  const images = [
    // Financial dashboard features
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1132_Image%20Generation_simple_compose_01jr4v3mwnfs38nca5874efszn-d21lBNBCNsqISrOdOzSBULjmNL6qUa.png", // Data Extraction
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1129_Image%20Generation_simple_compose_01jr4tydjzfd8v7k90q2xwzg8x-t3bx2dFuZJaGFZZB0rx1hupGuhimgX.png", // Document Upload
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1136_Image%20Generation_simple_compose_01jr4v9r3wf89vt1gqwbvdexvh-WxPBmRgbtFgJIr3xD16EX92Rrq2u6I.png", // Credit Score
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1155_Image%20Generation_simple_compose_01jr4wdrybe8q8qrb832cja20j-jMgRnU5R1zGbxwq4gdZZPQSN3DfYWt.png", // Loan Recommendation

    // Additional financial-themed images
    "/placeholder.svg?height=700&width=970",
    "/placeholder.svg?height=700&width=970",
    "/placeholder.svg?height=700&width=970",
    "/placeholder.svg?height=700&width=970",

    // Repeat the main images to fill the grid
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1132_Image%20Generation_simple_compose_01jr4v3mwnfs38nca5874efszn-d21lBNBCNsqISrOdOzSBULjmNL6qUa.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1129_Image%20Generation_simple_compose_01jr4tydjzfd8v7k90q2xwzg8x-t3bx2dFuZJaGFZZB0rx1hupGuhimgX.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1136_Image%20Generation_simple_compose_01jr4v9r3wf89vt1gqwbvdexvh-WxPBmRgbtFgJIr3xD16EX92Rrq2u6I.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1155_Image%20Generation_simple_compose_01jr4wdrybe8q8qrb832cja20j-jMgRnU5R1zGbxwq4gdZZPQSN3DfYWt.png",

    // More placeholder images to ensure we have enough for the grid
    "/placeholder.svg?height=700&width=970",
    "/placeholder.svg?height=700&width=970",
    "/placeholder.svg?height=700&width=970",
    "/placeholder.svg?height=700&width=970",

    // Repeat again if needed
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1132_Image%20Generation_simple_compose_01jr4v3mwnfs38nca5874efszn-d21lBNBCNsqISrOdOzSBULjmNL6qUa.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1129_Image%20Generation_simple_compose_01jr4tydjzfd8v7k90q2xwzg8x-t3bx2dFuZJaGFZZB0rx1hupGuhimgX.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1136_Image%20Generation_simple_compose_01jr4v9r3wf89vt1gqwbvdexvh-WxPBmRgbtFgJIr3xD16EX92Rrq2u6I.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250406_1155_Image%20Generation_simple_compose_01jr4wdrybe8q8qrb832cja20j-jMgRnU5R1zGbxwq4gdZZPQSN3DfYWt.png",

    // Final set of placeholders
    "/placeholder.svg?height=700&width=970",
    "/placeholder.svg?height=700&width=970",
    "/placeholder.svg?height=700&width=970",
    "/placeholder.svg?height=700&width=970",
  ]

  return (
    <div className="mx-auto my-10 max-w-7xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDMarquee images={images} />
    </div>
  )
}
