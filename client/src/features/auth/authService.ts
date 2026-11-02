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

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponce {
    success: boolean;
    user: User;
}

export const registerApi = async (
    userData: RegisterInput
): Promise<RegisterInput> => {
    const responce = await api.post<RegisterInput>(
        "/auth/register",
        userData
    )

    return responce.data;
}