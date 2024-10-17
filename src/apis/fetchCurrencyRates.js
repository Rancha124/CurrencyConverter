import axios from "axios";

export const fetchCurrencyRates = async () => {
  try {
    const response = await axios.get(
      "https://www.floatrates.com/daily/usd.json"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    return {};
  }
};
