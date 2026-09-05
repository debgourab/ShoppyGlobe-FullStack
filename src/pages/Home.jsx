import ProductList from "../components/ProductList";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Welcome to ShoppyGlobe</p>
            <h1>Shop the World,<br /><span>All in one place.</span></h1>
            <p className="hero-text">
               Discover millions of products from global brands. Enjoy fast shipping, unbeatable daily deals, and a seamless checkout experience.
            </p>
            <a className="primary-btn hero-btn" href="#products-heading">Shop now <span>→</span></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="floating-card card-one">⚡<b>Fast</b><small>Shopping</small></div>
            <div className="floating-card card-two">★<b>Top rated</b><small>Products</small></div>
            <div className="hero-bag">🛍️</div>
          </div>
        </div>
      </section>

      <div className="container">
        <ProductList />
      </div>
    </>
  );
}