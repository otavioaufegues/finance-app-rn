import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export const createUserProfile = async (uid: string, email: string) => {
  await setDoc(doc(db, "users", uid), {
    email,
    createdAt: new Date(),
  });
};