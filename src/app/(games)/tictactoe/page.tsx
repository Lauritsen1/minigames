'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Circle } from 'lucide-react'

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

enum Player {
  X = 'X',
  O = 'O',
}

type Cell = Player | null
type BoardState = Cell[]
type WinConditions = number[][]

const WIN_CONDITIONS: WinConditions = [
  // Horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonal
  [0, 4, 8],
  [2, 4, 6],
]

const INITIAL_STATE: Cell[] = Array(9).fill(null)

export default function TicTacToePage() {
  const [boardState, setBoardState] = useState<BoardState>(INITIAL_STATE)
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<Player>(Player.X)
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const makeMove = (i: number, player: Player) => {
    if (
      boardState[i] === null &&
      currentPlayerTurn === player &&
      !getWinner()
    ) {
      setBoardState((prev) => {
        const newState = [...prev]
        newState[i] = currentPlayerTurn
        return newState
      })

      setCurrentPlayerTurn((prev) => (prev === Player.X ? Player.O : Player.X))
    }
  }

  const makePlayerMove = (i: number) => makeMove(i, Player.X)

  const makeAiMove = () => {
    const emptyCells = boardState.reduce<number[]>((acc, cell, i) => {
      if (cell === null) {
        return [...acc, i]
      }

      return acc
    }, [])

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    makeMove(randomCell, Player.O)
  }

  const getWinner = () => {
    const winningCondition = WIN_CONDITIONS.find(
      ([a, b, c]) =>
        boardState[a] !== null &&
        boardState[a] === boardState[b] &&
        boardState[c] === boardState[a]
    )

    return winningCondition ? boardState[winningCondition[0]] : null
  }

  const resetGame = () => {
    setBoardState(INITIAL_STATE)
    setCurrentPlayerTurn(Player.X)
  }

  useEffect(() => {
    const winner = getWinner()

    // Check if there is a winner or a tie
    if (winner || boardState.every((cell) => cell !== null)) {
      setShowDialog(true)
    }
  }, [boardState])

  useEffect(() => {
    if (currentPlayerTurn === Player.O) {
      const timeoutId = setTimeout(makeAiMove, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [boardState, currentPlayerTurn])

  const renderPlayerSymbol = (cell: Cell) => {
    if (cell === Player.X) {
      return <X size={40} />
    }

    if (cell === Player.O) {
      return <Circle size={40} />
    }

    return null
  }

  const renderGameResult = () => {
    if (getWinner() === Player.X) {
      return 'You Won!'
    }

    if (getWinner() === Player.O) {
      return 'You Lost'
    }

    return 'Tie'
  }

  return (
    <>
      <div className='h-full flex items-center justify-center'>
        <div className='flex flex-wrap w-full border max-w-sm'>
          {boardState.map((cell, i) => (
            <div
              key={i}
              onClick={() => makePlayerMove(i)}
              className='w-1/3 grid place-items-center aspect-square border'
            >
              {renderPlayerSymbol(cell)}
            </div>
          ))}
        </div>
      </div>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{renderGameResult()}</AlertDialogTitle>
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
