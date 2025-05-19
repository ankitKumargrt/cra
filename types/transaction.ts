export interface Transaction {
  id: number
  date: string
  description: string
  amount: string | number
  category: string
  confidenceScore: number
  reason: string
  selected: boolean
}
