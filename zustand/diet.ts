import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import firebase from "firebase/compat";
import analytics = firebase.analytics;
import {number} from "prop-types";
import axios from "axios";
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
    advice: string;
};

type DietStore = {
    diets: Diet[];
    addDiet: (imgUri: string, imgHash: string, title: string, analysis: any, date: Date ) => Promise<Diet>;
    loadDiets: () => void;
    removeDiet: (id: number) => void;
    editDiet: (id: number, title: string, date: Date) => void;
    updateDietAdvice: (id: number, newAdvice: string) => void;
};

const ChatGPT_KEY = "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";
const ID_INDEX_KEY = 'IDindex';
let IDindex: number | null = null;
const initializeIDindex = async () => {
    if (IDindex === null) {
        const savedID = await AsyncStorage.getItem(ID_INDEX_KEY);
        IDindex = savedID ? parseInt(savedID, 10) : 1;
    }
};
initializeIDindex(); // Run this immediately to load IDindex on startup

const saveIDindex = async (index: number) => {
    await AsyncStorage.setItem(ID_INDEX_KEY, index.toString());
};

// Function to call ChatGPT API
const getAdvice = async (total_calories: number,
                         total_proteins: number,
                         total_fat: number,
                         total_carbs: number,
                         total_fibers: number,
                         retries: number = 0): Promise<string> => {
    const maxRetries = 3;
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `Provide a concise, point-by-point analysis and advice 
                                  for this meal in an app-friendly tone. Style like 
                                  "Your meal is nutritious but a bit high in calories
                                  (or 'Your meal is nutritious and  has a good amount of protein'). 
                                  The food composition is well-balanced to ensure sufficient protein, 
                                  but it could use more fiber."
                                  Limit the response to 40 words:
                                  Calories: ${total_calories} Cal;
                                  Proteins: ${total_proteins}g;
                                  Fat: ${total_fat}g;
                                  Carbs: ${total_carbs}g;
                                  Fibers: ${total_fibers}g.`
                    }
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer ${ChatGPT_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response && error.response.status === 429 && retries < maxRetries) {
            console.warn(`Rate limit hit; retrying in 3 seconds... Attempt ${retries + 1}`);
            await new Promise(resolve => setTimeout(resolve, 3000)); // wait for 3 seconds
            return getAdvice(total_calories, total_proteins, total_fat, total_carbs, total_fibers, retries + 1);
        } else {
            console.error("Error fetching advice:", error);
            return "";
        }
    }
};

const useDietStore = create<DietStore>()(
    persist<DietStore>(
        (set, get) => ({
            diets: [],
            addDiet: async (imgUri, imgHash, title, analysis, date) => {
                try {
                    if (IDindex === null) {
                        await initializeIDindex(); // Only runs once if IDindex is not loaded
                    }
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

                    const advice = await getAdvice(totalCalories, totalProteins, totalFat, totalCarbs, totalFibers);

                    const newDiet: Diet = {
                        id: IDindex!,
                        imgUri,
                        imgHash,
                        title,
                        analysis,
                        date,
                        foodOptions: foodOptions,
                        total_calories: totalCalories,
                        total_proteins: totalProteins,
                        total_fat: totalFat,
                        total_carbs: totalCarbs,
                        total_fibers: totalFibers,
                        advice: advice,
                    };

                    console.log("IDindex: ", IDindex);
                    const updatedDiets = [newDiet, ...get().diets];
                    set({ diets: updatedDiets });
                    await AsyncStorage.setItem('diets', JSON.stringify(updatedDiets));
                    IDindex!++;
                    await saveIDindex(IDindex!); // Save the new IDindex

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
            editDiet: async (id, title, date) => {
                const updatedDiets = get().diets.map(diet =>
                    diet.id === id ? { ...diet, title, date } : diet
                );
                set({ diets: updatedDiets });
                await AsyncStorage.setItem('diets', JSON.stringify(updatedDiets));
            },
            updateDietAdvice: (id, newAdvice) => {
                const updatedDiets = get().diets.map(diet =>
                    diet.id === id ? { ...diet, advice: newAdvice } : diet
                );
                set({ diets: updatedDiets });
                AsyncStorage.setItem('diets', JSON.stringify(updatedDiets));
            },
        }),
        {
            name: 'diet-storage', // AsyncStorage key
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export { useDietStore };
