import { useState, useEffect } from "react";
import { fetchMe } from "@/services/userApi";
import type { UserSummary } from "@/types";

export function useCurrentUser() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchMe();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, isLoading };
}
