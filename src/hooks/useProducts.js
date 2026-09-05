import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "../api/productsApi";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    const controller = new AbortController();
    setStatus("loading");
    setError("");

    try {
      const data = await fetchProducts(controller.signal);
      setProducts(data);
      setStatus("success");
    } catch (err) {
      if (err.name === "AbortError") return;
      setStatus("error");
      setError(err.message || "Something went wrong while loading products.");
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      setStatus("loading");
      setError("");

      try {
        const data = await fetchProducts(controller.signal);
        if (!cancelled) {
          setProducts(data);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          setStatus("error");
          setError(err.message || "Something went wrong while loading products.");
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { products, status, error, retry: loadProducts };
}