import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      rates: [],
      setRates: (newRates) => set(() => ({ rates: newRates })),
      loading: false,
      setLoading: (loadingState) => set({ loading: loadingState }),
    }),
    {
      name: "currency-storage", // name of item in storage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
