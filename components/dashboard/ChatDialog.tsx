"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  applicantName: string | null
}

interface Message {
  id: number
  sender: "L1" | "L2"
  text: string
  timestamp: Date
}

// Sample initial messages for each applicant
const initialMessages: Record<string, Message[]> = {
  "Nathaniel Ford": [
    {
      id: 1,
      sender: "L1",
      text: "I've reviewed the application. Income verification looks good, but we need more details on business expansion plans.",
      timestamp: new Date(2024, 4, 14, 10, 15),
    },
    {
      id: 2,
      sender: "L2",
      text: "Agreed. Let's request a detailed business plan and cash flow projections for the next 12 months.",
      timestamp: new Date(2024, 4, 14, 10, 30),
    },
    {
      id: 3,
      sender: "L1",
      text: "I'll reach out to the applicant for the additional documents.",
      timestamp: new Date(2024, 4, 14, 10, 45),
    },
  ],
  "Olivia Bennett": [
    {
      id: 1,
      sender: "L1",
      text: "Missing latest bank statements. Need to verify employment details.",
      timestamp: new Date(2024, 4, 10, 14, 20),
    },
    {
      id: 2,
      sender: "L2",
      text: "Please request the last 3 months of bank statements and employment verification letter.",
      timestamp: new Date(2024, 4, 10, 15, 5),
    },
  ],
  "Ethan Carter": [
    {
      id: 1,
      sender: "L1",
      text: "Income proof insufficient. Need additional documentation for loan approval.",
      timestamp: new Date(2024, 4, 9, 11, 30),
    },
    {
      id: 2,
      sender: "L2",
      text: "The DTI ratio is too high at 46%. We should deny this application unless they can provide additional income sources.",
      timestamp: new Date(2024, 4, 9, 12, 15),
    },
    {
      id: 3,
      sender: "L1",
      text: "I agree. I'll prepare the denial letter with recommendations for future application.",
      timestamp: new Date(2024, 4, 9, 12, 45),
    },
  ],
  "Sophia Lewis": [
    {
      id: 1,
      sender: "L2",
      text: "All documents verified. Loan approved.",
      timestamp: new Date(2024, 4, 7, 9, 10),
    },
    {
      id: 2,
      sender: "L1",
      text: "Great! I'll notify the applicant and prepare the loan agreement.",
      timestamp: new Date(2024, 4, 7, 9, 25),
    },
  ],
  "Lucas Miller": [
    {
      id: 1,
      sender: "L1",
      text: "Business verification in progress. Need to confirm ownership details.",
      timestamp: new Date(2024, 4, 5, 16, 30),
    },
    {
      id: 2,
      sender: "L2",
      text: "Please request business registration documents and tax returns for the past 2 years.",
      timestamp: new Date(2024, 4, 5, 16, 45),
    },
    {
      id: 3,
      sender: "L1",
      text: "Will do. I'll also ask for proof of business address and operational history.",
      timestamp: new Date(2024, 4, 5, 17, 0),
    },
  ],
}

export function ChatDialog({ open, setOpen, applicantName }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (applicantName && open) {
      setMessages(initialMessages[applicantName] || [])
    }
  }, [applicantName, open])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !applicantName) return

    const userMessage: Message = {
      id: Date.now(),
      sender: "L1",
      text: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate L2 officer response
    setIsTyping(true)
    setTimeout(() => {
      const l2Response: Message = {
        id: Date.now() + 1,
        sender: "L2",
        text: getRandomResponse(),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, l2Response])
      setIsTyping(false)
    }, 2000)
  }

  const getRandomResponse = () => {
    const responses = [
      "Thanks for the update. Please proceed with the verification.",
      "I've reviewed the documents. Everything looks good so far.",
      "We need more information about the applicant's income sources.",
      "Let's schedule a call with the applicant to discuss the details.",
      "I'll escalate this to the credit committee for final approval.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chat with L2 Officer - {applicantName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px]">
          <ScrollArea className="flex-1 p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${message.sender === "L1" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "L2" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-primary-foreground">L2</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "L1"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
                </div>
                {message.sender === "L1" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-600 text-primary-foreground">L1</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-primary-foreground">L2</AvatarFallback>
                </Avatar>
                <div className="max-w-[80%] rounded-lg p-3 bg-secondary text-secondary-foreground">
                  <p className="text-sm">
                    <span className="inline-block animate-pulse">...</span>
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
