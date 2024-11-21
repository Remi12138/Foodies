import React, {useState} from 'react';
import { View, Alert, Modal, Text, TextInput, Image, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useReceiptStore } from '@/zustand/receipt';
import { format } from 'date-fns';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Notifications from 'expo-notifications';

const ReceiptBlogScreen: React.FC = () => {
    const { receipts, removeReceipt } = useReceiptStore();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [reminderModalVisible, setReminderModalVisible] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<{ title: string; amount: number } | null>(null);

    const [days, setDays] = useState<string>('0');
    const [hours, setHours] = useState<string>('0');
    const [minutes, setMinutes] = useState<string>('0');

    const sortedReceipts = receipts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleEdit = (id: string) => {
        router.push({
            pathname: '/record/EditReceipt',
            params: { id },
        });
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Receipt",
            "Are you sure you want to delete this receipt?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => removeReceipt(id) }
            ]
        );
    };

    // Open the modal with the selected image
    const handleImageClick = (imgUri: string) => {
        setSelectedImage(imgUri);
    };

    const handleSetReminder = (receipt: { title: string; amount: number }) => {
        setSelectedReceipt(receipt);
        setReminderModalVisible(true);
    };

    const scheduleNotification = async () => {
        const delayInMs =
            (parseFloat(days) * 24 * 60 * 60 * 1000) +
            (parseFloat(hours) * 60 * 60 * 1000) +
            (parseFloat(minutes) * 60 * 1000);

        if (isNaN(delayInMs) || delayInMs === 0) {
            // Alert.alert('Missing Scheduled Time', 'Please set a valid notification time.');
            return;
        }

        if (delayInMs < 0) {
            Alert.alert('Invalid Time', 'Please set a time in the future.');
            return;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Receipt Reminder 📋",
                body: `Hey! It's time to double-check your bank for the transaction titled "${selectedReceipt?.title}" for $${selectedReceipt?.amount}. Make sure the amount is accurate!`,
            },
            trigger: { seconds: delayInMs / 1000 },
        });

        Alert.alert('Reminder Set', `Your reminder will pop up in ${days} days, ${hours} hours, and ${minutes} minutes.`);
        setReminderModalVisible(false); // Close the modal
        setDays("0");
        setHours("0");
        setMinutes("0");
    };


    const renderReceiptItem = ({ item }: { item: typeof receipts[0] }) => (
        <TouchableOpacity onPress={() => handleImageClick(item.imgUri)}>
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
                        <Ionicons name="pencil" size={25} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleSetReminder({ title: item.title, amount: item.amount })}
                    >
                        <Ionicons name="alarm" size={25} color="#2196F3" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash" size={25} color="#f44336" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </TouchableOpacity>
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

            {/* Modal for setting reminder */}
            <Modal
                visible={reminderModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setReminderModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Set Reminder</Text>
                        <View style={styles.timeInputsContainer}>
                            <View style={styles.timeInputGroup}>
                                <TextInput
                                    style={styles.timeInput}
                                    placeholder="Days"
                                    value={days}
                                    onChangeText={(text) => setDays(text)}
                                    keyboardType="numeric"
                                />
                                <Text style={styles.timeUnit}>day</Text>
                            </View>
                            <View style={styles.timeInputGroup}>
                                <TextInput
                                    style={styles.timeInput}
                                    placeholder="Hours"
                                    value={hours}
                                    onChangeText={(text) => setHours(text)}
                                    keyboardType="numeric"
                                />
                                <Text style={styles.timeUnit}>hour</Text>
                            </View>
                            <View style={styles.timeInputGroup}>
                                <TextInput
                                    style={styles.timeInput}
                                    placeholder="Minutes"
                                    value={minutes}
                                    onChangeText={(text) => setMinutes(text)}
                                    keyboardType="numeric"
                                />
                                <Text style={styles.timeUnit}>min</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.scheduleButton} onPress={scheduleNotification}>
                            <Text style={styles.scheduleButtonText}>Schedule Reminder</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton2} onPress={() => setReminderModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal to display the larger image */}
            <Modal
                visible={!!selectedImage}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImage(null)} // Close the modal on back press
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedImage(null)}>
                        <Ionicons name="close" size={30} color="#fff" />
                    </TouchableOpacity>
                    {selectedImage && ( // Ensure `selectedImage` is not null
                        <Image
                            source={{ uri: selectedImage || undefined }} // use undefined if no value
                            style={styles.modalImage}
                        />
                    )}
                </View>
            </Modal>
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
    // deleteButton: {
    //     backgroundColor: '#ffebee',
    //     borderRadius: 5,
    //     padding: 5,
    // },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '90%',
        height: '70%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    scheduleButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    scheduleButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeButton2: {
        marginTop: 10,
    },
    closeButtonText: {
        color: '#f44336',
        fontWeight: 'bold',
    },
    timeInputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    timeInputGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    timeInput: {
        flex: 1,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
    },
    timeUnit: {
        fontSize: 16,
        marginLeft: 8,
    },
});

export default ReceiptBlogScreen;
