import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebase";

const storage = getStorage(app);

export const uploadReceipt = async (uri: string, userId: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const filename = `receipts/${userId}/${Date.now()}-${Math.random()}.jpg`;
  const storageRef = ref(storage, filename);

  await uploadBytes(storageRef, blob);

  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};
