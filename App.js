import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import CurrencyList from "./src/screens/CurrencyList";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>
      <CurrencyList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
});
