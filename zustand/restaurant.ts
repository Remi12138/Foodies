import { create } from "zustand";
import dummyRestaurants from "@/dummy/restaurants.json";

export type Restaurant = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  location: {
    lat: number;
    lng: number;
  };
  contactNumber: string;
  website: string;
  imageCover: string;
  images: string[];
};

type RestaurantStore = {
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  removeRestaurant: (id: string) => void;
  fetchRestaurants: () => Promise<void>;
  fetchFakeRestaurants: () => Promise<void>;
};

export const useRestaurantStore = create<RestaurantStore>()((set) => ({
  restaurants: [],
  setRestaurants: (restaurants) => set(() => ({ restaurants })),
  addRestaurant: (restaurant) =>
    set((state) => ({ restaurants: [...state.restaurants, restaurant] })),
  removeRestaurant: (id) =>
    set((state) => ({
      restaurants: state.restaurants.filter(
        (restaurant) => restaurant.id !== id
      ),
    })),
  fetchRestaurants: async () => {
    const response = await fetch("https://api.example.com/restaurants");
    const restaurants = await response.json();
    set(() => ({ restaurants }));
  },
  fetchFakeRestaurants: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const restaurants = dummyRestaurants;
        set(() => ({ restaurants }));
        console.log("Fetched fake restaurants");
        resolve();
      }, 1000);
    });
  },
}));
