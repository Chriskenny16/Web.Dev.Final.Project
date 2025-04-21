import { useState, useEffect } from "react";
import { AuthPage } from "@/components/auth-page";
import { Dashboard } from "@/components/dashboard";
import { User } from "firebase/auth";
import { getCurrentUser, signOutUser } from "@/lib/firebase/auth";

// Add loading spinner keyframes
const spinnerKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(error);
      } finally {
        // Delay setting loading to false for better UX
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    checkUser();
  }, []);

  const handleUserStateChange = (newUser: User | null) => {
    setUser(newUser);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <>
        <style>{spinnerKeyframes}</style>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: 'black',
          color: 'white',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p>Loading your dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      backgroundColor: 'black',
      padding: '40px 20px'
    }}>
      {user ? (
        <Dashboard user={user} onSignOut={handleSignOut} />
      ) : (
        <AuthPage onUserStateChange={handleUserStateChange} />
      )}
    </div>
  );
}

export default App;
