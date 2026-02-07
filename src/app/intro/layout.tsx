export default function IntroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-screen h-screen overflow-hidden">
      {children}
    </div>
  )
}

