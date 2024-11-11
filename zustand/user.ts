import { create } from "zustand";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import {
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";

export type UserPublicProfile = {
  cid: string;
  name: string;
  avatar: string;
};

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
};

type UserStore = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  fetchUserProfile: () => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  verifyOldPassword: (oldPassword: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  fetchUserProfile: async () => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
      try {
        set(() => ({
          user: {
            uid: currentUser.uid,
            name: currentUser.displayName || "",
            email: currentUser.email || "",
          },
        }));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  },
  updateUserName: async (name: string) => {
    const auth = FIREBASE_AUTH;
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        set((state) => ({
          user: state.user ? { ...state.user, name } : state.user,
        }));
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    }
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
