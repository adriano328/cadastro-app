import React from "react";
import { Text } from "react-native";
import { globalStyles } from "../../styles/globalStyles";

type Props = {
  message?: string;
};

export default function FieldError({ message }: Props) {
  if (!message) return null;
  return <Text style={globalStyles.erro}>{message}</Text>;
}
