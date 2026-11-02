import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginUser } from "../../features/auth/authSlice";

interface LoginFormValues {
    email: string;
    password: string;
}

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { isLoading, error } = useAppSelector(
        (state) => state.auth
    )

    const { register, handleSubmit, formState: { errors }, } = useForm<LoginFormValues>();

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await dispatch(loginUser(data)).unwrap();

            navigate("/");
        } catch {

        }
    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="email">Email</label>

                    <input 
                        id="email"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email",
                            },
                        })}
                    />

                    {errors.email && (
                        <p>{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password">Password</label>

                    <input 
                        id="password"
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                        })}    
                    />

                    {errors.password && (
                        <p>{errors.password.message}</p>
                    )}
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    )
}

export default LoginPage;