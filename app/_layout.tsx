import type { FC } from "react";
import type { FirebaseApp } from "firebase/app";
import type { Database } from "firebase/database";

import { Stack } from "expo-router";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import { firebaseConfig } from "@/config";

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
