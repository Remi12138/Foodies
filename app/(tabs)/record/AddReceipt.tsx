import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { useReceiptStore } from '@/zustand/receipt';
import { router } from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import {useNavigation} from "@react-navigation/native";

const UploadReceiptScreen: React.FC = () => {
    const [imgUri, setImgUri] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [days, setDays] = useState<string>('0');
    const [hours, setHours] = useState<string>('0');
    const [minutes, setMinutes] = useState<string>('0');
    const [date, setDate] = useState<string>(new Date().toISOString());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const { addReceipt } = useReceiptStore();
    const navigation = useNavigation();

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
            // Alert.alert('No Notification Scheduled', 'Looks like you didn’t set a notification time. You can always add one later if needed!');
            Alert.alert('No Notification Scheduled', 'Looks like you didn’t set a notification time. You can always add one later if needed!');
            return;
        }

        if (delayInMs < 0) {
            Alert.alert('Invalid Time', 'Please set a time in the future.');
            return;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Receipt Reminder 📋",
                body: `Hey! It's time to double-check your bank for the transaction titled "${title}" for $${amount}. Make sure the amount is accurate!`,
                // icon: require("@/assets/images/notification-icon.png"),
            },
            trigger: { seconds: delayInMs / 1000 },
        });

        Alert.alert('Reminder Set', `Your reminder will pop up in ${days} days, ${hours} hours, and ${minutes} minutes.`);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Please grant media library permissions.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            // aspect: [3, 4],
        });

        if (!result.canceled) {
            setImgUri(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Please grant camera permissions.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImgUri(result.assets[0].uri);
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate.toISOString());
        }
    };

    const handleSubmit = () => {
        if (!imgUri || !title || !amount) {
            Alert.alert('Incomplete Fields', 'Please fill in all fields and upload an image.');
            return;
        }

        addReceipt(imgUri, title, parseFloat(amount), date);
        scheduleNotification();

        setImgUri(null);
        setTitle('');
        setAmount('');
        setDate(new Date().toISOString());
        setDays('0');
        setHours('0');
        setMinutes('0');
        // router.navigate("/record/MyReceipts");
        navigation.reset({
            index: 1,
            routes: [
                { name: "index" },
                { name: "MyReceipts" }
            ],
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {imgUri ? (
                    <Image source={{ uri: imgUri }} style={styles.image} />
                ) : (
                    <Text style={styles.imagePlaceholder}>Tap to Select Image</Text>
                )}
            </TouchableOpacity>
            <Button title="Capture Photo" onPress={takePhoto} color="#F4511E" />
            <View style={styles.amountContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                />
                <Text style={styles.currencySymbol}>  </Text>
            </View>
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
            <View style={styles.amountContainer}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                    <Text style={styles.dateText}>Select Date: {new Date(date).toLocaleDateString()}</Text>
                </TouchableOpacity>
                <Text style={styles.currencySymbol}>  </Text>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={new Date(date)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    // display={'default'}
                    onChange={onDateChange}
                />
            )}

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
            <Button title="Save Receipt" onPress={handleSubmit} color="#F4511E" />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    imagePicker: {
        height: 200,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    imagePlaceholder: {
        color: '#555',
        fontSize: 16,
    },
    input: {
        flex: 1,
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
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    datePickerButton: {
        flex: 1,
        marginBottom: 20,
        paddingVertical: 12,
        backgroundColor: '#F4511E',
        borderRadius: 5,
        alignItems: 'center',
    },
    dateText: {
        color: '#fff',
        fontSize: 16,
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

export default UploadReceiptScreen;
