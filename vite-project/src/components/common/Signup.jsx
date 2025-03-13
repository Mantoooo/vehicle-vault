import { useForm } from "react-hook-form";
import "../../assets/CSS/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === "password") setShowPassword((prev) => !prev);
    if (field === "confirmPassword") setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const signupData = {
        firstName: data.name,
        status: true,
        email: data.email,
        password: data.password,
        contact: data.contact,
      };

      const res = await axios.post("/user", signupData);

      if (res.status === 201) {
        alert("Signup successful!");
        navigate("/login");
      }
    } catch (error) {
      alert("Signup failed. Please try again.");
    }
  };

  const password = watch("password");

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Signup</h2>

        {/* Name Field */}
        <div className="input-container">
          {errors.name && (
            <span className="error-message">{errors.name.message}</span>
          )}
          <label>Name</label>
          <input
            type="text"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Min 3 characters",
              },
              maxLength: {
                value: 50,
                message: "Max 50 characters",
              },
            })}
          />
        </div>

        {/* Email Field */}
        <div className="input-container">
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
          <label>Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
          />
        </div>

        {/* Contact Field */}
        <div className="input-container">
          {errors.contact && (
            <span className="error-message">{errors.contact.message}</span>
          )}
          <label>Contact</label>
          <input
            type="text"
            {...register("contact", {
              required: "Contact is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Must be 10 digits",
              },
            })}
          />
        </div>

        {/* Password Field */}
        <div className="input-container password-container">
  {errors.password && (
    <span className="error-message">{errors.password.message}</span>
  )}
  <label>Password</label>
  <input
    type={showPassword ? "text" : "password"}
    {...register("password", {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Min 8 characters",
      },
      pattern: {
        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
        message: "1 upper, 1 lower, 1 digit required",
      },
    })}
  />
  <button
    type="button"
    className="toggle-password"
    onClick={() => togglePasswordVisibility("password")}
  >
    {showPassword ? "" : ""}
  </button>
</div>

        {/* Confirm Password Field */}
        <div className="input-container password-container">
          {errors.confirmPassword && (
            <span className="error-message">
              {errors.confirmPassword.message}
            </span>
          )}
          <label>Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => togglePasswordVisibility("confirmPassword")}
          >
            {showConfirmPassword ? "" : ""}
          </button>
        </div>

        <button type="submit" className="signup-button">
          Signup
        </button>
      </form>
    </div>
  );
};
