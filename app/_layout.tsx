import type { FC } from "react";
import type { FirebaseApp } from "firebase/app";
import type { Database } from "firebase/database";

import { Stack } from "expo-router";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig: any = {
    apiKey: "AIzaSyCxoRR2QHqqWGE-DaPJq39-wHRoY-RFTJY",
    authDomain: "iot-cafetera.firebaseapp.com",
    databaseURL: "https://iot-cafetera-default-rtdb.firebaseio.com",
    projectId: "iot-cafetera",
    storageBucket: "iot-cafetera.firebasestorage.app",
    messagingSenderId: "174251088261",
    appId: "1:174251088261:web:423967cb95098465494cec",
};

export const FIREBASE_APP: FirebaseApp = initializeApp(firebaseConfig);
export const db: Database = getDatabase(FIREBASE_APP);

const RootLayout: FC = (): JSX.Element => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
};

export default RootLayout;
