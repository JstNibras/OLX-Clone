import api from "./api";

interface HealthResponse {
    success: boolean;
    message: string;
}

export const checkServerHealth = async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>("/health");

    return response.data;
}