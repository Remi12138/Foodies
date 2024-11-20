import { create } from "zustand";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";

export type UserPublicProfile = {
  cid: string;
  name: string;
  avatar: string;
};

type UserStore = {
  user: UserPublicProfile | null;
  setUser: (user: UserPublicProfile | null) => void;
  updateAvatar: (avatar: string) => void;
  verifyOldPassword: (oldPassword: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  updateAvatar: (avatar: string) => {
    set((state) => {
      if (state.user) {
        return {
          user: {
            ...state.user,
            avatar,
          },
        };
      }
      return state;
    });
  },
  verifyOldPassword: async (oldPassword: string) => {
    const auth = FIREBASE_AUTH;
    if (auth.currentUser && auth.currentUser.email) {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        oldPassword
      );
      try {
        await reauthenticateWithCredential(auth.currentUser, credential);
        return true;
      } catch (error) {
        console.error("Error verifying old password:", error);
        return false;
      }
    }
    return false;
  },
  updatePassword: async (newPassword: string) => {
    const auth = FIREBASE_AUTH;
    if (auth.currentUser) {
      try {
        await firebaseUpdatePassword(auth.currentUser, newPassword);
        return true;
      } catch (error) {
        console.error("Error updating password:", error);
        return false;
      }
    }
    return false;
  },
  logout: async () => {
    const auth = FIREBASE_AUTH;
    try {
      await auth.signOut();
      set(() => ({ user: null }));
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },
}));
