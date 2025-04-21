import { AuthForm } from "@/components/auth-form"
import { User } from "firebase/auth";

type AuthPageProps = {
  onUserStateChange?: (user: User | null) => void;
};

export function AuthPage({ onUserStateChange }: AuthPageProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexDirection: 'column',
      backgroundColor: 'black',
      padding: '20px'
    }}>
      <AuthForm onUserStateChange={onUserStateChange} />
      <div style={{ 
        position: 'absolute', 
        bottom: '30px', 
        textAlign: 'center', 
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '14px'
      }}>
        By continuing, you agree to our{" "}
        <a href="#" style={{ color: 'white', textDecoration: 'underline' }}>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" style={{ color: 'white', textDecoration: 'underline' }}>
          Privacy Policy
        </a>
        .
      </div>
    </div>
  )
} 