import { create } from "zustand";
import dummyRestaurants from "@/dummy/restaurants.json";

export type Restaurant = {
  id: string; 
  alias: string; 
  name: string; 
  imageUrl: string; 
  isClosed: boolean; 
  url: string; 
  reviewCount: number; 
  categories: { alias: string; title: string }[]; 
  rating: number; 
  coordinates: {
    latitude: number;
    longitude: number;
  }; 
  transactions: string[]; 
  price:string;
  location: {
    address1: string;
    address2?: string | null;
    address3?: string;
    city: string;
    zipCode: string;
    country: string;
    state: string;
    displayAddress: string[];
  }; 
  phone: string; 
  displayPhone: string; 
  distance: number; 
  businessHours?: {
    open: {
      isOvernight: boolean;
      start: string; 
      end: string; 
      day: number; 
    hoursType: string; 
    isOpenNow: boolean; 
  }[];
  }; 
  attributes?: {
    businessTempClosed?: boolean | null;
    menuUrl?: string; 
    open24Hours?: boolean | null;
    waitlistReservation?: boolean | null;
  }; 
};


type RestaurantStore = {
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  removeRestaurant: (id: string) => void;
  fetchRestaurants: (userLocation: { latitude: number; longitude: number }) => Promise<void>;
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
    
  fetchRestaurants: async (userLocation: { latitude: number; longitude: number }) => {

    console.log(userLocation);
    const apiKey = 'JHaahtXtTaeO2EqFch4v7BWI4Xy1fxjmBzC2-z2WO32RrUiqti6jRQupiMS6npdYfFfjN9QGOxu_o_Q6cbB-_oMNhVguCu5QLegsrBgfr0PxIriLvsnJ95F-CDEdZ3Yx';
    if (!apiKey) {
      throw new Error("YELP_API_KEY is not defined in the environment variables");
    }
    const radius = 300; 
    const limit = 10; 

    const transformToRestaurant = (place: any): Restaurant => {
      return {
        id: place.id,
        alias: place.alias,
        name: place.name,
        imageUrl: place.image_url,
        isClosed: place.is_closed,
        url: place.url,
        price:place.price,
        reviewCount: place.review_count,
        categories: place.categories.map((category: any) => ({
          alias: category.alias,
          title: category.title,
        })),
        rating: place.rating,
        coordinates: {
          latitude: place.coordinates.latitude,
          longitude: place.coordinates.longitude,
        },
        transactions: place.transactions || [],
        location: {
          address1: place.location.address1,
          address2: place.location.address2 || null,
          address3: place.location.address3 || "",
          city: place.location.city,
          zipCode: place.location.zip_code,
          country: place.location.country,
          state: place.location.state,
          displayAddress: place.location.display_address,
        },
        phone: place.phone,
        displayPhone: place.display_phone,
        distance: place.distance,
        businessHours: place.hours
          ? place.hours.map((hours: any) => ({
              open: hours.open.map((timeSlot: any) => ({
                isOvernight: timeSlot.is_overnight,
                start: timeSlot.start,
                end: timeSlot.end,
                day: timeSlot.day,
              })),
              hoursType: hours.hours_type,
              isOpenNow: hours.is_open_now,
            }))
          : [],
        attributes: {
          businessTempClosed: place.attributes?.business_temp_closed || null,
          menuUrl: place.attributes?.menu_url || "Menu URL not available",
          open24Hours: place.attributes?.open24_hours || null,
          waitlistReservation: place.attributes?.waitlist_reservation || null,
        },
      };
    };
    
    async function searchNearbyRestaurants(userLocation: { latitude: number; longitude: number }) {
      try {
        const url = `https://api.yelp.com/v3/businesses/search?term=restaurant&latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=${radius}&limit=${limit}`;
        const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`, 
        },
      });
       
       if(!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); 
       
        const restaurants: Restaurant[] = data.businesses.map(transformToRestaurant);
        set(() => ({ restaurants }));
      } catch (error) {
        console.error('Error fetching nearby restaurants:', error);
      }
    }
    searchNearbyRestaurants(userLocation);

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
