import { getProfessors } from "../actions/professors"
import Link from "next/link"

export default async function FeedPage() {
  const professors = await getProfessors()

  return (
    <div>
      <h1>Feed</h1>

      <ul>
        {professors.map((professor) => (
          <li key={professor.id}>
            <Link href={`/professors/${professor.id}`}>
              {professor.name} - {professor.field}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
