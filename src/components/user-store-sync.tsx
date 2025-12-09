'use client'

import { useUser } from "@/hooks/use-user";
import { User } from "@/types/user";

export default function UserProvider({ initialUser }: { initialUser: User | null }) {
  const setUser = useUser((state) => state.setUser);

  if (initialUser) {
    setUser(initialUser);
  }

  return null; // No renderiza UI
}
