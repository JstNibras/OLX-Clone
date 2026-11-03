import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { registerUser } from "../../features/auth/authSlice";

interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { isLoading, error } = useAppSelector(
        (state) => state.auth
    )

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<RegisterFormValues>();

    const password = watch("password")

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await dispatch(
                registerUser({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                })
            ).unwrap();

            navigate("/login");
        } catch {

        }
    };

    return (
        <div>
        <h1>Create Account</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
            <label htmlFor="name">Name</label>

            <input
                id="name"
                {...register("name", {
                required: "Name is required",
                minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                },
                })}
            />

            {errors.name && <p>{errors.name.message}</p>}
            </div>

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

            {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div>
            <label htmlFor="password">Password</label>

            <input
                id="password"
                type="password"
                {...register("password", {
                required: "Password is required",
                minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                },
                })}
            />

            {errors.password && <p>{errors.password.message}</p>}
            </div>

            <div>
            <label htmlFor="confirmPassword">Confirm Password</label>

            <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                    value === password || "Passwords do not match",
                })}
            />

            {errors.confirmPassword && (
                <p>{errors.confirmPassword.message}</p>
            )}
            </div>

            {error && <p>{error}</p>}

            <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
            </button>
        </form>

        <p>
            Already have an account? <Link to="/login">Login</Link>
        </p>
    </div>
    )
}

export default RegisterPage;