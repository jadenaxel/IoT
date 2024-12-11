import type { FC } from "react";
import type { DatabaseReference } from "firebase/database";

import { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView, ImageBackground, StatusBar, Text, Image, Pressable } from "react-native";

import { Feather } from "@expo/vector-icons";
import { ref, set, onValue, get } from "firebase/database";

import { db } from "../_layout";
import { Loading } from "../../components";
import { database_JSON_KEYS, MINIMUM_WATER, MAXIMUM_CUP, CUP_QUANTITY, adjustedFontSize, GET_VIEW_HEIGHT, GET_VIEW_WIDTH } from "../../config";

const Home: FC = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState({
        Msj: "",
        color: "",
    });

    const [water, setWater] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);

    const getControl: DatabaseReference = ref(db, database_JSON_KEYS.control);
    const getWaterV: DatabaseReference = ref(db, database_JSON_KEYS.Sensor);
    const getDBMsg: DatabaseReference = ref(db, database_JSON_KEYS.Mensaje);

    const prepareCoffee = async () => {
        const snapshot: any = (await get(getControl)).toJSON();

        if (snapshot.Cant === 0) {
            setErrorMsg({ Msj: "Cantidad de copa debe ser mayor a cero.", color: "red" });
            return;
        }

        if (snapshot.Preparar) {
            setErrorMsg({ Msj: "El cafe se esta preparando", color: "red" });
            return;
        }

        try {
            setIsPlaying((prev: any) => !prev);
            await set(getControl, {
                Preparar: !snapshot.Preparar,
                Cant: snapshot.Cant,
            });
        } catch (error: any) {
            setErrorMsg({ Msj: error.message, color: "red" });
        }
    };

    const handleQuantity = async (type: boolean) => {
        const snapshot: any = (await get(getControl)).toJSON();
        const sensorShot: any = (await get(getWaterV)).toJSON();
        const CantP: number = type ? snapshot.Cant + 1 : snapshot.Cant - 1;

        try {
            if (snapshot.Cant === 0 && !type) return;
            if (snapshot.Cant === MAXIMUM_CUP && type) return;
            if (snapshot.Preparar) return;

            if (sensorShot.Nivel_Agua < MINIMUM_WATER) {
                setErrorMsg({ Msj: "Nivel de agua insuficiente", color: "red" });
                return;
            }

            const CUP_RANGE = CUP_QUANTITY.filter((item: any) => item.QUANTITY === CantP);
            if (CUP_RANGE[0] !== undefined) {
                if (CUP_RANGE[0].RANGE.every((item: any) => item > sensorShot.Nivel_Agua)) {
                    return;
                }
            }

            await set(getControl, {
                Preparar: snapshot.Preparar,
                Cant: CantP,
            });
        } catch (error: any) {
            setErrorMsg({ Msj: error.message, color: "red" });
        }
    };

    const getMSG = (db: DatabaseReference, state: any) => {
        try {
            onValue(db, (item: any) => {
                const data: any = item.val();
                state(data);
            });
        } catch (error: any) {
            setErrorMsg({ Msj: error.message, color: "red" });
        }
    };

    const getData = (db: DatabaseReference, state: any, key: any) => {
        try {
            onValue(db, (item: any) => {
                const data: any = item.val();
                state(data[key]);
            });
        } catch (error: any) {
            setErrorMsg({ Msj: error.message, color: "red" });
        }
    };

    useEffect(() => {
        getData(getControl, setIsPlaying, "Preparar");
        getMSG(getDBMsg, setErrorMsg);
        getData(getControl, setQuantity, "Cant");
        getData(getWaterV, setWater, "Nivel_Agua");

        setIsLoading(false);
    }, []);

    const waterImage = water >= MINIMUM_WATER ? require("../assets/wdrop.png") : require("../assets/wdropred.png");

    if (isLoading) return <Loading />;

    return (
        <SafeAreaView style={styles.main}>
            <StatusBar hidden />
            <ScrollView contentContainerStyle={styles.scrollView} bounces={false} showsVerticalScrollIndicator={false}>
                <ImageBackground source={require("../assets/coffee.png")} style={styles.coffee}>
                    <View style={styles.playPause}>
                        <Feather name={isPlaying ? "pause" : "play"} size={44} color="white" onPress={prepareCoffee} />
                    </View>
                </ImageBackground>

                <View style={[{ borderRadius: 14, backgroundColor: errorMsg.color }, styles.detailsMsg]}>
                    <Text style={styles.detailsMsgText}>{errorMsg.Msj}</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cups}>
                        {new Array(quantity).fill(0).map((item: any, i: any) => (
                            <Image source={require("../assets/coffee_cup.png")} style={styles.cardCup} key={i} />
                        ))}
                    </View>

                    <View style={styles.cardData}>
                        <Text style={styles.quantityCup}>Cantidad</Text>
                        <View style={styles.control}>
                            <Pressable onPress={async () => await handleQuantity(false)}>
                                <Text style={styles.cardDataText}>-</Text>
                            </Pressable>
                            <Text style={styles.cardDataText}>{quantity}</Text>
                            <Pressable onPress={async () => await handleQuantity(true)}>
                                <Text style={styles.cardDataText}>+</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <ImageBackground source={waterImage} style={styles.drop}>
                    <Text style={styles.dropText}>{water}%</Text>
                </ImageBackground>

                <View style={styles.copy}>
                    <Text style={styles.copyright}>© 2024 Smart Coffee Maker ®</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#f0e5b1",
        paddingHorizontal: 15,
    },
    scrollView: {
        padding: 15,
    },
    coffee: {
        height: GET_VIEW_HEIGHT / 5,
        width: GET_VIEW_WIDTH / 2,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 20,
    },
    playPause: {
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 15,
        borderRadius: 50,
    },
    detailsMsg: {
        padding: 10,
        width: GET_VIEW_WIDTH / 1.5,
        alignSelf: "center",
        alignItems: "center",
        marginBottom: 20,
        borderRadius: 14,
    },
    detailsMsgText: {
        fontSize: adjustedFontSize(18),
    },
    card: {
        backgroundColor: "white",
        borderRadius: 14,
        padding: 14,
        flexDirection: "column",
    },
    cups: {
        flexDirection: "row",
        marginBottom: 10,
    },
    cardCup: {
        height: GET_VIEW_HEIGHT / 14,
        width: GET_VIEW_WIDTH / 10.5,
    },
    quantityCup: {
        fontWeight: "bold",
        marginBottom: 5,
        fontSize: adjustedFontSize(),
        color: "white",
    },
    control: {
        flexDirection: "row",
    },
    cardData: {
        flexDirection: "row",
        backgroundColor: "#332d0d",
        padding: 10,
        borderRadius: 14,
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardDataText: {
        color: "white",
        fontSize: adjustedFontSize(20),
        fontWeight: "bold",
        marginHorizontal: 10,
    },
    drop: {
        height: 100,
        width: 60,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: 100,
        marginBottom: 70,
    },
    dropText: {
        fontSize: adjustedFontSize(17),
        fontWeight: "bold",
        bottom: 30,
    },
    copy: {
        alignItems: "center",
    },
    copyright: {
        fontSize: adjustedFontSize(20),
    },
});

export default Home;
