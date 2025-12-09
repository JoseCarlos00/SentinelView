'use client'

import { useUser } from "@/hooks/use-user";
import { User } from "@/types/index";

export default function UserProvider({ initialUser }: { initialUser: User | null }) {
  const setUser = useUser((state) => state.setUser);

  console.log('UserProvider:', initialUser);

  if (initialUser) {
    setUser(initialUser);
  }

  return null; // No renderiza UI
}
