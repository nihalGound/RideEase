import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import React, { ReactNode } from "react";
import { external } from "@/styles/external.style";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { styles } from "./styles";
import Images from "../images";

type Props = {
  container: ReactNode;
  topSpace: any;
  imageShow: boolean;
};

export default function AuthContainer({
  container,
  topSpace,
  imageShow,
}: Props) {
  return (
    <KeyboardAvoidingView
      style={[external.fx_1]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {imageShow && (
        <Text
          style={{
            fontFamily: "TT-Octosquares-Medium",
            fontSize: windowWidth(30),
            textAlign: "center",
            padding: windowHeight(50),
          }}
        >
          Ride Wave
        </Text>
      )}
      <Image
        style={[styles.backgroundImage, { marginTop: topSpace }]}
        source={Images.authBg}
      />
      <View style={styles.contentContainer}>
        <View style={[styles.container]}>
          <ScrollView>{container}</ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
