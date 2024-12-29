import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import { router } from "expo-router";
import AuthContainer from "@/utils/container/auth-container";
import { windowHeight } from "@/themes/app.constant";
import { styles } from "./styles";
import Images from "@/utils/images";
import SignInText from "@/components/login/signin.text";
import PhoneNumberInput from "@/components/login/phone-number.input";
import Button from "@/components/common/button";
import { external } from "@/styles/external.style";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const toast = useToast();

  const handleSubmit = async () => {
    if (!phoneNumber || !countryCode) {
      toast.show("Please fill the fields!", {
        placement: "bottom",
      });
    } else {
      setLoading(true);
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      await axios
        .post(`${process.env.EXPO_PUBLIC_SERVER_URI}/registration`, {
          phone_number: fullPhoneNumber,
        })
        .then((res) => {
          setLoading(false);
          router.push({
            pathname: "/(routes)/otp-verification",
            params: { fullPhoneNumber },
          });
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          toast.show(
            error?.message ||
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
              <Image style={styles.transformLine} source={Images.line} />
              <SignInText />
              <View style={[external.mt_25, external.Pb_10]}>
                <PhoneNumberInput
                  phone_number={phoneNumber}
                  setphone_number={setPhoneNumber}
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                />
                <View>
                  <Button
                    title="Get Otp"
                    onPress={() => handleSubmit()}
                    disabled={loading}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      }
    />
  );
}
