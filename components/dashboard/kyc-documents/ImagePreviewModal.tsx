import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface ImagePreviewModalProps {
  imageUrl: string | null
  onClose: () => void
}

export function ImagePreviewModal({ imageUrl, onClose }: ImagePreviewModalProps) {
  if (!imageUrl) return null

  const isPdf = imageUrl.toLowerCase().endsWith(".pdf")

  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Document Preview</DialogTitle>
        {isPdf ? (
          <div className="h-[80vh] w-full">
            <iframe src={imageUrl} className="w-full h-full" title="Document preview" />
          </div>
        ) : (
          <div className="relative h-[80vh] w-full bg-black/50">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="Expanded document"
              fill
              className="object-contain"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?key=k5qbr"
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
