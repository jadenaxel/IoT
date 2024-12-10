import type { FC } from "react";

import { ActivityIndicator } from "react-native";

const Loading: FC = (): JSX.Element => {
    return <ActivityIndicator color={"red"} size={40} style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
};

export default Loading;
