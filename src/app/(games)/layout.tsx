export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col grow'>
      <main className='container grow'>{children}</main>
    </div>
  )
}
