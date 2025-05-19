"use client"
import { ThreeDImageMarquee } from "@/components/ui/3d-image-marquee"

export default function FeaturesMarquee() {
  // Feature card images with the new URLs
  const featureImages = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-07%20at%2012.40.50%E2%80%AFPM-lkPPfMaUKAxJaw3tQWwaMhbnNOzp9c.png",
      alt: "Lightning-Fast Analysis",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-07%20at%2012.41.02%E2%80%AFPM-xc4xKtcdc6SrigErZIKD7yLHcVyVjf.png",
      alt: "Accurate & Transparent",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-07%20at%2012.41.12%E2%80%AFPM-BJcNml1Djh2uBHCP7IKUMZ6Qf3y0D3.png",
      alt: "Secure & Trustworthy",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-07%20at%2012.41.24%E2%80%AFPM-reMHIooTatmlKK4JLMTWFhyxJM9CWC.png",
      alt: "Real-Time Analytics",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-07%20at%2012.41.55%E2%80%AFPM-V1kgEqNrmWjtAfxWuPGjG6VVNy5lJf.png",
      alt: "User-Friendly Interface",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-07%20at%2012.42.06%E2%80%AFPM-OS1E1wKrtJl3gbT1tLxoyVg9QLfzAT.png",
      alt: "Customizable Reports",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-07%20at%2012.42.18%E2%80%AFPM-LUJX7U3p5SIpSYsxwCsWY28FOvF6jc.png",
      alt: "Automated Workflows",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-07%20at%2012.42.29%E2%80%AFPM-cqmVVSbJAY25VajcQKDnMQ7rh5mNlJ.png",
      alt: "Comprehensive Risk Assessment",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-07%20at%2012.43.13%E2%80%AFPM-zAG9FtfHO4BVszYpxlsqr81Mwruq9L.png",
      alt: "Seamless Integration",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-07%20at%2012.43.24%E2%80%AFPM-Wv4RCcwiYiQIROZabPPJdexeTLR349.png",
      alt: "Dedicated Support",
    },
  ]

  // Duplicate the images to ensure we have enough for the grid
  const allImages = [...featureImages, ...featureImages, ...featureImages]

  return (
    <section className="min-h-screen py-24 flex flex-col justify-center bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-0">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Features That Set Us Apart
          </h2>
          <p className="text-xl mb-12 text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with user-friendly design to deliver a superior financial
            verification experience.
          </p>
        </div>

        <div className="mx-auto my-10 w-full max-w-[90%] bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800 rounded-xl">
          <ThreeDImageMarquee images={allImages} className="h-[800px]" />
        </div>
      </div>
      {/* Section divider */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 mt-20"></div>
    </section>
  )
}
