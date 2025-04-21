import { useState } from "react";
import { signInWithGoogle, createUser, signInWithEmail } from "@/lib/firebase/auth";
import { User } from "firebase/auth";

type AuthFormProps = {
  onUserStateChange?: (user: User | null) => void;
};

export function AuthForm({ onUserStateChange }: AuthFormProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (onUserStateChange) {
        onUserStateChange(user);
      }
    } catch (error) {
      console.error("Google sign in failed:", error);
      setError("Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const user = await signInWithEmail(email, password);
      setEmail("");
      setPassword("");
      if (onUserStateChange) {
        onUserStateChange(user);
      }
    } catch (error: any) {
      console.error("Email sign in failed:", error);
      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else {
        setError(error.message || "Sign in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const user = await createUser(email, password);
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      if (onUserStateChange) {
        onUserStateChange(user);
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use");
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '32px',
        background: 'black',
        color: 'white',
        textAlign: 'center'
      }}>
        Loading...
      </div>
    );
  }

  // Sign in form
  const renderSignIn = () => (
    <>
      <h1 style={{ fontSize: '30px', fontWeight: 600, marginBottom: '12px', color: 'white' }}>Login</h1>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px', marginBottom: '32px' }}>
        Enter your email below to login to your account
      </p>

      {error && (
        <div style={{ 
          background: 'rgba(220, 38, 38, 0.1)', 
          color: '#ef4444', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="email" style={{ color: 'white', fontSize: '18px' }}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              height: '56px',
              padding: '0 16px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'transparent',
              color: 'white',
              fontSize: '16px',
              width: '100%',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label htmlFor="password" style={{ color: 'white', fontSize: '18px' }}>Password</label>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
              Forgot your password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              height: '56px',
              padding: '0 16px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'transparent',
              color: 'white',
              fontSize: '16px',
              width: '100%',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            height: '56px',
            borderRadius: '6px',
            background: 'white',
            color: 'black',
            fontSize: '16px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Login
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            height: '56px',
            borderRadius: '6px',
            background: 'transparent',
            color: 'white',
            fontSize: '16px',
            fontWeight: 500,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
          }}
        >
          Login with Google
        </button>

        <div style={{ textAlign: 'center', color: 'white', fontSize: '16px', marginTop: '16px' }}>
          Don't have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setIsSignIn(false)
            }}
            style={{ color: 'white', fontWeight: 500, textDecoration: 'underline' }}
          >
            Sign up
          </a>
        </div>
      </form>
    </>
  )

  // Sign up form
  const renderSignUp = () => (
    <>
      <h1 style={{ fontSize: '30px', fontWeight: 600, marginBottom: '12px', color: 'black' }}>Create an account</h1>
      <p style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '18px', marginBottom: '32px' }}>
        Enter your information to create an account
      </p>

      {error && (
        <div style={{ 
          background: 'rgba(220, 38, 38, 0.1)', 
          color: '#ef4444', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <label htmlFor="firstName" style={{ color: 'black', fontSize: '18px' }}>First name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Max"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{
                height: '56px',
                padding: '0 16px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                background: 'transparent',
                color: 'black',
                fontSize: '16px',
                width: '100%',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <label htmlFor="lastName" style={{ color: 'black', fontSize: '18px' }}>Last name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Robinson"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{
                height: '56px',
                padding: '0 16px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                background: 'transparent',
                color: 'black',
                fontSize: '16px',
                width: '100%',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="signup-email" style={{ color: 'black', fontSize: '18px' }}>Email</label>
          <input
            id="signup-email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              height: '56px',
              padding: '0 16px',
              borderRadius: '6px',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              background: 'transparent',
              color: 'black',
              fontSize: '16px',
              width: '100%',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="signup-password" style={{ color: 'black', fontSize: '18px' }}>Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              height: '56px',
              padding: '0 16px',
              borderRadius: '6px',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              background: 'transparent',
              color: 'black',
              fontSize: '16px',
              width: '100%',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            height: '56px',
            borderRadius: '6px',
            background: 'black',
            color: 'white',
            fontSize: '16px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Create account
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            height: '56px',
            borderRadius: '6px',
            background: 'transparent',
            color: 'black',
            fontSize: '16px',
            fontWeight: 500,
            border: '1px solid rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
          }}
        >
          Sign up with Google
        </button>

        <div style={{ textAlign: 'center', color: 'black', fontSize: '16px', marginTop: '16px' }}>
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setIsSignIn(true)
            }}
            style={{ color: 'black', fontWeight: 500, textDecoration: 'underline' }}
          >
            Sign in
          </a>
        </div>
      </form>
    </>
  )

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      borderRadius: '16px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      padding: '32px',
      background: isSignIn ? 'black' : 'white',
    }}>
      {isSignIn ? renderSignIn() : renderSignUp()}
    </div>
  )
} 