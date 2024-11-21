import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useReceiptStore } from '@/zustand/receipt';
import {  router } from 'expo-router';
import {useRoute} from "@react-navigation/native";

const EditReceiptScreen: React.FC = () => {
    const { receipts, updateReceipt } = useReceiptStore();
    const route = useRoute();
    const { id } = route.params as { id: string };

    const receipt = receipts.find(r => r.id === id);

    const [title, setTitle] = useState<string>(receipt ? receipt.title : '');
    const [amount, setAmount] = useState<string>(receipt ? receipt.amount.toString() : '');
    const [days, setDays] = useState<string>('0');
    const [hours, setHours] = useState<string>('0');
    const [minutes, setMinutes] = useState<string>('0');

    useEffect(() => {
        const requestNotificationsPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissions Needed', 'Please enable notifications to receive reminders.');
            }
        };
        requestNotificationsPermissions();
    }, []);

    const scheduleNotification = async () => {
        const delayInMs =
            (parseFloat(days) * 24 * 60 * 60 * 1000) +
            (parseFloat(hours) * 60 * 60 * 1000) +
            (parseFloat(minutes) * 60 * 1000);

        if (isNaN(delayInMs) || delayInMs === 0) {
            // Alert.alert('Missing Scheduled Time', 'Please set a valid notification time.');
            return;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Receipt Reminder 📋",
                body: `Hey! It's time to double-check your bank for the transaction titled "${title}" for $${amount}. Make sure the amount is accurate!`,
            },
            trigger: { seconds: delayInMs / 1000 },
        });

        Alert.alert('Reminder Set', `Your reminder will pop up in ${days} days, ${hours} hours, and ${minutes} minutes.`);
    };

    const handleSave = () => {
        if (!title || !amount) {
            Alert.alert('Incomplete Fields', 'Please fill in all fields.');
            return;
        }

        updateReceipt(id, { title, amount: parseFloat(amount) });
        scheduleNotification();

        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>Edit Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={(text) => setTitle(text)}
            />
            <Text style={styles.label}>Edit Amount</Text>
            <View style={styles.amountContainer}>
                <TextInput
                    style={[styles.input, styles.amountInput]}
                    placeholder="Amount"
                    value={amount}
                    onChangeText={(text) => setAmount(text)}
                    keyboardType="numeric"
                />
                <Text style={styles.currencySymbol}>$</Text>
            </View>

            <Text style={styles.label}>Notification Timer</Text>
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

            <Button title="Save Changes" onPress={handleSave} color="#F4511E" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    amountInput: {
        flex: 1,
    },
    currencySymbol: {
        fontSize: 18,
        marginLeft: 10,
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

export default EditReceiptScreen;
