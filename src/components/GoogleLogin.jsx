import React, { useState, useEffect } from "react";
import { auth, signInWithGoogle } from "../firebase";
// Import your auth functions here if needed, e.g.,
// import { signInWithGoogle, signInWithFacebook, signInWithApple } from "./firebase";

const Login = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Attempt Google sign-in
      const result = await signInWithGoogle();
      
      if (result && result.user) {
        // Store user data
        const userData = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          uid: result.user.uid
        };
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        
        // Close modal after successful sign-in
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Email "sign-in" simulation (no backend)
  const handleEmailSignIn = (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      
      // Create fake user data
      const fakeUser = {
        email,
        displayName: email.split('@')[0],
        photoURL: null,
        uid: `email_${Date.now()}`
      };
      
      setUser(fakeUser);
      localStorage.setItem("user", JSON.stringify(fakeUser));
      localStorage.setItem("isLoggedIn", "true");
      
      if (onClose) onClose();
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo: handle Facebook sign-in
  const handleFacebookSignIn = async () => {
    console.log("Attempting Facebook sign-in");
    // Replace with your real Facebook sign-in logic
    // onClose();
  };

  // Demo: handle Apple sign-in
  const handleAppleSignIn = async () => {
     console.log("Attempting Apple sign-in");
    // Replace with your real Apple sign-in logic
    // onClose();
  };

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          disabled={isLoading}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-2">Sign in to continue</h2>
        <p className="mb-6 text-gray-600">Sign in or register with your email address</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Email form */}
        <form onSubmit={handleEmailSignIn} className="mb-4">
          <input
            type="email"
            required
            placeholder="Email address"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mb-4">
          By clicking Continue or Continue with Google, you agree to our{" "}
          <a href="#" className="underline">Terms of Use</a> and <a href="#" className="underline">Privacy Policy</a>.
        </div>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400">OR</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 px-1 font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {isLoading ? "Signing in..." : "Continue with Google"}
        </button>

        <div className="text-xs text-gray-400 mt-6 text-center">
          We'll never post without your permission.
        </div>
      </div>
    </div>
  );
};

export default Login; 