"use server"
// the line above tells Next.js this function runs on the server (used in server actions)

import { cookies } from "next/headers"  // next.js's server-side feature that allows to work with cookies in API routes or server actions
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // placeholder - check to validate credentials against the database
  if (email && password) {
      // Set a cookie or session token
    const cookieStore = await cookies()
    // sets a secure HTTP-only cookie named "auth-token" valid for 1 week.
    cookieStore.set("auth-token", "example-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    })

    // redirect to the feed page
    redirect("/feed")
  }

  // return error if validation fails
  return { error: "Invalid credentials" }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
  redirect("/login")
}


