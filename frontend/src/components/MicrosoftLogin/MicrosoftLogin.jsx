import React from "react";
import { auth } from "../../../firebase/FirebaseConfig";
import {
  OAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";

export default function MicrosoftLogin() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    console.log("auth.currentUser at mount:", auth.currentUser);
  }, []);

  if (window.location.pathname === "/") {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          console.log("Redirect restored:", result.user.email);
        }
      })
      .catch((e) => console.error("Redirect result error", e));
  }

  React.useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Manual redirect result:", result.user.email);
          setUser(result.user);
        } else if (auth.currentUser) {
          console.log("Auth rehydrated:", auth.currentUser.email);
          setUser(auth.currentUser);
        } else {
          console.log("No user found");
        }
      })
      .catch((e) => console.error("Redirect error:", e));
  }, []);

  React.useEffect(() => {
    // Ensure local persistence before anything else
    setPersistence(auth, browserLocalPersistence)
      .then(async () => {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          console.log("Redirect signed in:", result.user.displayName);
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Persistence or redirect error:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("Auth state restored:", currentUser.email);
      } else {
        console.log("No active user");
      }
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleMicrosoftLogin = () => {
    const provider = new OAuthProvider("microsoft.com");
    provider.setCustomParameters({ prompt: "select_account" });
    signInWithRedirect(auth, provider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-2xl shadow-md text-center w-80">
        {!user ? (
          <>
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Sign in with Microsoft</h1>
            <button
              onClick={handleMicrosoftLogin}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" className="w-5 h-5">
                <path fill="#f25022" d="M1 1h10v10H1z" />
                <path fill="#7fba00" d="M12 1h10v10H12z" />
                <path fill="#00a4ef" d="M1 12h10v10H1z" />
                <path fill="#ffb900" d="M12 12h10v10H12z" />
              </svg>
              Continue with Microsoft
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {user.displayName || "User"}</h1>
            <p className="text-gray-600 mb-6">{user.email}</p>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition w-full"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
