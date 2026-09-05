import { useMemo } from "react";
import { useSelector } from "react-redux";
import useProducts from "../hooks/useProducts";
import { selectSearchTerm } from "../store/selectors";
import ProductItem from "./ProductItem";
import Loading from "./Loading";
import ErrorState from "./ErrorState";

export default function ProductList() {
  const { products, status, error, retry } = useProducts();
  const searchTerm = useSelector(selectSearchTerm).trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }

    return products.filter((product) =>
      [product.title, product.category, product.brand]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchTerm))
    );
  }, [products, searchTerm]);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={retry} />;
  }

  const productContent = filteredProducts.length > 0 ? (
    <div className="product-grid">
      {filteredProducts.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  ) : (
    <div className="no-results">
      <h3>No products found</h3>
      <p>Try a different search term.</p>
    </div>
  );

  return (
    <section className="products-section" aria-labelledby="products-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Curated collection</p>
          <h2 id="products-heading">Explore Products</h2>
        </div>

        <span className="result-count">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </span>
      </div>

      {productContent}
    </section>
  );
}
