"use server"

export async function getProfessors() {
  // this is a placeholder, later it should fetch professors from the database
  return [
    { id: 1, name: "Professor 1", field: "Computer Science" },
    { id: 2, name: "Professor 2", field: "Data Science" },
    { id: 3, name: "Professor 3", field: "UX Design" },
  ]
}

export async function getProfessorById(id: string) {
  // this is a placeholder, later it should fetch a specific professor from the database
  return {
    id,
    name: `Professor ${id}`,
    field: "Computer Science",
    email: "professor@example.com",
    topics: [
      { id: 1, title: "Topic 1" },
      { id: 2, title: "Topic 2" },
    ],
  }
}
