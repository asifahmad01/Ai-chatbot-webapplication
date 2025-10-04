import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AuthForm.css";

const AuthForm = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const formRef = useRef(null);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setName("");
    setEmail("");
    setPassword("");
    setFormStep(0);
    setShowPassword(false);
    setShowSuccessMessage(false);
    setSuccessMessage("");
  };

  // Check form validity - simplified
  useEffect(() => {
    const nameValid = !isSignUp || name.trim().length > 0;
    const emailValid = email.trim().length > 0;
    const passwordValid = password.length > 0;
    
    setIsFormValid(nameValid && emailValid && passwordValid);
  }, [name, email, password, isSignUp]);

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (fieldName, value) => {
    // Direct state updates to ensure inputs work
    if (fieldName === 'name') {
      setName(value);
    } else if (fieldName === 'email') {
      setEmail(value);
    } else if (fieldName === 'password') {
      setPassword(value);
    }
    
    // Clear errors when user starts typing
    if (errors[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Basic validation - just check if fields have values
    if (isSignUp && !name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!password.trim()) {
      setErrors({ password: 'Password is required' });
      return;
    }
    
    setIsLoading(true);
  
    const endpoint = isSignUp
      ? "http://localhost:5000/api/users/signup"
      : "http://localhost:5000/api/users/login";
  
    const formData = isSignUp
      ? { name, email, password }
      : { email, password };
  
    try {
      const response = await axios.post(endpoint, formData);
      
      if (isSignUp) {
        // Show success message for signup
        setSuccessMessage("Account created successfully! You can now sign in.");
        setShowSuccessMessage(true);
        
        // Auto-switch to sign in after 2 seconds
        setTimeout(() => {
          setIsSignUp(false);
          setShowSuccessMessage(false);
          setName("");
          setEmail("");
          setPassword("");
        }, 2000);
      } else {
        // For login, call the success callback immediately
      onAuthSuccess(response.data.user);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "An error occurred. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-backdrop" onClick={(e) => e.stopPropagation()}>
        <div className="auth-container" ref={formRef}>
          {/* Progress indicator */}
          <div className="auth-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: isSignUp ? '33%' : '50%' }}
              ></div>
            </div>
          </div>

          {/* Header */}
        <div className="auth-header">
            <div className="auth-brand">
              <div className="brand-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#gradient1)"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#gradient2)" strokeWidth="2" fill="none"/>
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1"/>
                      <stop offset="100%" stopColor="#8b5cf6"/>
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4"/>
                      <stop offset="100%" stopColor="#3b82f6"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="brand-name">ChatAI</h1>
            </div>
            
            <div className="auth-title-section">
              <h2 className="auth-title">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h2>
              <p className="auth-subtitle">
                {isSignUp 
                  ? "Join thousands of users already using our AI assistant" 
                  : "Sign in to continue your intelligent conversations"
                }
              </p>
            </div>
        </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {isSignUp && (
              <div className="field-group">
                <label htmlFor="name" className="field-label">
                  Full Name <span className="required">*</span>
                </label>
                <div className={`field-wrapper ${focusedField === 'name' ? 'focused' : ''} ${errors.name ? 'error' : ''} ${name ? 'filled' : ''}`}>
                  <div className="field-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
            <input
              type="text"
                    id="name"
                    className="field-input"
              value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      handleInputChange('name', e.target.value);
                    }}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Enter your full name"
                    autoComplete="name"
              required
            />
                  {name && !errors.name && (
                    <div className="field-success">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
                {errors.name && (
                  <div className="field-error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    {errors.name}
                  </div>
                )}
              </div>
            )}
            
            <div className="field-group">
              <label htmlFor="email" className="field-label">
                Email Address <span className="required">*</span>
              </label>
              <div className={`field-wrapper ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''} ${email ? 'filled' : ''}`}>
                <div className="field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
          <input
            type="email"
                  id="email"
                  className="field-input"
            value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleInputChange('email', e.target.value);
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Enter your email address"
                  autoComplete="email"
            required
          />
                {email && !errors.email && (
                  <div className="field-success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && (
                <div className="field-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  {errors.email}
                </div>
              )}
            </div>
            
            <div className="field-group">
              <label htmlFor="password" className="field-label">
                Password <span className="required">*</span>
              </label>
              <div className={`field-wrapper ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''} ${password ? 'filled' : ''}`}>
                <div className="field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
          <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="field-input"
            value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleInputChange('password', e.target.value);
                  }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Enter your password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
            required
          />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => {
                    console.log('Password toggle clicked, current state:', showPassword);
                    setShowPassword(!showPassword);
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
                {password && !errors.password && (
                  <div className="field-success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              {errors.password && (
                <div className="field-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  {errors.password}
                </div>
              )}
              {isSignUp && password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-fill ${password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak'}`}></div>
                  </div>
                  <span className="strength-text">
                    {password.length >= 8 ? 'Strong password' : password.length >= 6 ? 'Medium strength' : 'Weak password'}
                  </span>
                </div>
              )}
            </div>
            
            {showSuccessMessage && (
              <div className="success-message">
                <div className="success-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                  </svg>
                </div>
                <div className="success-content">
                  <h4>Success!</h4>
                  <p>{successMessage}</p>
                </div>
              </div>
            )}
            
            {errors.submit && (
              <div className="form-error">
                <div className="error-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div className="error-content">
                  <h4>Authentication Failed</h4>
                  <p>{errors.submit}</p>
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`} 
              disabled={isLoading}
            >
              <div className="button-content">
                {isLoading ? (
                  <>
                    <div className="loading-spinner">
                      <div className="spinner-ring"></div>
                    </div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                    <svg className="button-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12,5 19,12 12,19"></polyline>
                    </svg>
                  </>
                )}
              </div>
              <div className="button-background"></div>
          </button>
        </form>
          
          {/* Footer */}
          <div className="auth-footer">
            <div className="divider">
              <span>or</span>
            </div>
            <p className="toggle-prompt">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button type="button" className="toggle-link" onClick={toggleForm}>
                {isSignUp ? "Sign in here" : "Create account"}
              </button>
            </p>
          </div>
          
          {/* Security badge */}
          <div className="security-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Your data is protected with enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
