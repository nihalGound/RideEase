import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Toast } from "react-native-toast-notifications";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContainer from "@/utils/container/auth-container";
import { windowHeight } from "@/themes/app.constant";
import SignInText from "@/components/login/signin.text";
import Button from "@/components/common/button";
import { external } from "@/styles/external.style";
import { style } from "./style";
import { commonStyles } from "@/styles/common.style";
import OTPTextInput from "react-native-otp-textinput";
import color from "@/themes/app.colors";

export default function PhoneNumberVerificatoinScreen() {
  const driver = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async () => {
    if (!otp)
      Toast.show("Please fill the field!", {
        placement: "bottom",
      });
    else {
      if (driver?.name) {
        setLoader(true);
        const otpNumber = `${otp}`;
        await axios
          .post(`${process.env.EXPO_PUBLIC_SERVER_URI}/driver/verify-otp`, {
            phone_number: driver.phone_number,
            otp: otpNumber,
            ...driver,
          })
          .then((res) => {
            const driverData = {
              ...driver,
              token: res.data.token,
            };
            setLoader(false);
            router.push({
              pathname: "/(routes)/email-verification",
              params: driverData,
            });
          })
          .catch((error) => {
            Toast.show("Your otp is incorrect or expired!", {
              placement: "bottom",
              type: "danger",
            });
          });
      } else {
        setLoader(true);
        const otpNumber = `${otp}`;
        await axios
          .post(`${process.env.EXPO_PUBLIC_SERVER_URI}/driver/login`, {
            phone_number: driver.phone_number,
            otp: otpNumber,
          })
          .then(async (res) => {
            setLoader(false);
            await AsyncStorage.setItem("accessToken", res.data.accessToken);
            router.push("/(tabs)/home");
          })
          .catch((error) => {
            Toast.show("Your otp is incorrect or expired!", {
              placement: "bottom",
              type: "danger",
            });
          });
      }
    }
  };
  return (
    <AuthContainer
      topSpace={windowHeight(240)}
      imageShow={true}
      container={
        <View>
          <SignInText
            title={"Phone Number Verification"}
            subtitle={"Check your phone number for the otp!"}
          />
          <OTPTextInput
            handleTextChange={(code) => setOtp(code)}
            inputCount={4}
            textInputStyle={style.otpTextInput}
            tintColor={color.subtitle}
            autoFocus={false}
          />
          <View style={[external.mt_30]}>
            <Button
              title="Verify"
              height={windowHeight(30)}
              onPress={() => handleSubmit()}
              disabled={loader}
            />
          </View>
          <View style={[external.mb_15]}>
            <View
              style={[
                external.pt_10,
                external.Pb_10,
                {
                  flexDirection: "row",
                  gap: 5,
                  justifyContent: "center",
                },
              ]}
            >
              <Text style={[commonStyles.regularText]}>Not Received yet?</Text>
              <TouchableOpacity>
                <Text style={[style.signUpText, { color: "#000" }]}>
                  Resend it
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
}
