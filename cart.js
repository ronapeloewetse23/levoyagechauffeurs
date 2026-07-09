// ==========================================
// 1. GLOBAL MEMORY CONFIGURATION
// ==========================================
// Initialize the cart array from localStorage, or set it empty if it's their first time
let cart = JSON.parse(localStorage.getItem('levoyage_cart')) || [];

// Run setup when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
    setupAddToCartButtons();
    
    // Only run the cart rendering if we are actually on the booking page
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
});

// ==========================================
// 2. FLEET ADD-TO-CART ENGINE (cars.html)
// ==========================================
function setupAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevents the browser from navigating away before saving

            const btn = e.target;
            const carItem = {
                id: btn.getAttribute('data-id'),
                name: btn.getAttribute('data-name'),
                price: parseFloat(btn.getAttribute('data-price')),
                image: btn.getAttribute('data-image'),
                days: 1 // default to 1 day rental
            };

            // Failsafe to ensure data tags exist in HTML
            if (!carItem.id || isNaN(carItem.price)) {
                console.error("Missing data attributes on button. Check your cars.html!");
                return;
            }
            
            addToCart(carItem);
        });
    });
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.days += 1; // If already clicked, add an extra rental day
    } else {
        cart.push(item);
    }
    
    saveCart();
    
    // Instantly redirect to the booking review page
    window.location.href = 'booking.html';
}

function saveCart() {
    localStorage.setItem('levoyage_cart', JSON.stringify(cart));
}

// ==========================================
// 3. BOOKING CART RENDER ENGINE (booking.html)
// ==========================================
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const summaryBox = document.getElementById('cart-summary-box'); 
    // Fallback for different ID namings
    const totalElement = document.getElementById('cart-total-price') || document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-message" style="text-align:center; padding: 50px 0; color:#b5baaf;">
                <p>Your vehicle allocation list is currently empty.</p>
                <a href="cars.html" style="color:#efbf04; text-decoration:none; border-bottom:1px solid #efbf04;">Return to Fleet</a>
            </div>`;
        if (summaryBox) summaryBox.style.display = 'none';
        if (totalElement) totalElement.innerText = "P0.00";
        return;
    }
    
    if (summaryBox) summaryBox.style.display = 'block';
    container.innerHTML = '';
    let overallTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.days;
        overallTotal += itemTotal;
        
        container.innerHTML += `
            <div class="cart-item-row" style="display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 20px; margin-bottom: 20px; border-radius: 6px;">
                <img src="${item.image}" alt="${item.name}" width="100" height="65" style="border-radius:4px; object-fit:cover;">
                <div class="cart-details" style="flex: 2; padding-left: 20px;">
                    <h4 style="margin:0 0 5px 0; color:#fff; text-transform:uppercase;">${item.name}</h4>
                    <p style="margin:0; color:#b5baaf; font-size:13px;">P${item.price.toLocaleString()} / day</p>
                </div>
                <div class="cart-days-control" style="display:flex; align-items:center; gap:15px;">
                    <button onclick="changeDays('${item.id}', ${item.days - 1})" style="background:#efbf04; border:none; border-radius:4px; width:28px; height:28px; font-weight:bold; cursor:pointer;">-</button>
                    <span style="color:#fff;">${item.days} Day(s)</span>
                    <button onclick="changeDays('${item.id}', ${item.days + 1})" style="background:#efbf04; border:none; border-radius:4px; width:28px; height:28px; font-weight:bold; cursor:pointer;">+</button>
                </div>
                <div class="cart-item-total" style="flex: 1; text-align:right; color:#efbf04; font-weight:bold; padding-right:20px;">
                    P${itemTotal.toLocaleString()}
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:#ff4a4a; font-size:18px; cursor:pointer;">✕</button>
            </div>
        `;
    });
    
    if (totalElement) {
        totalElement.innerText = `P${overallTotal.toLocaleString()}`;
    }
}

// ==========================================
// 4. CART CONTROLS
// ==========================================
window.changeDays = function(id, newDays) {
    if (newDays < 1) return; // Must rent for at least 1 day
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
        item.days = newDays;
        saveCart();
        renderCartPage(); // Redraw layout with new math
    }
}

window.removeFromCart = function(id) {
    cart = cart.filter(cartItem => cartItem.id !== id);
    saveCart();
    renderCartPage(); // Redraw layout without the item
}

// Redirects to the checkout sheet
window.goToCheckout = function() {
    window.location.href = 'checkout.html';
}

// ==========================================
// 5. MOBILE MENU TOGGLE
// ==========================================
window.toggleMenu = function() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}
