import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export type Category = {
  id: string;
  name: string;
};

const DEFAULT_CATEGORY_NAMES = [
  "Alimentacao",
  "Moradia",
  "Transporte",
  "Saude",
  "Lazer",
  "Educacao",
  "Salario",
  "Investimentos",
  "Outros",
];

const getCategoriesCollection = (uid: string) =>
  collection(db, "users", uid, "categories");

const getCategoryId = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const ensureDefaultCategories = async (uid: string) => {
  const categoriesSnapshot = await getDocs(getCategoriesCollection(uid));

  if (!categoriesSnapshot.empty) {
    return;
  }

  const batch = writeBatch(db);

  DEFAULT_CATEGORY_NAMES.forEach((name) => {
    batch.set(doc(db, "users", uid, "categories", getCategoryId(name)), {
      name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
};

export const subscribeToCategories = (
  uid: string,
  callback: (categories: Category[]) => void,
) => {
  let isSeeding = false;

  const categoriesQuery = query(
    getCategoriesCollection(uid),
    orderBy("name", "asc"),
  );

  return onSnapshot(categoriesQuery, async (snapshot) => {
    if (snapshot.empty && !isSeeding) {
      isSeeding = true;
      await ensureDefaultCategories(uid);
      return;
    }

    callback(
      snapshot.docs.map((item) => ({
        id: item.id,
        name: String(item.data().name ?? ""),
      })),
    );
  });
};
