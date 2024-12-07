import type { FC } from "react";

import { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView, ImageBackground } from "react-native";

import { Feather } from "@expo/vector-icons";
import { ref, onValue } from "firebase/database";

import { db } from "../_layout";
import { CircleSlider } from "../../components";

const Home: FC = (): JSX.Element => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        const conexion = ref(db, "Mensaje");
        onValue(conexion, (a) => {
            const data = a.val();
            console.log(data);
        });
    }, []);

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView contentContainerStyle={styles.scrollView} bounces={false}>
                <CircleSlider radius={150} min={1} max={5} initialValue={1} strokeWidth={10}>
                    <ImageBackground source={require("../assets/coffee.png")} style={styles.coffee}>
                        <View style={styles.playPause}>
                            <Feather name={isPlaying ? "pause" : "play"} size={44} color="white" onPress={() => setIsPlaying(!isPlaying)} />
                        </View>
                    </ImageBackground>
                </CircleSlider>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#1e181a",
        paddingHorizontal: 15,
    },
    scrollView: {
        flex: 1,
        justifyContent: "center",
    },
    coffee: {
        height: 300,
        width: 300,
        position: "relative",
        top: -150,
        justifyContent: "center",
        alignItems: "center",
    },
    playPause: {
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 15,
        borderRadius: 50,
    },
});

export default Home;
