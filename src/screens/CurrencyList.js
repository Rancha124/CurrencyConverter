import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import useStore from "../stores";
import { fetchCurrencyRates } from "../apis/fetchCurrencyRates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PaginationList from "../components/PaginationList";

const CurrencyList = () => {
  const rates = useStore((state) => state.rates);
  const loading = useStore((state) => state.loading);
  const setLoading = useStore((state) => state.setLoading);
  const setRates = useStore((state) => state.setRates);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryRates, setSearchQueryRates] = useState([]);

  // Function to format API response into a list of objects
  const formatRates = (data) => {
    return Object.keys(data).map((key) => ({
      country: data[key].name,
      currency: data[key].code,
      rate: data[key].rate,
      date: new Date(data[key].date),
      inverseRate: data[key].inverseRate,
    }));
  };

  const fetchAndSetRates = async () => {
    setLoading(true);
    try {
      const data = await fetchCurrencyRates();
      const formattedRates = formatRates(data);
      const isStorageAvailable = await AsyncStorage.getItem("currency-storage");
      const ratesFromStorage = JSON.stringify(
        JSON.parse(isStorageAvailable).state.rates
      );
      setRates(formattedRates); // Set initial rates
      // Only update if the new rates are different from the stored rates
      if (JSON.stringify(formattedRates) !== ratesFromStorage) {
        await AsyncStorage.setItem(
          "currency-storage",
          JSON.stringify(formattedRates)
        );
        // Update the state
        setRates(formattedRates);
      }
    } catch (error) {
      console.error("Failed to fetch currency rates:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetRates();
    // Fetch every 10 seconds
    const interval = setInterval(fetchAndSetRates, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = rates.filter(
        (rate) =>
          rate.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rate.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchQueryRates(filtered);
    } else {
      setSearchQueryRates(rates);
    }
  }, [searchQuery, rates]);

  // Sort rates by conversion rate
  // Get the minimum and maximum rates
  const minRateValue = Math.min(...rates.map((rate) => rate.rate));
  const maxRateValue = Math.max(...rates.map((rate) => rate.rate));

  // Find all currencies with the lowest and highest rates
  const lowestRates = rates.filter((rate) => rate.rate === minRateValue);
  const highestRates = rates.filter((rate) => rate.rate === maxRateValue);

  // Filter out these currencies from the rest of the list
  const filteredRates = rates.filter(
    (rate) => rate.rate !== minRateValue && rate.rate !== maxRateValue
  );

  // Combine the lowest, highest, and the rest of the rates
  const displayRates = searchQuery
    ? searchQueryRates
    : [...lowestRates, ...highestRates, ...filteredRates];

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingIndicatorContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Getting latest info...</Text>
        </View>
      )}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by country or currency"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <PaginationList displayRates={displayRates} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    paddingLeft: 10,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  country: {
    fontSize: 16,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  loadingIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default CurrencyList;
