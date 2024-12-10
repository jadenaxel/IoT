import { Dimensions, PixelRatio } from "react-native";

export const firebaseConfig: any = {
    apiKey: "AIzaSyCxoRR2QHqqWGE-DaPJq39-wHRoY-RFTJY",
    authDomain: "iot-cafetera.firebaseapp.com",
    databaseURL: "https://iot-cafetera-default-rtdb.firebaseio.com",
    projectId: "iot-cafetera",
    storageBucket: "iot-cafetera.firebasestorage.app",
    messagingSenderId: "174251088261",
    appId: "1:174251088261:web:423967cb95098465494cec",
};

export const MINIMUM_WATER: number = 12;
export const MAXIMUM_CUP: number = 8;

export const database_JSON_KEYS: any = {
    Sensor: "Sensor",
    control: "control",
    Mensaje: "Mensaje",
};

export const CUP_QUANTITY: any = [
    { RANGE: [12, 24], QUANTITY: 1 },
    { RANGE: [25, 37], QUANTITY: 2 },
    { RANGE: [38, 49], QUANTITY: 3 },
    { RANGE: [50, 62], QUANTITY: 4 },
    { RANGE: [63, 74], QUANTITY: 5 },
    { RANGE: [75, 87], QUANTITY: 6 },
    { RANGE: [88, 98], QUANTITY: 7 },
    { RANGE: [99, 100], QUANTITY: 8 },
];

export const GET_VIEW_HEIGHT: number = Dimensions.get("window").height;
export const GET_VIEW_WIDTH: number = Dimensions.get("window").width;

const fontScale: number = PixelRatio.getFontScale();

export const adjustedFontSize = (px: number = 16) => px / fontScale;
