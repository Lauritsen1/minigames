import { Gamepad2 } from 'lucide-react'

export default function SiteHeader() {
  return (
    <header className='py-4 border-b'>
      <div className='container flex items-center'>
        <h1 className='scroll-m-20 text-2xl font-extrabold tracking-tight flex items-center'>
          <Gamepad2 className='mr-2' size={30} />
          Minigames
        </h1>
      </div>
    </header>
  )
}
