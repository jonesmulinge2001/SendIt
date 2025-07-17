// user registration

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'ADMIN' | 'STUDENT';
}

export interface RegisterResponse {
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

// user login

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    };
}

// email verification
export interface VerifyEmailRequest {
    email: string;
    code: string;
}

// generic response used for multiple endpoints
export interface GenericResponse {
    message: string;
}

// password reset
export interface ResetPasswordRequest {
    email: string;
    code: string;
    password: string;
}