function makeImage(label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <rect width="600" height="600" fill="#f3f4f6"/>
      <rect x="80" y="80" width="440" height="440" rx="32" fill="#ffffff" stroke="#d1d5db" stroke-width="4"/>
      <text x="300" y="300" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="34" fill="#111827">${label}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const fallbackProducts = [
  {
    externalId: 1,
    title: "Classic Everyday Backpack",
    price: 2499,
    description: "A practical everyday backpack with a roomy main compartment and comfortable shoulder straps.",
    category: "men's clothing",
    image: makeImage("Backpack"),
    thumbnail: makeImage("Backpack"),
    stock: 12,
    rating: { rate: 4.4, count: 128 }
  },
  {
    externalId: 2,
    title: "Slim Casual T-Shirt",
    price: 899,
    description: "A lightweight casual T-shirt designed for daily wear with a comfortable regular fit.",
    category: "men's clothing",
    image: makeImage("T-Shirt"),
    thumbnail: makeImage("T-Shirt"),
    stock: 20,
    rating: { rate: 4.2, count: 94 }
  },
  {
    externalId: 3,
    title: "Premium Cotton Shirt",
    price: 1799,
    description: "A versatile cotton shirt suitable for casual outings, office wear, and everyday styling.",
    category: "men's clothing",
    image: makeImage("Shirt"),
    thumbnail: makeImage("Shirt"),
    stock: 15,
    rating: { rate: 4.3, count: 76 }
  },
  {
    externalId: 4,
    title: "Modern Casual Jacket",
    price: 3499,
    description: "A clean, modern jacket with a comfortable fit for mild weather and everyday layering.",
    category: "men's clothing",
    image: makeImage("Jacket"),
    thumbnail: makeImage("Jacket"),
    stock: 10,
    rating: { rate: 4.5, count: 61 }
  },
  {
    externalId: 5,
    title: "Minimal Gold Bracelet",
    price: 4599,
    description: "A simple bracelet with a polished finish, designed to complement both casual and formal outfits.",
    category: "jewelery",
    image: makeImage("Bracelet"),
    thumbnail: makeImage("Bracelet"),
    stock: 8,
    rating: { rate: 4.6, count: 42 }
  },
  {
    externalId: 6,
    title: "Elegant Silver Ring",
    price: 2899,
    description: "A refined silver-tone ring with a minimal design for everyday and occasion wear.",
    category: "jewelery",
    image: makeImage("Ring"),
    thumbnail: makeImage("Ring"),
    stock: 9,
    rating: { rate: 4.4, count: 53 }
  },
  {
    externalId: 7,
    title: "Portable External SSD",
    price: 5499,
    description: "A compact portable storage drive for fast file transfers, backups, and everyday productivity.",
    category: "electronics",
    image: makeImage("External SSD"),
    thumbnail: makeImage("External SSD"),
    stock: 14,
    rating: { rate: 4.7, count: 137 }
  },
  {
    externalId: 8,
    title: "Compact Wireless Headphones",
    price: 3299,
    description: "Comfortable wireless headphones with a lightweight design for music, calls, and daily use.",
    category: "electronics",
    image: makeImage("Headphones"),
    thumbnail: makeImage("Headphones"),
    stock: 18,
    rating: { rate: 4.5, count: 116 }
  }
];
