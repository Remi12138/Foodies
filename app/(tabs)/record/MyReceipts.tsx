import React, {useState} from 'react';
import { Platform, View, Alert, Modal, Text, TextInput, Image, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useReceiptStore } from '@/zustand/receipt';
import { format } from 'date-fns';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Notifications from 'expo-notifications';
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const ReceiptBlogScreen: React.FC = () => {
    const { receipts, removeReceipt } = useReceiptStore();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [reminderModalVisible, setReminderModalVisible] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<{ title: string; amount: number } | null>(null);

    const [days, setDays] = useState<string>('0');
    const [hours, setHours] = useState<string>('0');
    const [minutes, setMinutes] = useState<string>('0');
    const textColor = useThemeColor({}, "text");
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

    const createNotificationChannel = async () => {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('receipt-reminder-channel', {
                name: 'Receipt Reminders',
                importance: Notifications.AndroidImportance.HIGH, // Set importance level
                description: 'Notifications for receipt reminders',
            });
        }
    };

    const scheduleNotification = async () => {
        // Create the notification channel (Android only)
        if (Platform.OS === 'android') {
            await createNotificationChannel();
        }

        const validDays = parseFloat(days) || 0;
        const validHours = parseFloat(hours) || 0;
        const validMinutes = parseFloat(minutes) || 0;

        const delayInMs =
            (validDays * 24 * 60 * 60 * 1000) +
            (validHours * 60 * 60 * 1000) +
            (validMinutes * 60 * 1000);

        if (isNaN(delayInMs) || delayInMs === 0) {
            // Alert.alert('Missing Scheduled Time', 'Please set a valid notification time.');
            return;
        }

        if (delayInMs < 0) {
            Alert.alert('Invalid Time', 'Please set a time in the future.');
            return;
        }
        const triggerTime = new Date().getTime() + delayInMs;
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Receipt Reminder 📋",
                body: `Hey! It's time to double-check your bank for the transaction titled "${selectedReceipt?.title}" for $${selectedReceipt?.amount}. Make sure the amount is accurate!`,
            },
            trigger: {
                type: 'date', // Explicitly specify the type as 'date'
                date: new Date(triggerTime), // Set the target date
                repeats: false, // No repeats
                channelId: Platform.OS === 'android' ? 'receipt-reminder-channel' : undefined, // Use channelId for Android
            } as Notifications.NotificationTriggerInput,
        });

        const timeParts = [];
        if (validDays > 0) timeParts.push(`${validDays} day${validDays > 1 ? "s" : ""}`);
        if (validHours > 0) timeParts.push(`${validHours} hour${validHours > 1 ? "s" : ""}`);
        if (validMinutes > 0) timeParts.push(`${validMinutes} minute${validMinutes > 1 ? "s" : ""}`);
        const message = `Your reminder will pop up in ${timeParts.join(", ")}.`;
        Alert.alert('Reminder Set', message);

        setReminderModalVisible(false); // Close the modal
        setDays("0");
        setHours("0");
        setMinutes("0");
    };


    const renderReceiptItem = ({ item }: { item: typeof receipts[0] }) => (
        <TouchableOpacity onPress={() => handleImageClick(item.imgUri)}>
        <ThemedView style={styles.receiptCard}>
            <Image source={{ uri: item.imgUri }} style={styles.receiptImage} />
            <View style={styles.receiptDetails}>
                <View style={styles.headerRow}>
                    <ThemedText style={styles.receiptTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.receiptAmount}>${item.amount.toFixed(2)}</ThemedText>
                </View>
                <ThemedText style={styles.receiptDate}>{format(new Date(item.date), 'MMM dd, yyyy')}</ThemedText>
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
        </ThemedView>
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
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
                    <ThemedView style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>Set Reminder</ThemedText>
                        <View style={styles.timeInputsContainer}>
                            <View style={styles.timeInputGroup}>
                                <TextInput
                                    style={[styles.timeInput, { color: textColor }]}
                                    placeholder="Days"
                                    placeholderTextColor={textColor + "99"}
                                    value={days}
                                    onChangeText={(text) => setDays(text)}
                                    keyboardType="numeric"
                                />
                                <ThemedText style={styles.timeUnit}>day</ThemedText>
                            </View>
                            <View style={styles.timeInputGroup}>
                                <TextInput
                                    style={[styles.timeInput, { color: textColor }]}
                                    placeholder="Hours"
                                    placeholderTextColor={textColor + "99"}
                                    value={hours}
                                    onChangeText={(text) => setHours(text)}
                                    keyboardType="numeric"
                                />
                                <ThemedText style={styles.timeUnit}>hour</ThemedText>
                            </View>
                            <View style={styles.timeInputGroup}>
                                <TextInput
                                    style={[styles.timeInput, { color: textColor }]}
                                    placeholder="Minutes"
                                    placeholderTextColor={textColor + "99"}
                                    value={minutes}
                                    onChangeText={(text) => setMinutes(text)}
                                    keyboardType="numeric"
                                />
                                <ThemedText style={styles.timeUnit}>min</ThemedText>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.scheduleButton} onPress={scheduleNotification}>
                            <Text style={styles.scheduleButtonText}>Schedule Reminder</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton2} onPress={() => setReminderModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </ThemedView>
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
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        padding: 15,
        // marginTop: 10,
    },
    flatListContent: {
        paddingBottom: 20,
        paddingHorizontal: 5,
    },
    receiptCard: {
        // backgroundColor: '#f5f5f5',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 1.4,
        elevation: 2,
        // overflow: 'hidden',
    },
    receiptImage: {
        width: 90,
        height: 90,
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
        // color: '#333',
    },
    receiptAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#47a44a',
        // color: '#00796b',
    },
    receiptDate: {
        fontSize: 12,
        // color: '#777',
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 10,
    },
    editButton: {
        marginRight: 10,
        // backgroundColor: '#e8f5e9',
        borderRadius: 5,
        padding: 5,
    },
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
        // backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
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
        // backgroundColor: '#ffffff',
    },
    timeUnit: {
        fontSize: 16,
        marginLeft: 8,
    },
});

export default ReceiptBlogScreen;
