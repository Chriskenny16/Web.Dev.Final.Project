import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

type UserProfile = {
  firstName: string;
  lastName: string;
  major: string;
  studentId: string;
  home: string;
  hometown: string;
  updatedAt: Timestamp;
};

type UserInfo = {
  name: string;
  lastName: string;
  major: string;
  studentId: string;
  home: string;
  hometown: string;
  updatedAt: Timestamp;
};

type MajorExperience = {
  experience: string;
  updatedAt: Timestamp;
};

type DashboardProps = {
  user: User;
  onSignOut: () => void;
};

type NavItem = "profile" | "userInfo" | "majorExperience" | "todos" | "settings";

// Add these styles at the beginning of the file, outside the component
const spinnerKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export function Dashboard({ user, onSignOut }: DashboardProps) {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    major: "",
    studentId: "",
    home: "",
    hometown: "",
    updatedAt: Timestamp.now(),
  });

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    lastName: "",
    major: "",
    studentId: "",
    home: "",
    hometown: "",
    updatedAt: Timestamp.now(),
  });

  const [majorExperience, setMajorExperience] = useState<MajorExperience>({
    experience: "",
    updatedAt: Timestamp.now(),
  });
  
  const [activeNav, setActiveNav] = useState<NavItem>("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const [isMajorExperienceLoading, setIsMajorExperienceLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUserInfoSaving, setIsUserInfoSaving] = useState(false);
  const [isMajorExperienceSaving, setIsMajorExperienceSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [userInfoSaveStatus, setUserInfoSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [majorExperienceSaveStatus, setMajorExperienceSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, "userProfiles", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user.uid]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoDocRef = doc(db, "userInfo", user.uid);
        const userInfoDoc = await getDoc(userInfoDocRef);
        
        if (userInfoDoc.exists()) {
          setUserInfo(userInfoDoc.data() as UserInfo);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsUserInfoLoading(false);
      }
    };

    fetchUserInfo();
  }, [user.uid]);

  useEffect(() => {
    const fetchMajorExperience = async () => {
      try {
        const majorExperienceDocRef = doc(db, "majorExperience", user.uid);
        const majorExperienceDoc = await getDoc(majorExperienceDocRef);
        
        if (majorExperienceDoc.exists()) {
          setMajorExperience(majorExperienceDoc.data() as MajorExperience);
        }
      } catch (error) {
        console.error("Error fetching major experience:", error);
      } finally {
        setIsMajorExperienceLoading(false);
      }
    };

    fetchMajorExperience();
  }, [user.uid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMajorExperienceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMajorExperience(prev => ({
      ...prev,
      experience: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");
    
    // Optimistic update - remember previous state in case we need to revert
    const previousProfile = { ...profile };
    
    try {
      const userDocRef = doc(db, "userProfiles", user.uid);
      
      // Optimistically update UI immediately
      setSaveStatus("success");
      
      // Then perform the actual save
      await setDoc(userDocRef, {
        ...profile,
        updatedAt: Timestamp.now()
      });
      
      // Keep success state for 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveStatus("error");
      
      // Revert to previous state on error
      setProfile(previousProfile);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUserInfoSaving(true);
    setUserInfoSaveStatus("idle");
    
    // Optimistic update - remember previous state in case we need to revert
    const previousUserInfo = { ...userInfo };
    
    try {
      const userInfoDocRef = doc(db, "userInfo", user.uid);
      
      // Optimistically update UI immediately
      setUserInfoSaveStatus("success");
      
      // Then perform the actual save
      await setDoc(userInfoDocRef, {
        ...userInfo,
        updatedAt: Timestamp.now()
      });
      
      // Keep success state for 3 seconds
      setTimeout(() => setUserInfoSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving user info:", error);
      setUserInfoSaveStatus("error");
      
      // Revert to previous state on error
      setUserInfo(previousUserInfo);
    } finally {
      setIsUserInfoSaving(false);
    }
  };

  const handleMajorExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMajorExperienceSaving(true);
    setMajorExperienceSaveStatus("idle");
    
    // Optimistic update - remember previous state in case we need to revert
    const previousMajorExperience = { ...majorExperience };
    
    try {
      const majorExperienceDocRef = doc(db, "majorExperience", user.uid);
      
      // Optimistically update UI immediately
      setMajorExperienceSaveStatus("success");
      
      // Then perform the actual save
      await setDoc(majorExperienceDocRef, {
        ...majorExperience,
        updatedAt: Timestamp.now()
      });
      
      // Keep success state for 3 seconds
      setTimeout(() => setMajorExperienceSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving major experience:", error);
      setMajorExperienceSaveStatus("error");
      
      // Revert to previous state on error
      setMajorExperience(previousMajorExperience);
    } finally {
      setIsMajorExperienceSaving(false);
    }
  };

  if (isLoading && activeNav === "profile") {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p style={{ color: "white" }}>Loading your profile...</p>
      </div>
    );
  }

  if (isUserInfoLoading && activeNav === "userInfo") {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p style={{ color: "white" }}>Loading your information...</p>
      </div>
    );
  }

  if (isMajorExperienceLoading && activeNav === "majorExperience") {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p style={{ color: "white" }}>Loading your major experience...</p>
      </div>
    );
  }

  return (
    <>
      <style>{spinnerKeyframes}</style>
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "24px" 
        }}>
          <h1 style={{ color: "white", margin: 0 }}>Student Dashboard</h1>
          <button 
            onClick={onSignOut}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Sign Out
          </button>
        </div>

        <div style={{ 
          display: "flex", 
          gap: "24px", 
          marginBottom: "24px",
          flexWrap: "wrap"
        }}>
          <button 
            onClick={() => setActiveNav("profile")}
            style={{
              padding: "12px 24px",
              background: activeNav === "profile" ? "#3B82F6" : "transparent",
              color: "white",
              border: activeNav === "profile" ? "none" : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Profile Information
          </button>
          <button 
            onClick={() => setActiveNav("userInfo")}
            style={{
              padding: "12px 24px",
              background: activeNav === "userInfo" ? "#3B82F6" : "transparent",
              color: "white",
              border: activeNav === "userInfo" ? "none" : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            User Info
          </button>
          <button 
            onClick={() => setActiveNav("majorExperience")}
            style={{
              padding: "12px 24px",
              background: activeNav === "majorExperience" ? "#3B82F6" : "transparent",
              color: "white",
              border: activeNav === "majorExperience" ? "none" : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Major Experience
          </button>
          <button 
            onClick={() => setActiveNav("todos")}
            style={{
              padding: "12px 24px",
              background: activeNav === "todos" ? "#3B82F6" : "transparent",
              color: "white",
              border: activeNav === "todos" ? "none" : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            To-Do List
          </button>
          <button 
            onClick={() => setActiveNav("settings")}
            style={{
              padding: "12px 24px",
              background: activeNav === "settings" ? "#3B82F6" : "transparent",
              color: "white",
              border: activeNav === "settings" ? "none" : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Settings
          </button>
        </div>

        <div style={{ 
          background: "#1A1A1A", 
          borderRadius: "8px", 
          padding: "24px", 
          marginBottom: "24px",
          border: "1px solid #333"
        }}>
          <h1 style={{ color: "white", fontSize: "24px", marginBottom: "8px" }}>
            Welcome, {profile.firstName || user.displayName || user.email?.split("@")[0] || "User"}!
          </h1>
          <p style={{ color: "#999", marginBottom: "0" }}>
            {user.email}
          </p>
        </div>

        {activeNav === "profile" && (
          <div style={{ 
            background: "#1A1A1A", 
            borderRadius: "8px", 
            padding: "24px",
            border: "1px solid #333"
          }}>
            <h2 style={{ color: "white", fontSize: "20px", marginBottom: "20px" }}>Your Profile Information</h2>

            <form onSubmit={handleSubmit}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(2, 1fr)", 
                gap: "16px",
                marginBottom: "24px" 
              }}>
                <div>
                  <label 
                    htmlFor="firstName" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={profile.firstName}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="lastName" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={profile.lastName}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="major" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    Major
                  </label>
                  <input
                    id="major"
                    name="major"
                    type="text"
                    value={profile.major}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="studentId" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    Student ID
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    value={profile.studentId}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="home" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    Home
                  </label>
                  <input
                    id="home"
                    name="home"
                    type="text"
                    value={profile.home}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="hometown" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    Hometown
                  </label>
                  <input
                    id="hometown"
                    name="hometown"
                    type="text"
                    value={profile.hometown}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: "12px 24px",
                    background: isSaving ? "#666" : "#3B82F6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: 500,
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {isSaving && (
                    <span 
                      style={{ 
                        width: "16px", 
                        height: "16px", 
                        border: "2px solid white", 
                        borderTopColor: "transparent", 
                        borderRadius: "50%", 
                        animation: "spin 1s linear infinite",
                        display: "inline-block"
                      }}
                    />
                  )}
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>

                {saveStatus === "success" && (
                  <span style={{ color: "#10B981", marginLeft: "16px" }}>
                    Profile saved successfully!
                  </span>
                )}

                {saveStatus === "error" && (
                  <span style={{ color: "#EF4444", marginLeft: "16px" }}>
                    Failed to save profile. Please try again.
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {activeNav === "userInfo" && (
          <div style={{ 
            background: "#1A1A1A", 
            borderRadius: "8px", 
            padding: "24px",
            border: "1px solid #333"
          }}>
            <h2 style={{ color: "white", fontSize: "20px", marginBottom: "20px" }}>Your User Information</h2>
            
            <form onSubmit={handleUserInfoSubmit}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(2, 1fr)", 
                gap: "16px",
                marginBottom: "24px" 
              }}>
                <div>
                  <label 
                    htmlFor="name" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={userInfo.name}
                    onChange={handleUserInfoChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="lastName" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={userInfo.lastName}
                    onChange={handleUserInfoChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="major" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    Major
                  </label>
                  <input
                    id="major"
                    name="major"
                    type="text"
                    value={userInfo.major}
                    onChange={handleUserInfoChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="studentId" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    Student ID
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    value={userInfo.studentId}
                    onChange={handleUserInfoChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="home" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    Home
                  </label>
                  <input
                    id="home"
                    name="home"
                    type="text"
                    value={userInfo.home}
                    onChange={handleUserInfoChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="hometown" 
                    style={{ 
                      display: "block", 
                      marginBottom: "8px", 
                      color: "white" 
                    }}
                  >
                    Hometown
                  </label>
                  <input
                    id="hometown"
                    name="hometown"
                    type="text"
                    value={userInfo.hometown}
                    onChange={handleUserInfoChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#222",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  type="submit"
                  disabled={isUserInfoSaving}
                  style={{
                    padding: "12px 24px",
                    background: isUserInfoSaving ? "#666" : "#3B82F6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: 500,
                    cursor: isUserInfoSaving ? "not-allowed" : "pointer",
                    opacity: isUserInfoSaving ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {isUserInfoSaving && (
                    <span 
                      style={{ 
                        width: "16px", 
                        height: "16px", 
                        border: "2px solid white", 
                        borderTopColor: "transparent", 
                        borderRadius: "50%", 
                        animation: "spin 1s linear infinite",
                        display: "inline-block"
                      }}
                    />
                  )}
                  {isUserInfoSaving ? "Saving..." : "Save User Info"}
                </button>

                {userInfoSaveStatus === "success" && (
                  <span style={{ color: "#10B981", marginLeft: "16px" }}>
                    User info saved successfully!
                  </span>
                )}

                {userInfoSaveStatus === "error" && (
                  <span style={{ color: "#EF4444", marginLeft: "16px" }}>
                    Failed to save user info. Please try again.
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {activeNav === "majorExperience" && (
          <div style={{ 
            background: "#1A1A1A", 
            borderRadius: "8px", 
            padding: "24px",
            border: "1px solid #333"
          }}>
            <h2 style={{ color: "white", fontSize: "20px", marginBottom: "20px" }}>Your Major Experience</h2>
            
            <form onSubmit={handleMajorExperienceSubmit}>
              <div style={{ marginBottom: "24px" }}>
                <label 
                  htmlFor="majorExperience" 
                  style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    color: "white",
                    fontSize: "16px"
                  }}
                >
                  What is your experience with your major?
                </label>
                <textarea
                  id="majorExperience"
                  name="experience"
                  value={majorExperience.experience}
                  onChange={handleMajorExperienceChange}
                  placeholder="Share your experience with your major..."
                  style={{
                    width: "100%",
                    minHeight: "200px",
                    padding: "12px",
                    background: "#222",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "16px",
                    resize: "vertical"
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  type="submit"
                  disabled={isMajorExperienceSaving}
                  style={{
                    padding: "12px 24px",
                    background: isMajorExperienceSaving ? "#666" : "#3B82F6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: 500,
                    cursor: isMajorExperienceSaving ? "not-allowed" : "pointer",
                    opacity: isMajorExperienceSaving ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {isMajorExperienceSaving && (
                    <span 
                      style={{ 
                        width: "16px", 
                        height: "16px", 
                        border: "2px solid white", 
                        borderTopColor: "transparent", 
                        borderRadius: "50%", 
                        animation: "spin 1s linear infinite",
                        display: "inline-block"
                      }}
                    />
                  )}
                  {isMajorExperienceSaving ? "Saving..." : "Save Experience"}
                </button>

                {majorExperienceSaveStatus === "success" && (
                  <span style={{ color: "#10B981", marginLeft: "16px" }}>
                    Experience saved successfully!
                  </span>
                )}

                {majorExperienceSaveStatus === "error" && (
                  <span style={{ color: "#EF4444", marginLeft: "16px" }}>
                    Failed to save experience. Please try again.
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {activeNav === "todos" && (
          <div style={{ 
            background: "#1A1A1A", 
            borderRadius: "8px", 
            padding: "24px",
            border: "1px solid #333"
          }}>
            <h2 style={{ color: "white", fontSize: "20px", marginBottom: "20px" }}>Your To-Do List</h2>
            <p style={{ color: "#999" }}>This feature will be available soon!</p>
          </div>
        )}

        {activeNav === "settings" && (
          <div style={{ 
            background: "#1A1A1A", 
            borderRadius: "8px", 
            padding: "24px",
            border: "1px solid #333"
          }}>
            <h2 style={{ color: "white", fontSize: "20px", marginBottom: "20px" }}>Account Settings</h2>
            <p style={{ color: "#999" }}>This feature will be available soon!</p>
          </div>
        )}
      </div>
    </>
  );
} 