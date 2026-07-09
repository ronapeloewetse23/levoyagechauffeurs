// Initialize the cart array from localStorage, or set it empty if it's their first time
let cart = JSON.parse(localStorage.getItem('levoyage_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    setupAddToCartButtons();
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
});

// 1. Attach event listeners to all booking buttons
function setupAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.target;
            const carItem = {
                id: btn.getAttribute('data-id'),
                name: btn.getAttribute('data-name'),
                price: parseFloat(btn.getAttribute('data-price')),
                image: btn.getAttribute('data-image'),
                days: 1 // default to 1 day rental
            };
            
            addToCart(carItem);
        });
    });
}

// 2. Add item logic or increase days if it's already there
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.days += 1; // If already clicked, add an extra rental day
    } else {
        cart.push(item);
    }
    
    saveCart();
    alert(`${item.name} added to your booking path!`);
}

// 3. Save cart updates to browser memory
function saveCart() {
    localStorage.setItem('levoyage_cart', JSON.stringify(cart));
}

// 4. Draw out the items cleanly on your Booking/Cart page
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-message">Your booking choice is empty.</p>`;
        totalElement.innerText = "P0.00";
        return;
    }
    
    container.innerHTML = '';
    let overallTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.days;
        overallTotal += itemTotal;
        
        container.innerHTML += `
            <div class="cart-row">
                <img src="${item.image}" alt="${item.name}" width="80">
                <div class="cart-details">
                    <h4>${item.name}</h4>
                    <p>P${item.price.toLocaleString()} / day</p>
                </div>
                <div class="cart-days-control">
                    <button onclick="changeDays('${item.id}', ${item.days - 1})">-</button>
                    <span>${item.days} Days</span>
                    <button onclick="changeDays('${item.id}', ${item.days + 1})">+</button>
                </div>
                <div class="cart-item-total">P${itemTotal.toLocaleString()}</div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">✕</button>
            </div>
        `;
    });
    
    totalElement.innerText = `P${overallTotal.toLocaleString()}`;
}

// 5. Change amount of rental days straight from the layout
window.changeDays = function(id, newDays) {
    if (newDays < 1) return; // Must rent for at least 1 day
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
        item.days = newDays;
        saveCart();
        renderCartPage();
    }
}

// 6. Delete item entirely
window.removeFromCart = function(id) {
    cart = cart.filter(cartItem => cartItem.id !== id);
    saveCart();
    renderCartPage();
}
