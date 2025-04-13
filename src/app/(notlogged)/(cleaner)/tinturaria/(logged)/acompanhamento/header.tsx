export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 flex w-full items-center justify-between text-center">
      <h2 className="flex-grow text-3xl font-bold tracking-wide">{children}</h2>
    </div>
  )
}
