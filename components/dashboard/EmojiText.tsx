interface EmojiTextProps {
  text: string
}

export function EmojiText({ text }: EmojiTextProps) {
  if (!text) return null

  // Split the text by lines
  const lines = text.split("\n").filter((line) => line.trim())

  return (
    <div className="space-y-4">
      {lines.map((line, index) => {
        // Handle section headers
        if (
          line.endsWith(":") &&
          !line.includes(":large_") &&
          !line.includes(":red_circle:") &&
          !line.includes(":bar_chart:")
        ) {
          return (
            <h3 key={index} className="font-bold text-lg mt-6 mb-2">
              {line}
            </h3>
          )
        }

        // Handle bar chart emoji
        if (line.includes(":bar_chart:")) {
          return (
            <div key={index} className="flex items-center gap-2 font-bold text-xl mt-4 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="4" height="12" rx="1" fill="currentColor" />
                <rect x="10" y="8" width="4" height="8" rx="1" fill="currentColor" />
                <rect x="16" y="6" width="4" height="10" rx="1" fill="currentColor" />
              </svg>
              {line.replace(":bar_chart:", "").trim()}
            </div>
          )
        }

        // Handle green circle emoji
        if (line.includes(":large_green_circle:")) {
          return (
            <div key={index} className="flex items-start gap-2 mb-3">
              <div className="w-4 h-4 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
              <div>{line.replace(":large_green_circle:", "").trim()}</div>
            </div>
          )
        }

        // Handle red circle emoji
        if (line.includes(":red_circle:")) {
          return (
            <div key={index} className="flex items-start gap-2 mb-3">
              <div className="w-4 h-4 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
              <div>{line.replace(":red_circle:", "").trim()}</div>
            </div>
          )
        }

        // Handle orange circle emoji
        if (line.includes(":large_orange_circle:")) {
          return (
            <div key={index} className="flex items-start gap-2 mb-3">
              <div className="w-4 h-4 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
              <div>{line.replace(":large_orange_circle:", "").trim()}</div>
            </div>
          )
        }

        // Handle blue circle emoji
        if (line.includes(":large_blue_circle:")) {
          return (
            <div key={index} className="flex items-start gap-2 mb-3">
              <div className="w-4 h-4 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
              <div>{line.replace(":large_blue_circle:", "").trim()}</div>
            </div>
          )
        }

        // Regular line without emoji
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        )
      })}
    </div>
  )
}
