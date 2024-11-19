import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useReceiptStore } from '@/zustand/receipt';
import { format } from 'date-fns';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ReceiptBlogScreen: React.FC = () => {
    const { receipts, removeReceipt } = useReceiptStore();

    const sortedReceipts = receipts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleEdit = (id: string) => {
        router.push({
            pathname: '/record/EditReceipt',
            params: { id },
        });
    };

    const renderReceiptItem = ({ item }: { item: typeof receipts[0] }) => (
        <View style={styles.receiptCard}>
            <Image source={{ uri: item.imgUri }} style={styles.receiptImage} />
            <View style={styles.receiptDetails}>
                <View style={styles.headerRow}>
                    <Text style={styles.receiptTitle}>{item.title}</Text>
                    <Text style={styles.receiptAmount}>${item.amount.toFixed(2)}</Text>
                </View>
                <Text style={styles.receiptDate}>{format(new Date(item.date), 'MMM dd, yyyy')}</Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id)}>
                        <Ionicons name="pencil" size={20} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => removeReceipt(item.id)}>
                        <Ionicons name="trash" size={20} color="#f44336" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
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
        backgroundColor: '#fff',
        padding: 15,
        marginTop: 10,
    },
    flatListContent: {
        paddingBottom: 20,
        paddingHorizontal: 5,
    },
    receiptCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 4,
        // overflow: 'hidden',
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    receiptTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    receiptAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00796b',
    },
    receiptDate: {
        fontSize: 12,
        color: '#777',
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 10,
    },
    editButton: {
        marginRight: 10,
        backgroundColor: '#e8f5e9',
        borderRadius: 5,
        padding: 5,
    },
    deleteButton: {
        backgroundColor: '#ffebee',
        borderRadius: 5,
        padding: 5,
    },
});

export default ReceiptBlogScreen;
