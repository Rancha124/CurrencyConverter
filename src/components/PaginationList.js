import React, { useState } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";

// Number of items to display per page
const PAGE_SIZE = 10;

const PaginationList = ({ displayRates }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(displayRates.length / PAGE_SIZE);
  const currentRates = displayRates.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={currentRates}
        keyExtractor={(item) => item.currency}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.country}>
              {item.country}, {item.currency}
            </Text>
            <Text style={styles.currency}>
              1 USD : {item.rate.toFixed(4)} {item.currency}
            </Text>
            <Text style={styles.date}>{item.date.toLocaleString()}</Text>
          </View>
        )}
      />
      <View style={styles.pagination}>
        <Button
          title="Previous"
          onPress={handlePreviousPage}
          disabled={currentPage === 0}
        />
        <Text>
          Page {currentPage + 1} of {totalPages}
        </Text>
        <Button
          title="Next"
          onPress={handleNextPage}
          disabled={currentPage >= totalPages - 1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
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
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
});

export default PaginationList;
