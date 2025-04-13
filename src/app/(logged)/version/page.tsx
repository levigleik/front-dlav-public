export default function VersionPage() {
  return (
    <div>
      <h1>{process.env.NEXT_VERSION}</h1>
    </div>
  )
}
