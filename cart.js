document.addEventListener('DOMContentLoaded', function() {
    startCartPage();
});

// Main function to initialize everything
function startCartPage() {
    loadCartItems();
    setupLogoClick();
    setupCartIcon();
    setupCheckoutButton();
    setupPromoCode();
}

// Load cart items from localStorage
function loadCartItems() {
    var cart = getCart();
    displayCartItems(cart);
    updateOrderSummary(cart);
}

// Get cart from localStorage
function getCart() {
    var cartJson = localStorage.getItem('cart');
    return cartJson ? JSON.parse(cartJson) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// STEP 6: Display cart items
function displayCartItems(cart) {
    var cartItemsList = document.getElementById('cartItems');
    var emptyCart = document.getElementById('emptyCart');
    
    // Clear existing items
    cartItemsList.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        emptyCart.classList.add('show');
        cartItemsList.style.display = 'none';
        return;
    }
    
    // Hide empty cart message
    emptyCart.classList.remove('show');
    cartItemsList.style.display = 'block';
    
    // Update item count
    var totalItems = 0;
    for (var i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity || 1;
    }
    document.getElementById('itemCount').textContent = totalItems;
    
    // Display each cart item
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        createCartItem(item, i);
    }
}

// Create cart item element
function createCartItem(item, index) {
    var cartItemsList = document.getElementById('cartItems');
    
    var itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.setAttribute('data-index', index);
    
    var price = parseFloat(item.price) || 0;
    var quantity = item.quantity || 1;
    var itemTotal = price * quantity;
    
    itemDiv.innerHTML = `
        <div class="item-image">🏋️</div>
        <div class="item-details">
            <div class="item-name">${item.name || 'Product'}</div>
            <div class="item-price">$${price.toFixed(2)} each</div>
            <div class="item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn minus" onclick="decreaseQuantity(${index})">-</button>
                    <input type="number" class="quantity-input" value="${quantity}" min="1" max="10" 
                           onchange="updateQuantity(${index}, this.value)" 
                           onkeyup="updateQuantity(${index}, this.value)">
                    <button class="quantity-btn plus" onclick="increaseQuantity(${index})">+</button>
                </div>
                <button class="remove-button" onclick="removeItem(${index})">Remove</button>
            </div>
        </div>
        <div class="item-total">$${itemTotal.toFixed(2)}</div>
    `;
    
    cartItemsList.appendChild(itemDiv);
}

// Increase quantity
function increaseQuantity(index) {
    var cart = getCart();
    if (cart[index]) {
        var currentQty = cart[index].quantity || 1;
        if (currentQty < 10) {
            cart[index].quantity = currentQty + 1;
            saveCart(cart);
            loadCartItems();
            showNotification('Quantity updated', 'success');
        } else {
            showNotification('Maximum quantity is 10', 'info');
        }
    }
}

//  Decrease quantity
function decreaseQuantity(index) {
    var cart = getCart();
    if (cart[index]) {
        var currentQty = cart[index].quantity || 1;
        if (currentQty > 1) {
            cart[index].quantity = currentQty - 1;
            saveCart(cart);
            loadCartItems();
            showNotification('Quantity updated', 'success');
        } else {
            removeItem(index);
        }
    }
}

// Update quantity from input
function updateQuantity(index, newQuantity) {
    var cart = getCart();
    if (cart[index]) {
        var qty = parseInt(newQuantity) || 1;
        if (qty < 1) qty = 1;
        if (qty > 10) qty = 10;
        
        cart[index].quantity = qty;
        saveCart(cart);
        loadCartItems();
    }
}

// Remove item from cart
function removeItem(index) {
    var cart = getCart();
    var itemName = cart[index].name || 'Item';
    
    if (confirm('Remove ' + itemName + ' from cart?')) {
        cart.splice(index, 1);
        saveCart(cart);
        loadCartItems();
        showNotification(itemName + ' removed from cart', 'success');
    }
}

// Update order summary
function updateOrderSummary(cart) {
    var subtotal = 0;
    
    // Calculate subtotal
    for (var i = 0; i < cart.length; i++) {
        var price = parseFloat(cart[i].price) || 0;
        var quantity = cart[i].quantity || 1;
        subtotal += price * quantity;
    }
    
    // Calculate shipping (free over $500, otherwise $25)
    var shipping = subtotal >= 500 ? 0 : 25;
    
    // Calculate tax (8% of subtotal)
    var tax = subtotal * 0.08;
    
    // Calculate total
    var total = subtotal + shipping + tax;
    
    // Update display
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
    
    // Enable/disable checkout button
    var checkoutButton = document.getElementById('checkoutButton');
    if (cart.length > 0) {
        checkoutButton.disabled = false;
    } else {
        checkoutButton.disabled = true;
    }
}

// Checkout button
function setupCheckoutButton() {
    var checkoutButton = document.getElementById('checkoutButton');
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            handleCheckout();
        });
    }
}

// Handle checkout

function handleCheckout() {
    var cart = getCart();
    
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'info');
        return;
    }
    
    var checkoutButton = document.getElementById('checkoutButton');
    var originalText = checkoutButton.textContent;
    
    // Show loading state
    checkoutButton.textContent = 'Processing...';
    checkoutButton.disabled = true;
    
    // Simulate checkout process
    setTimeout(function() {
        showNotification('Order placed successfully! Thank you for your purchase.', 'success');
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Reload page after delay
        setTimeout(function() {
            window.location.href = 'products.html';
        }, 2000);
    }, 2000);
}

//  Setup promo code
function setupPromoCode() {
    var applyPromoButton = document.getElementById('applyPromo');
    var promoInput = document.getElementById('promoCode');
    
    if (applyPromoButton) {
        applyPromoButton.addEventListener('click', function() {
            applyPromoCode();
        });
    }
    
    if (promoInput) {
        promoInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                applyPromoCode();
            }
        });
    }
}

//  Apply promo code
function applyPromoCode() {
    var promoInput = document.getElementById('promoCode');
    var promoMessage = document.getElementById('promoMessage');
    var code = promoInput.value.trim().toUpperCase();
    
    // Valid promo codes
    var validCodes = {
        'WELCOME10': 0.10,
        'SAVE20': 0.20,
        'FITNESS25': 0.25
    };
    
    if (code in validCodes) {
        var discount = validCodes[code];
        promoMessage.textContent = 'Promo code applied! ' + (discount * 100) + '% discount.';
        promoMessage.className = 'promo-message success';
        promoInput.style.borderColor = '#111';
        showNotification('Promo code applied successfully!', 'success');
    } else {
        promoMessage.textContent = 'Invalid promo code. Try: WELCOME10, SAVE20, or FITNESS25';
        promoMessage.className = 'promo-message';
        promoInput.style.borderColor = '#111';
    }
}

// Setup logo click

function setupLogoClick() {
    var logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'LANDING.html';
        });
        logo.style.cursor = 'pointer';
    }
}

// Setup cart icon
function setupCartIcon() {
    var cartIcon = document.querySelector('.cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            // Already on cart page, do nothing or refresh
            loadCartItems();
        });
        
        cartIcon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        cartIcon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// Show notifications
// function showNotification(message, type) {
//     type = type || 'info';
    
//     var notification = document.createElement('div');
//     notification.className = 'notification';
//     notification.textContent = message;
    
//     var bgColor = '#111';
//     var textColor = 'white';
//     if (type === 'success') {
//         bgColor = '#555';
//         textColor = 'white';
//     }
    
//     notification.style.cssText = 'position: fixed; top: 20px; right: 20px; ' +
//                                  'background: ' + bgColor + '; color: ' + textColor + '; ' +
//                                  'padding: 15px 20px; border-radius: 10px; ' +
//                                  'box-shadow: 0 4px 12px rgba(0,0,0,0.3); ' +
//                                  'z-index: 10000; font-family: "Poppins", sans-serif; ' +
//                                  'font-weight: 600; border: 2px solid #555; ' +
//                                  'animation: slideIn 0.3s ease;';
    
//     document.body.appendChild(notification);
    
//     setTimeout(function() {
//         notification.style.animation = 'slideOut 0.3s ease';
//         setTimeout(function() {
//             notification.remove();
//         }, 300);
//     }, 3000);
// }

