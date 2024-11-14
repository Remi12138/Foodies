import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

type Receipt = {
    id: string;
    imgUri: string;
    title: string;
    amount: number;
    date: string;
};

type ReceiptStore = {
    receipts: Receipt[];
    addReceipt: (imgUri: string, title: string, amount: number, date: string) => void;
    loadReceipts: () => void;
    removeReceipt: (id: string) => void;
    updateReceipt: (id: string, updatedData: Partial<Omit<Receipt, 'id'>>) => void;
};

const useReceiptStore = create<ReceiptStore>()(
    persist<ReceiptStore>(
        (set, get) => ({
            receipts: [],
            addReceipt: async (imgUri, title, amount, date) => {
                const newReceipt: Receipt = {
                    id: Date.now().toString(),
                    imgUri,
                    title,
                    amount,
                    date,
                };
                const updatedReceipts = [newReceipt, ...get().receipts];
                set({ receipts: updatedReceipts });
                await AsyncStorage.setItem('receipts', JSON.stringify(updatedReceipts));
            },
            loadReceipts: async () => {
                const storedReceipts = await AsyncStorage.getItem('receipts');
                if (storedReceipts) set({ receipts: JSON.parse(storedReceipts) });
            },
            removeReceipt: async (id) => {
                const updatedReceipts = get().receipts.filter(receipt => receipt.id !== id);
                set({ receipts: updatedReceipts });
                await AsyncStorage.setItem('receipts', JSON.stringify(updatedReceipts));
            },
            updateReceipt: async (id, updatedData) => {
                const updatedReceipts = get().receipts.map(receipt =>
                    receipt.id === id ? { ...receipt, ...updatedData } : receipt
                );
                set({ receipts: updatedReceipts });
                await AsyncStorage.setItem('receipts', JSON.stringify(updatedReceipts));
            },
        }),
        {
            name: 'receipt-storage', // AsyncStorage key
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export { useReceiptStore };
