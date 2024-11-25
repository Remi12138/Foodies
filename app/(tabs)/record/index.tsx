import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import DietListScreen from './MyDiets';
import ReceiptBlogScreen from './MyReceipts';
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {HelloWave} from "@/components/common/HelloWave";
import SwitchTab from './SwitchTab';

const RecordScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Diets' | 'Receipts'>('Diets');
    const handleTabChange = (tab: 'Diets' | 'Receipts') => {
        setActiveTab(tab);
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
            <ThemedView style={styles.titleContainer}>
                <ThemedView style={{ flexDirection: "row" }}>
                    <ThemedText type="title">Record</ThemedText>
                    <HelloWave emoji=" 🍱 " />
                </ThemedView>
            </ThemedView>

            <SwitchTab activeTab={activeTab} onTabChange={handleTabChange} />
            <View style={styles.contentContainer}>
                {activeTab === 'Diets' ? <DietListScreen /> : <ReceiptBlogScreen />}
            </View>
            </SafeAreaView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#ffffff',
    },
    safeArea: {
        flex: 1,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    contentContainer: {
        flex: 1,
        padding: 10,
    },
    titleContainer: {
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});

export default RecordScreen;
