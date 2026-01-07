import React from "react";
import { View, Text } from "react-native";
import FieldError from "./FieldError";
import { globalStyles } from "../../styles/globalStyles";

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

export default function FormField({
  label,
  required,
  error,
  children,
}: Props) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={globalStyles.nomeCampo}>
        {label}
        {required && (
          <Text style={globalStyles.obrigatorio}> *</Text>
        )}
      </Text>

      {children}

      <FieldError message={error} />
    </View>
  );
}
