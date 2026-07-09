// ==========================================
// 1. GLOBAL MEMORY CONFIGURATION
// ==========================================
let cart = JSON.parse(localStorage.getItem('levoyage_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    setupAddToCartButtons();
    
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
            e.preventDefault(); 

            const btn = e.target;
            const carItem = {
                id: btn.getAttribute('data-id'),
                name: btn.getAttribute('data-name'),
                price: parseFloat(btn.getAttribute('data-price')),
                image: btn.getAttribute('data-image'),
                quantity: 1, // Default to 1 vehicle
                days: 1      // Default to 1 rental day
            };

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
        // If they click it again on the cars page, we bump the car quantity
        existingItem.quantity += 1; 
    } else {
        cart.push(item);
    }
    
    saveCart();
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
        // Core Math Formula: Price * Quantity of Cars * Number of Days
        const itemTotal = item.price * item.quantity * item.days;
        overallTotal += itemTotal;
        
        container.innerHTML += `
            <div class="cart-item-row" style="display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 25px; margin-bottom: 20px; border-radius: 6px; flex-wrap: wrap; gap: 15px;">
                
                <!-- Car Info Block -->
                <div style="display: flex; align-items: center; gap: 20px; flex: 1.5; min-width: 200px;">
                    <img src="${item.image}" alt="${item.name}" width="100" height="65" style="border-radius:4px; object-fit:cover;">
                    <div>
                        <h4 style="margin:0 0 5px 0; color:#fff; text-transform:uppercase; font-size:16px;">${item.name}</h4>
                        <p style="margin:0; color:#b5baaf; font-size:13px;">P${item.price.toLocaleString()} / day per car</p>
                    </div>
                </div>

                <!-- Control 1: Quantity of Cars -->
                <div style="flex: 1; min-width: 130px; display: flex; flex-direction: column; align-items: center; gap: 5px;">
                    <span style="font-size: 11px; color: #b5baaf; text-transform: uppercase;">Vehicles</span>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button onclick="changeQuantity('${item.id}', ${item.quantity - 1})" style="background:#efbf04; border:none; border-radius:4px; width:26px; height:26px; font-weight:bold; cursor:pointer;">-</button>
                        <span style="color:#fff; font-weight: 600; min-width: 30px; text-align:center;">${item.quantity}</span>
                        <button onclick="changeQuantity('${item.id}', ${item.quantity + 1})" style="background:#efbf04; border:none; border-radius:4px; width:26px; height:26px; font-weight:bold; cursor:pointer;">+</button>
                    </div>
                </div>

                <!-- Control 2: Quantity of Days -->
                <div style="flex: 1; min-width: 130px; display: flex; flex-direction: column; align-items: center; gap: 5px;">
                    <span style="font-size: 11px; color: #b5baaf; text-transform: uppercase;">Duration</span>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button onclick="changeDays('${item.id}', ${item.days - 1})" style="background:#efbf04; border:none; border-radius:4px; width:26px; height:26px; font-weight:bold; cursor:pointer;">-</button>
                        <span style="color:#fff; font-weight: 600; min-width: 50px; text-align:center;">${item.days} Day${item.days > 1 ? 's' : ''}</span>
                        <button onclick="changeDays('${item.id}', ${item.days + 1})" style="background:#efbf04; border:none; border-radius:4px; width:26px; height:26px; font-weight:bold; cursor:pointer;">+</button>
                    </div>
                </div>

                <!-- Line Item Total -->
                <div style="flex: 1; text-align:right; color:#efbf04; font-weight:bold; font-size:16px; min-width: 100px;">
                    P${itemTotal.toLocaleString()}
                </div>

                <!-- Delete Action -->
                <button onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:#ff4a4a; font-size:18px; cursor:pointer; padding: 0 10px;">✕</button>
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
window.changeQuantity = function(id, newQty) {
    if (newQty < 1) return; 
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
        item.quantity = newQty;
        saveCart();
        renderCartPage(); 
    }
}

window.changeDays = function(id, newDays) {
    if (newDays < 1) return; 
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
        item.days = newDays;
        saveCart();
        renderCartPage(); 
    }
}

window.removeFromCart = function(id) {
    cart = cart.filter(cartItem => cartItem.id !== id);
    saveCart();
    renderCartPage(); 
}

window.goToCheckout = function() {
    window.location.href = 'checkout.html';
}

window.toggleMenu = function() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}
