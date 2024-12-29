import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";

export default function index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = false;
    const getData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (isMounted) {
          setIsLoggedIn(!!accessToken); // string ! => false ! => true(loggedIn); null ! => true ! => false(not logged in);
        }
      } catch (error) {
        console.log("Failed to recieve accessToken from async storage ", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return null;
  }
  return (
    <Redirect href={!isLoggedIn ? "/(routes)/onboarding" : "(tabs)/home"} />
  );
}
