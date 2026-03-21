import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { app } from "./firebase";

export const db = getFirestore(app);

export const createUserProfile = async (uid: string, email: string) => {
  await setDoc(doc(db, "users", uid), {
    email,
    createdAt: serverTimestamp(),
  });
};
