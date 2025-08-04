import { AuthContextType, UserType } from "@/types";
import { createContext, useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from "@/config/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

// Create context
const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const router = useRouter();
    useEffect(() => {
        
        // Firebase onAuthStateChanged listener
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser?.uid,
                    email: firebaseUser?.email,
                    name: firebaseUser?.displayName,
                });
                updateUserData(firebaseUser.uid)
                router.replace('/(main)')
            } else {
                setUser(null);
                router.replace('/(auth)/welcome')
            }
        }
        );

        // Clean up the subscription on component unmount
        return () => unsubscribe();
    }, []);
    // Login function
    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error: any) {
            let msg = error.message;
            if(msg.includes('(auth/invalid-credential)'))
                msg="Wrong Credentials!"
            if(msg.includes('(auth/invalid-email)'))
                msg="Invalid Email!"
            return { success: false, msg };
        }
    };

    // Register function
    const register = async (email: string, password: string, name: string) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(firestore, "users", response?.user?.uid), {
                name,
                email,
                uid: response?.user?.uid,
            });
            return { success: true };
        } catch (error: any) {
            let msg = error.message;
             if(msg.includes('(auth/invalid-credential)'))
                msg="Wrong Credentials!"
            if(msg.includes('(auth/invalid-email)'))
                msg="Invalid Email!"
            if(msg.includes('(auth/email-already-in-use)'))
                msg="User with this email already exists!"
            if(msg.includes('(auth/weak-password)'))
                msg="Password should be at least 6 characters"
            return { success: false, msg };
        }
    };

    // Update user data from Firestore
    const updateUserData = async (uid: string) => {
        try {
            const docRef = doc(firestore, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const userData: UserType = {
                    uid: data?.uid,
                    email: data?.email || null,
                    name: data?.name || null,
                    image: data?.image || null,
                };
                setUser({ ...userData });
            }
        } catch (error: any) {
            let msg = error.message;
            console.log('Error fetching user data:', msg);
        }
    };

    // UseEffect to track authentication state


    // Context value
    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be wrapped inside AuthProvider');
    }
    return context;
};
