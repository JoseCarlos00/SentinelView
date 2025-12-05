import { NextResponse } from "next/server"

type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER"

interface User {
  id: number
  username: string
  password: string
  role: UserRole
}

// In-memory database simulation
const users: User[] = [
  { id: 1, username: "superadmin", password: "password123", role: "SUPER_ADMIN" },
  { id: 2, username: "admin", password: "password123", role: "ADMIN" },
  { id: 3, username: "user", password: "password123", role: "USER" },
]

let nextId = 4

// GET - Retrieve all users
export async function GET() {
  // Return users without passwords
  const safeUsers = users.map(({ password, ...user }) => user)
  return NextResponse.json(safeUsers)
}

// POST - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, role } = body

    // Validate input
    if (!username || !password || !role) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Validate role
    const validRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN", "USER"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
    }

    // Check if username already exists
    if (users.some((u) => u.username === username)) {
      return NextResponse.json({ error: "El nombre de usuario ya existe" }, { status: 400 })
    }

    // Create new user
    const newUser: User = {
      id: nextId++,
      username,
      password,
      role,
    }

    users.push(newUser)

    // Return user without password
    const { password: _, ...safeUser } = newUser
    return NextResponse.json(safeUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 })
  }
}

// PATCH - Update user role
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { userId, role } = body

    // Validate input
    if (!userId || !role) {
      return NextResponse.json({ error: "userId y role son requeridos" }, { status: 400 })
    }

    // Validate role
    const validRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN", "USER"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
    }

    // Find user
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Update role
    users[userIndex].role = role

    // Return updated user without password
    const { password: _, ...safeUser } = users[userIndex]
    return NextResponse.json(safeUser)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar el usuario" }, { status: 500 })
  }
}

// DELETE - Delete a user
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { userId } = body

    // Validate input
    if (!userId) {
      return NextResponse.json({ error: "userId es requerido" }, { status: 400 })
    }

    // Find user index
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Remove user
    users.splice(userIndex, 1)

    return NextResponse.json({ message: "Usuario eliminado con éxito" })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar el usuario" }, { status: 500 })
  }
}
