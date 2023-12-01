import { LucideIcon } from 'lucide-react'

export interface Card {
  id: number
  value: string
  icon: LucideIcon
  color: string
  matched: boolean
  flipped: boolean
}
