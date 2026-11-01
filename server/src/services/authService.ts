import bcrypt from "bcrypt";
import User from "../models/User.js";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterInput) => {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });

    if(existingUser) {
        throw new Error("Email alredy registered");
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