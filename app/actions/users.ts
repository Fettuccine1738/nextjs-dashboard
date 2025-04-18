"use server"

export async function updateUserProfile(formData: FormData) {
  const name = formData.get("name") as string
  const bio = formData.get("bio") as string

  // placeholder - it should update the user profile in the database
  console.log("Updating user profile:", { name, bio })

  return { success: true, message: "Profile updated successfully" }
}

export async function getUserData() {
  // placeholder - it should fetch user data from the database
  return {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    bio: "Student at University",
  }
}
