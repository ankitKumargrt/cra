"use client"
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function BackgroundBeamsDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          Ready for a revolution in credit analysis?
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Click below to experience an AI-driven, real-time evaluation that puts you ahead of traditional banking
          delays. Our platform delivers complete credit evaluations in minutes—far quicker than the weeks required by
          traditional banks.
        </p>
        <div className="flex justify-center mt-8">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg relative overflow-hidden group z-10">
            <span className="group-hover:translate-x-40 text-center transition duration-500">Begin</span>
            <div className="-translate-x-40 group-hover:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
              ₹
            </div>
          </button>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  )
}
