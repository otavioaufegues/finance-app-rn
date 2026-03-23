import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { app } from "./firebase";
import { ensureDefaultCategories } from "./categories";

export const db = getFirestore(app);

export type UserProfile = {
  email: string;
  name: string;
};

export const createUserProfile = async (
  uid: string,
  email: string,
  name: string,
) => {
  await setDoc(doc(db, "users", uid), {
    email,
    name,
    createdAt: serverTimestamp(),
  });

  await ensureDefaultCategories(uid);
};

export const getUserProfile = async (uid: string) => {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
};
