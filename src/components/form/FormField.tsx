import React from "react";
import { StyleSheet, Text, View } from "react-native";

type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.star}>*</Text>}
      </Text>

      {children}

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#5A5A5A",
    fontWeight: "600",
  },
  star: {
    color: "#D64545",
    fontWeight: "700",
  },
  errorText: {
    marginTop: 2,
    fontSize: 12,
    color: "#D64545",
  },
});
