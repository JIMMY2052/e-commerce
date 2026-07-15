// public/app.js

// 1. Wait for the HTML to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

// 2. Fetch data from our Node/Express API
async function fetchProducts() {
    try {
        // Since the frontend and backend run on the same server, we use a relative URL
        const response = await fetch('/api/products');
        const products = await response.json();

        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('product-grid').innerHTML = '<p>Error loading products.</p>';
    }
}

// 3. Inject the data into the HTML
function displayProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; // Clear the "Loading..." text

    products.forEach(product => {
        // Create a card for each product
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="price">$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        grid.appendChild(card);
    });
}

function addToCart(productId) {
    console.log(`Product ${productId} added to cart!`);
    // We will build the actual cart logic next
}

// public/app.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json(); // Save to global state

        displayProducts(allProducts);
        updateCartUI(); // Set initial cart text on page load
    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('product-grid').innerHTML = 'Error loading products.';
    }
}

function addToCart(productId) {
    // Find the full product object using the ID
    const product = allProducts.find(p => p.id === productId);

    if (product) {
        cart.push(product);

        // Save as a string in the browser's local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartUI();
    }
}

function updateCartUI() {
    const cartSummary = document.querySelector('.cart-summary');

    // Add up all the prices in the cart
    const total = cart.reduce((sum, item) => {
        return sum + parseFloat(item.price);
    }, 0);

    // Update the HTML
    cartSummary.textContent = `Cart: ${cart.length} items ($${total.toFixed(2)})`;
}