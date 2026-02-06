import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user - try multiple times if needed for session propagation
    let session = null
    let attempts = 0
    while (!session && attempts < 3) {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (currentSession) {
        session = currentSession
        break
      }
      // Wait a bit for session to propagate
      await new Promise(resolve => setTimeout(resolve, 200))
      attempts++
    }
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - No session found. Please ensure you are logged in.", details: "Session not available after authentication" },
        { status: 401 }
      )
    }

    // Use admin client to create/update user record
    const adminSupabase = createAdminClient()
    
    // Check if user already exists
    const { data: existingUser } = await adminSupabase
      .from("users")
      .select("id, role")
      .eq("id", session.user.id)
      .single()

    if (existingUser) {
      // Update role to admin if not already admin
      if (existingUser.role !== "admin") {
        const { data: updatedUser, error: updateError } = await adminSupabase
          .from("users")
          .update({ role: "admin" })
          .eq("id", session.user.id)
          .select()
          .single()

        if (updateError) {
          return NextResponse.json(
            { error: "Failed to update user role", details: updateError.message },
            { status: 500 }
          )
        }

        return NextResponse.json({ 
          success: true, 
          message: "User role updated to admin",
          user: updatedUser || { id: existingUser.id, role: "admin" }
        })
      }

      // User already has admin role
      return NextResponse.json({ 
        success: true, 
        message: "User already has admin role",
        user: existingUser
      })
    }

    // Create new user record
    const { data: newUser, error: insertError } = await adminSupabase
      .from("users")
      .insert({
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Admin",
        role: "admin"
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to create user record", details: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Admin user created successfully",
      user: newUser
    })
  } catch (error: any) {
    console.error("Error creating admin user:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}

