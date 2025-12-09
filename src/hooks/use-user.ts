import { create } from 'zustand';
import { User } from "@/types/index";

interface UserState {
	user: User | null;
	setUser: (u: User | null) => void;
}

export const useUser = create<UserState>((set) => ({
	user: null,
	setUser: (u) => set({ user: u }),
}));
