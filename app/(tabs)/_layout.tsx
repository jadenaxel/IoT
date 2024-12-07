import type { FC } from "react";

import { Tabs } from "expo-router";

const TabLayout: FC = (): JSX.Element => {
    return (
        <Tabs screenOptions={{ tabBarStyle: { display: "none" } }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Smart Coffee Maker",
                    headerTintColor: "#fff",
                    headerStyle: {
                        backgroundColor: "#27191e",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    },
                }}
            />
        </Tabs>
    );
};

export default TabLayout;
