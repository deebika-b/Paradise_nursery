// Store cart data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart icon
function updateCartCount() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => (el.textContent = cartCount));
}

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', event => {
    const product = event.target.closest('.product');
    const id = product.dataset.id;
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  });
});

// Display cart on cart page
function displayCart() {
  const cartItems = document.getElementById('cart-items');
  if (!cartItems) return;

  cartItems.innerHTML = '';
  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <img src="images/${item.name.toLowerCase().replace(/ /g, '-')}.jpg" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Price: $${item.price}</p>
      <p>Quantity: ${item.quantity}</p>
      <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
      <button class="decrease" data-id="${item.id}">-</button>
      <button class="increase" data-id="${item.id}">+</button>
      <button class="delete" data-id="${item.id}">Delete</button>
    `;
    cartItems.appendChild(itemDiv);
  });

  document.getElementById('total-items').textContent = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('total-cost').textContent = cart
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);
}

// Update cart item quantity
document.body.addEventListener('click', event => {
  const id = event.target.dataset.id;
  if (event.target.classList.contains('decrease')) {
    const item = cart.find(item => item.id === id);
    if (item.quantity > 1) item.quantity--;
    else cart = cart.filter(item => item.id !== id);
  } else if (event.target.classList.contains('increase')) {
    const item = cart.find(item => item.id === id);
    item.quantity++;
  } else if (event.target.classList.contains('delete')) {
    cart = cart.filter(item => item.id !== id);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
  updateCartCount();
});

// Initialize
updateCartCount();
displayCart();
