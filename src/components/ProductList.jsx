import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useProducts from "../hooks/useProducts";
import { selectSearchTerm } from "../store/selectors";
import ProductItem from "./ProductItem";
import Loading from "./Loading";
import ErrorState from "./ErrorState";

export default function ProductList() {
  const { products, status, error, retry } = useProducts();
  const searchTerm = useSelector(selectSearchTerm).trim().toLowerCase();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    const values = [...new Set(products.map((product) => product.category).filter(Boolean))];
    return ["all", ...values];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !searchTerm || [product.title, product.category, product.brand]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchTerm));
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  if (status === "loading") return <Loading />;
  if (status === "error") return <ErrorState message={error} onRetry={retry} />;

  return (
    <section className="products-section" aria-labelledby="products-heading">
      <div className="section-heading">
        <div className="section-heading-copy">
          <p className="eyebrow">Curated collection</p>
          <h2 id="products-heading">Trending products</h2>
          <p>Shop a focused selection of highly rated essentials chosen for everyday style, work and lifestyle.</p>
        </div>

        <span className="result-count">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
        </span>
      </div>

      <div className="filter-row" aria-label="Filter products by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={activeCategory === category ? "filter-pill active" : "filter-pill"}
            onClick={() => setActiveCategory(category)}
          >
            {category === "all" ? "All products" : category}
          </button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => <ProductItem key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="no-results">
          <h3>No products found</h3>
          <p>Try another search term or choose a different category.</p>
        </div>
      )}
    </section>
  );
}
