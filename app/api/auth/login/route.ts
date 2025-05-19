import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock user database for demonstration
const users = [
  {
    username: "l1user@finverify.com",
    password: "password123", // In a real app, this would be hashed
    role: "l1",
  },
  {
    username: "l2user@finverify.com",
    password: "password123",
    role: "l2",
  },
  {
    username: "l3user@finverify.com",
    password: "password123",
    role: "l3",
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    // Find user (in a real app, you'd query your database)
    const user = users.find((u) => u.username === username && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Generate tokens (in a real app, use a proper JWT library)
    const access_token = `mock_access_token_${Date.now()}`
    const refresh_token = `mock_refresh_token_${Date.now()}`

    // Set secure HTTP-only cookie
    cookies().set({
      name: "auth_token",
      value: access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    })

    // Return tokens and redirect URL based on user role
    return NextResponse.json({
      access_token,
      refresh_token,
      token_type: "Bearer",
      redirect_url: `${user.role}/dashboard`,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
