import type { Request, Response } from "express";
import { registerUser } from "../services/authService";
import { loginUser } from "../services/authService";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        
        const user = await registerUser({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
        })

        return res.status(201).json({
            success: true,
            message: "Registration successfull",
            data: user
        })
    } catch (error) {
        if (
            error instanceof Error && error.message === "Email already registered"
        ) {
            return res.status(409).json({
                success: false,
                message: error.message,
            })
        }

        console.log("Registration error: ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}


export const login = async (req: Request, res: Response) => {
    try  {
        const { email, password } = req.body;

        if(typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }

        const result = await loginUser(
            email.trim().toLowerCase(),
            password
        )

        return res.status(200).json({
            success: true,
            message: "Login successfull",
            data: result,
        })
    } catch (error) {
        if(error instanceof Error && error.message === "Invalid email or password") {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        console.error("Login Error: ", error)

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        if(!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const user = await User.findById(req.userId);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        })
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        })
    }
}