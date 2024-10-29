import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import firebase from "firebase/compat";
import analytics = firebase.analytics;

type Diet = {
    id: string;
    imgUri: string;
    title: string;
    // amount: number;
    analysis: string;
    date: Date;
};

type DietStore = {
    diets: Diet[];
    addDiet: (imgUri: string, title: string, analysis: string ) => void;
    loadDiets: () => void;
    removeDiet: (id: string) => void;
};

const useDietStore = create<DietStore>()(
    persist<DietStore>(
        (set, get) => ({
            diets: [],
            addDiet: async (imgUri, title, analysis) => {
                const newDiet: Diet = {
                    id: Date.now().toString(),
                    imgUri,
                    title,
                    analysis,
                    date: new Date(),
                };
                const updatedDiets = [newDiet, ...get().diets];
                set({ diets: updatedDiets });
                await AsyncStorage.setItem('diets', JSON.stringify(updatedDiets));
            },
            loadDiets: async () => {
                const storedDiets = await AsyncStorage.getItem('diets');
                if (storedDiets) set({ diets: JSON.parse(storedDiets) });
            },
            removeDiet: async (id) => {
                const updatedDiets = get().diets.filter(diet => diet.id !== id);
                set({ diets: updatedDiets });
                await AsyncStorage.setItem('diets', JSON.stringify(updatedDiets));
            },
        }),
        {
            name: 'diet-storage', // AsyncStorage key
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export { useDietStore };
