import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Toast } from "react-native-toast-notifications";
import axios from "axios";
import { router } from "expo-router";
import AuthContainer from "@/utils/container/auth-container";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { styles } from "./styles";
import SignInText from "@/components/login/signin.text";
import { external } from "@/styles/external.style";
import PhoneNumberInput from "@/components/login/phone-number.input";
import Button from "@/components/common/button";
import Images from "@/utils/images";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");

  const handleSubmit = async () => {
    if (!phoneNumber || !countryCode) {
      Toast.show("Please fill the fields!", {
        placement: "bottom",
      });
    } else {
      setLoading(true);
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      await axios
        .post(`${process.env.EXPO_PUBLIC_SERVER_URI}/driver/send-otp`, {
          phone_number: fullPhoneNumber,
        })
        .then((res) => {
          setLoading(false);
          const driver = {
            phone_number: fullPhoneNumber,
          };
          router.push({
            pathname: "/(routes)/verification-phone-number",
            params: driver,
          });
        })
        .catch((error) => {
          setLoading(false);
          Toast.show(
            "Something went wrong! please re check your phone number!",
            {
              type: "danger",
              placement: "bottom",
            }
          );
        });
    }
  };
  return (
    <AuthContainer
      topSpace={windowHeight(150)}
      imageShow={true}
      container={
        <View>
          <View>
            <View>
              <Image style={styles.tranformLine} source={Images.line} />
              <SignInText />
              <View style={[external.mt_25, external.Pb_10]}>
                <PhoneNumberInput
                  phone_number={phoneNumber}
                  setphone_number={setPhoneNumber}
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                />
                <View style={[external.mt_25, external.Pb_15]}>
                  <Button
                    title="Get Otp"
                    disabled={loading}
                    height={windowHeight(35)}
                    onPress={() => handleSubmit()}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: windowWidth(8),
                    paddingBottom: windowHeight(15),
                  }}
                >
                  <Text style={{ fontSize: windowHeight(12) }}>
                    Don't have any rider account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(routes)/signup")}
                  >
                    <Text style={{ color: "blue", fontSize: windowHeight(12) }}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      }
    />
  );
}
