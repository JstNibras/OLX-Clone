import type { Request, Response } from "express";
import { registerUser } from "../services/authService";

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