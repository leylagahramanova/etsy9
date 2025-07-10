import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, onClose]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // For now, we'll just simulate email sign in
      const userData = {
        email,
        displayName: email.split('@')[0],
        picture: null
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");
      window.dispatchEvent(new Event("login"));
      
      setSuccessMessage(`Welcome, ${userData.displayName}!`);
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      setIsLoading(true);
      const decoded = jwtDecode(credentialResponse.credential);
      
      const userData = {
        email: decoded.email,
        displayName: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");
      window.dispatchEvent(new Event("login"));
      
      setSuccessMessage(`Welcome, ${decoded.name}!`);
    } catch (error) {
      console.error("Google sign in error:", error);
      setError("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-2">Sign in to continue</h2>
        <p className="mb-6 text-gray-600">Sign in or register with your email address</p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {successMessage ? (
          <div className="text-center py-8">
            <p className="text-xl font-semibold text-green-600 mb-4">{successMessage}</p>
            <p className="text-gray-600">Redirecting you in a moment...</p>
          </div>
        ) : (
          <form onSubmit={handleEmailSignIn} className="mb-4">
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {isLoading ? "Signing in..." : "Continue"}
            </button>
          </form>
        )}

        {!successMessage && (
          <div className="text-center text-sm text-gray-500 mb-4">
            By clicking Continue or Continue with Google, you agree to our{" "}
            <a href="#" className="underline">Terms of Use</a> and <a href="#" className="underline">Privacy Policy</a>.
          </div>
        )}

        {!successMessage && (
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-2 text-gray-400">OR</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
        )}

        {!successMessage && (
          <div className="flex justify-center py-2 rounded">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log("Login Failed");
                setError("Failed to sign in with Google");
              }}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              useOneTap
              theme="filled_blue"
              shape="rectangular"
              text="continue_with"
              width="300"
            />
          </div>
        )}

        {!successMessage && (
          <div className="text-xs text-gray-400 mt-6 text-center">
            We'll never post without your permission.
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;