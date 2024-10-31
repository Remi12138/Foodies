import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import firebase from "firebase/compat";
import analytics = firebase.analytics;
import {number} from "prop-types";
type Position = {
    height: number;
    width: number;
    x: number;
    y: number;
};

type Food = {
    name: string;
    confidence: number;
    quantity: number;
    glycemic_index: number;
    topNutrients: [string, unknown][];
    calories: number;
    proteins: number;
    fat: number;
    carbs: number;
    fibers: number;
    position: Position;
};

export type Diet = {
    id: number;
    imgUri: string;
    imgHash: string; //consistent for the same image content
    title: string;
    analysis: any;
    date: Date;
    foodOptions: Food[];
    total_calories: number;
    total_proteins: number;
    total_fat: number;
    total_carbs: number;
    total_fibers: number;
};

type DietStore = {
    diets: Diet[];
    addDiet: (imgUri: string, imgHash: string, title: string, analysis: any ) => Promise<Diet>;
    loadDiets: () => void;
    removeDiet: (id: number) => void;
};

//Todo: need Persist IDindex Using AsyncStorage
let IDindex = 1;

const useDietStore = create<DietStore>()(
    persist<DietStore>(
        (set, get) => ({
            diets: [],
            // Todo: compute total value, value in detail screen
            addDiet: async (imgUri, imgHash, title, analysis) => {
                try {
                const items = analysis.items;

                let totalCalories = 0;
                let totalProteins = 0;
                let totalFat = 0;
                let totalCarbs = 0;
                let totalFibers = 0;

                const foodOptions: Food[] = items.map((item) => {
                    const foodOption = item.food[0];

                    const name = foodOption.food_info.display_name || '';
                    const confidence = foodOption.confidence || 0;
                    const quantity = foodOption.food_info.quantity || foodOption.food_info.g_per_serving || 0;
                    const glycemic_index = foodOption.food_info.nutrition.glycemic_index || 0;

                    const calories = (foodOption.food_info.nutrition.calories_100g || 0) * quantity / 100;
                    const proteins = (foodOption.food_info.nutrition.proteins_100g || 0) * quantity / 100;
                    // const fat = (foodOption.food_info.nutrition.fat_100g || 0) * quantity / 100;
                    // const carbs = (foodOption.food_info.nutrition.carbs_100g || 0) * quantity / 100;
                    const fibers = (foodOption.food_info.nutrition.fibers_100g || 0) * quantity / 100;
                    const fat = (
                        (foodOption.food_info.nutrition.fat_100g || 0) +
                        (foodOption.food_info.nutrition.insat_fat_100g || 0) +
                        (foodOption.food_info.nutrition.mono_fat_100g || 0) +
                        (foodOption.food_info.nutrition.poly_fat_100g || 0) +
                        (foodOption.food_info.nutrition.sat_fat_100g || 0) +
                        (foodOption.food_info.nutrition.omega_3_100g || 0) +
                        (foodOption.food_info.nutrition.omega_6_100g || 0)
                    ) * quantity / 100;

                    const carbs = (
                        (foodOption.food_info.nutrition.carbs_100g || 0) +
                        (foodOption.food_info.nutrition.sugars_100g || 0) +
                        (foodOption.food_info.nutrition.polyols_100g || 0)
                    ) * quantity / 100;

                    // Calculate the top nutrients
                    const topNutrients = Object.entries(foodOption.food_info.nutrition)
                        .filter(([key, value]) => value && value > 0 && key !== "glycemic_index")
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5);

                    // Accumulate totals
                    totalCalories += calories;
                    totalProteins += proteins;
                    totalFat += fat;
                    totalCarbs += carbs;
                    totalFibers += fibers;

                    // Extract position
                    console.log("Position Data:", item.position);
                    const position: Position = {
                        height: item.position?.height || 0,
                        width: item.position?.width || 0,
                        x: item.position?.x || 0,
                        y: item.position?.y || 0,
                    };

                    return {
                        name,
                        confidence,
                        quantity,
                        glycemic_index,
                        topNutrients,
                        calories,
                        proteins,
                        fat,
                        carbs,
                        fibers,
                        position,
                    };
                });

                const newDiet: Diet = {
                    id: IDindex,
                    imgUri,
                    imgHash,
                    title,
                    analysis,
                    date: new Date(),
                    foodOptions: foodOptions,
                    total_calories: totalCalories,
                    total_proteins: totalProteins,
                    total_fat: totalFat,
                    total_carbs: totalCarbs,
                    total_fibers: totalFibers,
                };

                const updatedDiets = [newDiet, ...get().diets];
                set({ diets: updatedDiets });
                await AsyncStorage.setItem('diets', JSON.stringify(updatedDiets));
                IDindex++;

                return newDiet;
                } catch (error) {
                    console.error("Error in addDiet:", error);
                    throw error;
                }
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
