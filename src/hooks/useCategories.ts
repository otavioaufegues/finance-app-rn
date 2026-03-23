import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToCategories, type Category } from "@/services/categories";

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = subscribeToCategories(user.uid, (nextCategories) => {
      setCategories(nextCategories);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return {
    categories,
    isLoading,
  };
}
