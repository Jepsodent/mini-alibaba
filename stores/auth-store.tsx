import { INITIAL_USER } from "@/constant/auth-constant";
import { create } from "zustand";

interface UserState {
  User: User;
  setUser: (data: User) => void;
}

export const useAuthStore = create<UserState>((set) => ({
  User: INITIAL_USER,
  setUser: (data) => set({ User: data }),
}));
