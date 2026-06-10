import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "./loginSchema";
import { loginUser } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import frameLogo from "../../assets/Frame.svg";
import prepLogo from "../../assets/preproute logo.svg";

const Login = () => {
  const navigate = useNavigate();

  const login = useAuthStore(
    (state) => state.login
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    data: LoginFormData
  ) => {
    try {
      const response = await loginUser(
        data.userId,
        data.password
      );

      const token = response.data.token;

      login(token);

      navigate("/dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
     <div className={styles.loginContainer}>
      {/* Left Section */}
      <div className={styles.loginLeft}>
        <img
          src={frameLogo}
          alt="Login Illustration"
          className={styles.illustration}
        />
      </div>

      {/* Right Section */}
      <div className={styles.loginRight}>
        <div className={styles.loginCard}>
          <img
            src={prepLogo}
            alt="Preproute"
            className={styles.logo}
          />

          <span className={styles.loginTag}>
            Login
          </span>

          <p className={styles.subtitle}>
            Use your company credentials
          </p>

          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.formGroup}>
              <label className={styles.label}>
                User ID
              </label>

              <input
                className={styles.input}
                placeholder="Enter User ID"
                {...register("userId")}
              />

              {errors.userId && (
                <p className={styles.error}>
                  {errors.userId.message}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Password
              </label>

              <input
                type="password"
                className={styles.input}
                placeholder="Enter Password"
                {...register("password")}
              />

              {errors.password && (
                <p className={styles.error}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <a
              href="#"
              className={styles.forgotPassword}
            >
              Forgot password?
            </a>

            <button
              type="submit"
              className={styles.loginButton}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;