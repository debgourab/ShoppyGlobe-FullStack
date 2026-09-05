// Fake Store API prices are provided in USD.
// This project displays all customer-facing prices in Indian Rupees.
export const USD_TO_INR = 90;

export function convertToINR(usdPrice) {
  return Number((Number(usdPrice || 0) * USD_TO_INR).toFixed(2));
}

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(amount || 0));
}
