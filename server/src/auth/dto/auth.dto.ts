export interface JwtPayload {
    sub: string;
    email: string;
}

export interface AuthResponse {
    accessToken: string;
}