import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/CSS/Login.css";

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        alert("Login Successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Invalid login. Please try again.");
    }
  };
  

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>

        {/* Login Method Dropdown */}
        <div className="input-container">
          <label>Login Method</label>
          <select
            {...register("method", { required: "Select a method" })}
            onChange={(e) => setLoginMethod(e.target.value)}
          >
            <option value="">Select Method</option>
            <option value="email">Email</option>
            <option value="contact">Contact</option>
          </select>
          {errors.method && (
            <span className="error-message">{errors.method.message}</span>
          )}
        </div>

        {/* Email/Contact Field (Editable After Method Selection) */}
        <div className="input-container">
          <label>{loginMethod === "contact" ? "Contact" : "Email"}</label>
          <input
            type="text"
            {...register("identifier", {
              required: "This field is required",
              pattern:
                loginMethod === "contact"
                  ? {
                      value: /^[0-9]{10}$/,
                      message: "Contact must be 10 digits",
                    }
                  : undefined,
            })}
            disabled={!loginMethod}
            placeholder={
              loginMethod
                ? loginMethod === "contact"
                  ? "Enter Contact"
                  : "Enter Email"
                : "Select Method First"
            }
          />
          {errors.identifier && (
            <span className="error-message">{errors.identifier.message}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="input-container password-container">
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
            disabled={!loginMethod}
            placeholder="Enter Password"
          />
          {/* <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "🔒"}
          </button> */}
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="login-button"
          disabled={!loginMethod}
        >
          Login
        </button>
      </form>
    </div>
  );
};
