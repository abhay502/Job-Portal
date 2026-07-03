import bcrypt from 'bcryptjs'
import prisma from '../config/prisma.js'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js'

import { registerSchema } from './../validators/authValidator.js';

export const registerUser = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      })
    }

    const { name, email, password } = parsed.data
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: 'USER' },
    })
    res.status(201).json({ message: 'Account created successfully', userId: user.id })
  } catch (err) {

    if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
      return res.status(409).json({ message: 'Email already registered' })
    }
 
    console.error('registerUser error:', err)
    return res.status(500).json({ message: 'Registration failed. Please try again later.' })
  
  }
} 

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.role !== 'USER')
      return res.status(401).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid credentials' })

    const payload = { id: user.id, role: user.role, name: user.name }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } })

    res.json({
      accessToken, refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
}

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.role !== 'ADMIN')
      return res.status(401).json({ message: 'Invalid admin credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid admin credentials' })

    const payload = { id: user.id, role: user.role, name: user.name }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } })

    res.json({
      accessToken, refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' })

    const decoded = verifyRefreshToken(refreshToken)
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })

    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: 'Invalid refresh token' })

    const payload = { id: user.id, role: user.role, name: user.name }
    const newAccessToken = generateAccessToken(payload)
    const newRefreshToken = generateRefreshToken(payload)

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } })

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  } catch {
    res.status(403).json({ message: 'Invalid or expired refresh token' })
  }
}

export const logoutUser = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    })
    res.json({ message: 'Logged out successfully' })
  } catch {
    res.status(500).json({ message: 'Logout failed' })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch {
    res.status(500).json({ message: 'Failed to fetch user' })
  }
}