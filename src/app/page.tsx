import Link from 'next/link'

const GAMES = [
  {
    title: 'Memory Game',
    description: 'A simple memory game',
    image: '/images/games/memory-game.png',
    href: '/memory-game',
  },
  {
    title: 'Tic Tac Toe',
    description: 'A simple tic tac toe game',
    image: '/images/games/tictactoe.png',
    href: '/tictactoe',
  },
]

export default function Home() {
  return (
    <main className='container h-full grid place-items-center'>
      <ul className='space-y-2'>
        {GAMES.map((game) => (
          <li
            key={game.title}
            className='text-3xl font-extrabold text-center opacity-50 hover:opacity-100 hover:scale-125 transform transition-all duration-300'
          >
            <Link href={game.href}>{game.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
