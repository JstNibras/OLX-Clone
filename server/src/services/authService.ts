import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterInput) => {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });

    if(existingUser) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    return {
        id: user._id,
        name: user.name,
        email: user.email,
    };
}

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email }).select("+password");

    if(!user) {
        throw new Error("Invalid email or password")
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    )

    if (!isPasswordValid) {
        throw new Error("Invalid email or password")
    }

    const token = generateToken(user._id.toString())

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }
    }
}