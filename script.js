// Guitar Data
const guitars = {
  fender: {
    electric: [
      { id: 'f1', name: "Stratocaster (Player Series)", price: 800, img: "images\stratocaster (Player Series).jpg" },
      { id: 'f2', name: "Stratocaster (American Professional II Series)", price: 1900, img: "" },
      { id: 'f3', name: "Telecaster (Player Series)", price: 800, img: "" },
      { id: 'f4', name: "Telecaster (American Professional II Series)", price: 1900, img: "" }
    ],
    bass: [
      { id: 'f5', name: "Precision Bass (Player Series)", price: 900, img: "" },
      { id: 'f6', name: "Precision Bass (American Professional II Series)", price: 2000, img: "" },
      { id: 'f7', name: "Jazz Bass (Player Series)", price: 900, img: "" },
      { id: 'f8', name: "Jazz Bass (American Professional II Series)", price: 2100, img: "" }
    ]
  },
  gibson: {
    electric: [
      { id: 'g1', name: "Les Paul Standard (50s/60s)", price: 2800, img: "" },
      { id: 'g2', name: "Les Paul Classic", price: 2200, img: "" },
      { id: 'g3', name: "Les Paul Studio", price: 1700, img: "" },
      { id: 'g4', name: "SG Standard", price: 1800, img: "" },
      { id: 'g5', name: "ES-335", price: 3500, img: "" }
    ],
    bass: [
      { id: 'g6', name: "Thunderbird Bass", price: 2500, img: "" },
      { id: 'g7', name: "SG Bass", price: 1800, img: "" }
    ]
  },
  ibanez: {
    electric: [
      { id: 'i1', name: "RG Series (Gio/Standard)", price: 300, img: "" },
      { id: 'i2', name: "RG Series (Premium/Prestige)", price: 1000, img: "" },
      { id: 'i3', name: "S Series (Standard)", price: 600, img: "" },
      { id: 'i4', name: "S Series (Prestige)", price: 1500, img: "" },
      { id: 'i5', name: "AZ Series (AZES/Standard)", price: 400, img: "" },
      { id: 'i6', name: "AZ Series (Premium/Prestige)", price: 1500, img: "" },
      { id: 'i7', name: "JEM / PIA (Steve Vai Signature)", price: 3000, img: "" }
    ],
    bass: [
      { id: 'i8', name: "SR (Soundgear) Series (Gio/Standard)", price: 200, img: "" },
      { id: 'i9', name: "SR (Soundgear) Series (Premium/Prestige)", price: 1000, img: "" },
      { id: 'i10', name: "Talman Bass (TMB Series)", price: 250, img: "" },
      { id: 'i11', name: "BTB Series", price: 800, img: "" }
    ]
  }
};

// Helper function to save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('guitarCart', JSON.stringify(cart));
}

// Helper function to get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('guitarCart')) || [];
}

// Update floating cart count
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

// Create a product card element
function createGuitarCard(guitar, brand) {
  const card = document.createElement('div');
  card.className = 'guitar-card';

  // Image (placeholder for now)
  const img = document.createElement('img');
  img.src = guitar.img || 'https://via.placeholder.com/260x180?text=Guitar+Image';
  img.alt = guitar.name;
  card.appendChild(img);

  // Name
  const name = document.createElement('h3');
  name.textContent = guitar.name;
  card.appendChild(name);

  // Price
  const price = document.createElement('p');
  price.textContent = `$${guitar.price}`;
  card.appendChild(price);

  // Add to cart button
  const btn = document.createElement('button');
  btn.className = 'add-to-cart-btn';
  btn.textContent = 'Add to Cart';
  btn.addEventListener('click', () => {
    addToCart(guitar, brand);
  });
  card.appendChild(btn);

  // Clicking name or image goes to product detail page (example URL)
  [img, name].forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      // Example: fender-product.html?id=f1
      window.location.href = `${brand}-product.html?id=${encodeURIComponent(guitar.id)}`;
    });
  });

  return card;
}

// Add product to cart
function addToCart(guitar, brand) {
  const cart = getCart();
  const existing = cart.find(item => item.id === guitar.id);
  if (existing) {
    if (existing.quantity < 10) existing.quantity += 1;
  } else {
    cart.push({ ...guitar, brand, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
  showConfirmation(`${guitar.name} added to cart!`);
}

// Show confirmation message
function showConfirmation(message) {
  let conf = document.createElement('div');
  conf.textContent = message;
  conf.style.position = 'fixed';
  conf.style.bottom = '20px';
  conf.style.right = '20px';
  conf.style.backgroundColor = '#e94e1b';
  conf.style.color = 'white';
  conf.style.padding = '1rem 1.5rem';
  conf.style.borderRadius = '8px';
  conf.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  conf.style.zIndex = '10000';
  conf.style.opacity = '0';
  conf.style.transition = 'opacity 0.5s ease';

  document.body.appendChild(conf);
  setTimeout(() => (conf.style.opacity = '1'), 10);
  setTimeout(() => {
    conf.style.opacity = '0';
    setTimeout(() => document.body.removeChild(conf), 500);
  }, 2500);
}

// Load guitars into their containers
function loadGuitars() {
  Object.entries(guitars).forEach(([brand, categories]) => {
    Object.entries(categories).forEach(([category, items]) => {
      const container = document.getElementById(`${brand}-${category}`);
      if (!container) return;
      container.innerHTML = ''; // Clear existing
      items.forEach(guitar => {
        container.appendChild(createGuitarCard(guitar, brand));
      });
    });
  });
}

// Switch active brand
function switchBrand(brand) {
  document.querySelectorAll('.brand-wrapper').forEach(wrapper => {
    wrapper.classList.toggle('active', wrapper.id === brand);
  });
  document.querySelectorAll('.brand-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.brand === brand);
  });
  // Reset category buttons for brand to electric default
  const brandWrapper = document.getElementById(brand);
  brandWrapper.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === `${brand}-electric`);
  });
  brandWrapper.querySelectorAll('.guitar-list').forEach(list => {
    list.classList.toggle('active', list.id === `${brand}-electric`);
  });
}

// Switch active category inside brand
function switchCategory(brand, category) {
  const brandWrapper = document.getElementById(brand);
  brandWrapper.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  brandWrapper.querySelectorAll('.guitar-list').forEach(list => {
    list.classList.toggle('active', list.id === category);
  });
}

// Setup event listeners for brand and category buttons
function setupNavigation() {
  document.querySelectorAll('.brand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchBrand(btn.dataset.brand);
    });
  });
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Category format: brand-categorytype
      const [brand] = btn.dataset.category.split('-');
      switchCategory(brand, btn.dataset.category);
    });
  });
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  loadGuitars();
  setupNavigation();
  updateCartCount();
  // Default brand is Fender (already active in HTML)
});

