import { createContext, useContext, useEffect, useState} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail} from "firebase/auth";
import { auth } from "../firebase";


export const authContext= createContext();
export const useAuth=()=>{
    const context=useContext(authContext)
    if(!context) throw new Error('There is no auth provider')
    return context
}

export function AuthProvider({children}){
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) =>{
        return signInWithEmailAndPassword(auth, email, password);
    }
    const logout = () => signOut(auth);

    const loginWithGoogle = () =>{
        const googleProvider = new GoogleAuthProvider(); 
        return signInWithPopup(auth, googleProvider);
    }

    const resetPassword = (email) =>{
        sendPasswordResetEmail(auth, email);
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, currentUser =>{
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    },[])
    return(
        <authContext.Provider value={{signup, login, user, logout, loading, loginWithGoogle, resetPassword}}>
            {children}
        </authContext.Provider>
    )
}