import { create } from "zustand";
import dummyRestaurants from "@/dummy/restaurants.json";

interface BusinessHours {
  open: {
    is_overnight: boolean;
    start: string;
    end: string;
    day: number;
  }[];
  hours_type: string;
  is_open_now: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  categories: { title: string }[];
  price: string;
  rating: number;
  reviewCount: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  location: {
    address1: string;
    address2: string | null;
    address3: string;
    city: string;
    zipCode: string;
    country: string;
    state: string;
    displayAddress: string[];
  };
  displayPhone: string;
  businessHours: BusinessHours[];
  distance: number;
  url: string;
  attributes?: {
    businessTempClosed: boolean | null;
    menuUrl: string;
    open24Hours: boolean | null;
    waitlistReservation: boolean | null;
  };
}


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

   // console.log(userLocation);
    const apiKey = 'JHaahtXtTaeO2EqFch4v7BWI4Xy1fxjmBzC2-z2WO32RrUiqti6jRQupiMS6npdYfFfjN9QGOxu_o_Q6cbB-_oMNhVguCu5QLegsrBgfr0PxIriLvsnJ95F-CDEdZ3Yx';
    if (!apiKey) {
      throw new Error("YELP_API_KEY is not defined in the environment variables");
    }
    const radius = 1000; 
    const limit = 30; 

    const transformToRestaurant = (place: any): Restaurant => {
      return {
        id: place.id,
        name: place.name,
        imageUrl: place.image_url,
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
        location: {
          address1: place.location.address1 || null,
          address2: place.location.address2 || null,
          address3: place.location.address3 || "",
          city: place.location.city,
          zipCode: place.location.zip_code,
          country: place.location.country,
          state: place.location.state,
          displayAddress: place.location.display_address,
        },
        displayPhone: place.display_phone,
        distance: place.distance,
        businessHours: place.business_hours
          ? place.business_hours.map((hours: any) => ({
              open: hours.open.map((timeSlot: any) => ({
                isOvernight: timeSlot.is_overnight,
                start: timeSlot.start,
                end: timeSlot.end,
                day: timeSlot.day,
              })),
              hours_type: hours.hours_type,
              is_open_now: hours.is_open_now,
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
        console.log(userLocation.latitude);
        console.log(userLocation.longitude);
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
    const transformToRestaurant = (place: any): Restaurant => {
      return {
        id: place.id,
        name: place.name,
        imageUrl: place.image_url,
        categories: place.categories.map((cat: any) => ({ title: cat.title })),
        price: place.price,
        rating: place.rating,
        reviewCount: place.review_count,
        coordinates: {
          latitude: place.coordinates.latitude,
          longitude: place.coordinates.longitude,
        },
        distance: place.distance,
        location: {
          address1: place.location.address1 || null,
          address2: place.location.address2 || null,
          address3: place.location.address3 || "",
          city: place.location.city,
          zipCode: place.location.zip_code,
          country: place.location.country,
          state: place.location.state,
          displayAddress: place.location.display_address,
        },
        displayPhone: place.display_phone,
        businessHours: place.business_hours
          ? place.business_hours.map((hours: any) => ({
              open: hours.open.map((timeSlot: any) => ({
                is_overnight: timeSlot.is_overnight,
                start: timeSlot.start,
                end: timeSlot.end,
                day: timeSlot.day,
              })),
              hours_type: hours.hours_type,
              is_open_now: hours.is_open_now,
            }))
          : [],
        url: place.url,
      };
    };
    return new Promise((resolve) => {
      setTimeout(() => {
       
        const restaurants: Restaurant[] = dummyRestaurants.businesses.map(transformToRestaurant);
        set(() => ({ restaurants }));
        console.log("Fetched fake restaurants");
        resolve();
      }, 1000);
    });
  },

}));
