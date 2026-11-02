import api from "../../services/api";
import type { User } from "../../types/auth";

export interface LoginInput {
    email: string;
    password: string;
}

export interface LoginResponce {
    success: boolean;
    token: string;
    user: User;
}

export const loginApi = async (
    credentials: LoginInput
): Promise<LoginResponce> => {
    const response = await api.post<LoginResponce>(
        "/auth/login",
        credentials
    )

    return response.data;
}