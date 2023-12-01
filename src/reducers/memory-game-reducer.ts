import { Card } from '../lib/types'
import { shuffle } from '../lib/utils'

export function memoryGameReducer(state: Card[], action: any) {
  switch (action.type) {
    case 'FLIP_CARD':
      return state.map((card: Card) =>
        card.id === action.id ? { ...card, flipped: true } : card
      )
    case 'UNFLIP_CARDS':
      return state.map((card: Card) =>
        card.flipped && !card.matched ? { ...card, flipped: false } : card
      )
    case 'MATCH_CARDS':
      return state.map((card: Card) =>
        card.flipped ? { ...card, matched: true } : card
      )
    case 'RESET_CARDS':
      return state.map((card: Card) => {
        return { ...card, matched: false, flipped: false }
      })
    case 'SHUFFLE_CARDS':
      return shuffle(state)

    default:
      throw new Error()
  }
}
