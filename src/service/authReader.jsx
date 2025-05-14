import { signInWithEmailAndPassword,signOut,sendEmailVerification,sendPasswordResetEmail,deleteUser,setPersistence,browserLocalPersistence,browserSessionPersistence } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const handleSignIn = async (email, password, remember, navigate) => {
  try {
    const persistenceType = remember ? browserLocalPersistence : browserSessionPersistence;

    await setPersistence(auth, persistenceType);
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    if (user.emailVerified) {
      localStorage.setItem("userId", user.uid);
      navigate(`/`);
    } else {
      await sendEmailVerification(user);
      throw new Error("Please verify your email address.");
    }
  } catch (error) {
    throw error;
  }
};
  
export const handleSignOut = async (navigate) => {
    try {
        await signOut(auth);
        localStorage.removeItem("userId");
        navigate("/login");
    } catch (error) {
        throw error;
    }
}

export const handlePasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        window.location.href = "https://mail.google.com";
    } catch (error) {
        throw error;
    }
}

export const handleDeleteAccount = async (auth)=>{
    try {
        const user = auth.currentUser;
        if (user) {
            await deleteUser(user);
            // delete user from firebse
            localStorage.removeItem("userId");
        } else {
            throw new Error("No user is currently signed in.");
        }
    } catch (error) {
        throw error;
    }
}