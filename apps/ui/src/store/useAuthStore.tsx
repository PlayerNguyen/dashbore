import type { User } from "@prisma/generated/index";
import { create } from "zustand";

export type AuthStore = {
  isAuthenticated: boolean;
  user?: User;

  setAuthenticated: (value: boolean) => void;
  setUser: (user: User) => void;
};

/**
 * This hook represents the main storage for user when logged in or not and
 * then user information.
 *
 * @example
 *
 * Here is the very simple example.
 * ```ts
 * export default function main() {
 *    const { isAuthenticated, user } = useAuthStore();
 *
 *    return {isAuthenticated ? user.name : "User has not logged in"}
 * }
 * ```
 */
export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: undefined,

  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user: user }),
}));
