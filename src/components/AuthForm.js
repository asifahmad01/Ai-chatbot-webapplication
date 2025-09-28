import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css";

const AuthForm = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const endpoint = isSignUp
      ? "http://localhost:5000/api/users/signup"
      : "http://localhost:5000/api/users/login";
  
    const formData = isSignUp
      ? { name, email, password }
      : { email, password };
  
    try {
      const response = await axios.post(endpoint, formData);
      alert(isSignUp ? "Sign-Up Successful! Please log in." : "Log-In Successful");
      onAuthSuccess(response.data.user);
    } catch (err) {
      alert(err.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-container">
        <div className="auth-header">
          <span onClick={toggleForm}>
            {isSignUp ? "Already a user? Click here to Log In" : "New User? Click here to Sign Up"}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <input
              type="text"
              placeholder="Name"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-submit">
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
