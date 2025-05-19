import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { refresh_token } = body

    // Validate refresh token (in a real app, verify the token)
    if (!refresh_token || !refresh_token.startsWith("mock_refresh_token_")) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 })
    }

    // Generate new tokens
    const access_token = `mock_access_token_${Date.now()}`
    const new_refresh_token = `mock_refresh_token_${Date.now()}`

    // Set new cookie
    cookies().set({
      name: "auth_token",
      value: access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    })

    return NextResponse.json({
      access_token,
      refresh_token: new_refresh_token,
      token_type: "Bearer",
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
