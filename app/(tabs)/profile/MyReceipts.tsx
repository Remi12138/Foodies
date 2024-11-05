import React from 'react';
import {View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import { useReceiptStore } from '@/zustand/receipt';
import { format } from 'date-fns/format';
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";

const ReceiptBlogScreen: React.FC = () => {
    const { receipts, removeReceipt } = useReceiptStore();

    // Sort receipts by date (newest first)
    const sortedReceipts = receipts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const renderReceiptItem = ({ item }: { item: typeof receipts[0] }) => (
        <View style={styles.receiptCard}>
            <Image source={{ uri: item.imgUri }} style={styles.receiptImage} />
            <View style={styles.receiptDetails}>
                <Text style={styles.receiptTitle}>{item.title}</Text>
                <Text style={styles.receiptAmount}>${item.amount.toFixed(2)}</Text>
                <Text style={styles.receiptDate}>{format(new Date(item.date), 'MMM dd, yyyy')}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => removeReceipt(item.id)}>
                    <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView >
            <FlatList
                data={sortedReceipts}
                keyExtractor={(item) => item.id}
                renderItem={renderReceiptItem}
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backText: {
        fontSize: 18,
        marginLeft: 10,
    },
    flatListContent: {
        marginTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 10,
    },
    receiptCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
        flexDirection: 'row',
    },
    receiptImage: {
        width: 80,
        height: 80,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    receiptDetails: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    receiptTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    receiptAmount: {
        fontSize: 14,
        color: '#00796b',
        fontWeight: 'bold',
    },
    receiptDate: {
        fontSize: 12,
        color: '#777777',
    },
    deleteButton: {
        padding: 2,
    },
});

export default ReceiptBlogScreen;
