import { ImageSourcePropType } from "react-native";
import Images from "../utils/images";

export type slide = {
  id: number;
  image: ImageSourcePropType;
  text: string;
  description: string;
};

export const slides:slide[] = [
  {
    id: 0,
    image: Images.destination,
    text: "Choose Your Destination",
    description: "First choose your destination where you want to go!",
  },
  {
    id: 1,
    image: Images.trip,
    text: "Wait for your driver",
    description: "Just wait for a while now until your driver is picking you!",
  },
  {
    id: 2,
    image: Images.bookRide,
    text: "Enjoy Your Trip",
    description:
      "Now enjoy your trip, pay your driver after reaching the destination!",
  },
];
