'use client'

import { useState, useReducer, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { Card } from '@/lib/types'

import { cards as initialCards } from '@/config/memory-game'
import { memoryGameReducer } from '@/reducers/memory-game-reducer'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function MemoryGamePage() {
  const [cards, dispatch] = useReducer(memoryGameReducer, initialCards)
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  const flipCard = (id: number) => {
    const isFlipped = cards.find((card) => card.id === id)?.flipped
    const isSelected = selectedCards.includes(id)
    const isCardSlotAvailable = selectedCards.length < 2

    if (!isFlipped && !isSelected && isCardSlotAvailable) {
      dispatch({ type: 'FLIP_CARD', id })
      setSelectedCards((prev) => [...prev, id])
    }
  }

  const compareCards = () => {
    const [firstCard, secondCard] = cards.filter((card: Card) =>
      selectedCards.includes(card.id)
    )

    if (selectedCards.length === 2) {
      timeoutId.current = setTimeout(
        () => {
          if (firstCard.value === secondCard.value) {
            dispatch({ type: 'MATCH_CARDS' })
          } else {
            dispatch({ type: 'UNFLIP_CARDS' })
          }
          setSelectedCards([])
        },
        firstCard.value === secondCard.value ? 500 : 1000
      )
    }
  }

  const resetGame = () => {
    dispatch({ type: 'RESET_CARDS' })
    setTimeout(() => {
      dispatch({ type: 'SHUFFLE_CARDS' })
    }, 300)
  }

  useEffect(() => {
    dispatch({ type: 'SHUFFLE_CARDS' })
  }, [])

  useEffect(() => {
    if (cards.every((card: Card) => card.matched)) {
      setTimeout(() => {
        setShowDialog(true)
      }, 1000)
    }
  }, [cards])

  useEffect(() => {
    compareCards()

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [selectedCards])

  return (
    <>
      <div className='h-full flex items-center'>
        <div className='grid grid-cols-4 gap-2 max-w-xl w-full mx-auto'>
          {cards.map((card: Card) => {
            return (
              <motion.div
                key={card.id}
                className='cursor-pointer relative rounded-lg aspect-square'
                onClick={() => flipCard(card.id)}
              >
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: card.flipped ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className='absolute inset-0 z-10 bg-bathroomfloor bg-primary grid place-items-center rounded-sm lg:rounded-lg border'
                  style={{
                    backfaceVisibility: 'hidden',
                  }}
                ></motion.div>
                <motion.div
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: card.flipped ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'absolute inset-0 bg-white grid place-items-center rounded-lg transition-colors duration-300 ',
                    card.matched && card.color
                  )}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <card.icon color='black' size={32} />
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You Won!</AlertDialogTitle>
            <AlertDialogDescription>
              Play again or try other games from the selection
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Link href='/'>Other games</Link>
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => resetGame()}>
              Play again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
