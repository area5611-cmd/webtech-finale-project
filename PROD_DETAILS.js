document.addEventListener('DOMContentLoaded', function() {
    startProductDetails();
});

// Main function to initialize everything
function startProductDetails() {
    // Get all buttons
    var buyNowButton = document.querySelector('.buy-now');
    var addCartButton = document.querySelector('.add-cart');
    var backButton = document.querySelector('.back-btn');

    // Setup Buy Now button
    if (buyNowButton) {
        buyNowButton.addEventListener('click', handleBuyNow);
        addHoverEffect(buyNowButton);
    }

    // Setup Add to Cart button
    if (addCartButton) {
        addCartButton.addEventListener('click', handleAddToCart);
        addHoverEffect(addCartButton);
    }

    if (backButton) {
        backButton.addEventListener('click', handleBack);
        addHoverEffect(backButton);
    }

    setupImageInteractions();
    setupFeatureInteractions();
    loadProductFromURL();
    addQuantitySelector();
    setupScrollAnimations();
}

// Handle Buy Now button
function handleBuyNow() {
    var productName = getProductName();
    var price = getProductPrice();
    var quantity = getQuantity();

    var confirmed = confirm(
        'Purchase ' + quantity + 'x ' + productName + ' for ' + calculateTotal(price, quantity) + '?'
    );

    if (confirmed) {
        var buyButton = document.querySelector('.buy-now');
        var originalText = buyButton.textContent;

        buyButton.textContent = 'Processing...';
        buyButton.disabled = true;
        buyButton.style.opacity = '0.7';

        setTimeout(function() {
            showNotification('Purchase successful! Thank you for your order.', 'success');
            buyButton.textContent = originalText;
            buyButton.disabled = false;
            buyButton.style.opacity = '1';
        }, 2000);
    }
}

// Add to Cart
function handleAddToCart() {
    var product = {
        name: getProductName(),
        price: getProductPrice(),
        quantity: getQuantity(),
        id: getProductId()
    };

    var cart = getCart();
    var existingIndex = findProductInCart(cart, product.id);

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }

    saveCart(cart);

    var addButton = document.querySelector('.add-cart');
    var originalText = addButton.textContent;

    addButton.textContent = '✓ Added!';
    addButton.style.backgroundColor = '#4CAF50';
    addButton.style.color = 'white';

    showNotification(product.name + ' added to cart!', 'success');

    setTimeout(function() {
        addButton.textContent = originalText;
        addButton.style.backgroundColor = '';
        addButton.style.color = '';
    }, 2000);

    updateCartCount();
}

// Back button
function handleBack(event) {
    if (event) event.preventDefault();

    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'products.html';
    }
}

// Image interactions
function setupImageInteractions() {
    var productImage = document.querySelector('.product-image');

    if (productImage) {
        productImage.addEventListener('click', function() {
            toggleImageZoom(productImage);
        });

        productImage.addEventListener('mouseenter', function() {
            productImage.style.cursor = 'zoom-in';
            productImage.style.transition = 'transform 0.3s ease';
            productImage.style.transform = 'scale(1.05)';
        });

        productImage.addEventListener('mouseleave', function() {
            if (!productImage.classList.contains('zoomed')) {
                productImage.style.transform = 'scale(1)';
            }
        });

        productImage.addEventListener('dblclick', function() {
            resetImageZoom(productImage);
        });
    }
}

function toggleImageZoom(image) {
    if (image.classList.contains('zoomed')) {
        resetImageZoom(image);
    } else {
        image.style.transform = 'scale(2)';
        image.style.cursor = 'zoom-out';
        image.classList.add('zoomed');
        image.style.zIndex = '1000';
        image.style.position = 'relative';
    }
}

function resetImageZoom(image) {
    image.style.transform = 'scale(1)';
    image.style.cursor = 'zoom-in';
    image.classList.remove('zoomed');
    image.style.zIndex = '';
    image.style.position = '';
}

// Feature interactions
function setupFeatureInteractions() {
    var features = document.querySelectorAll('.features li');

    features.forEach(function(feature) {
        feature.style.cursor = 'pointer';
        feature.style.transition = 'all 0.3s ease';

        feature.addEventListener('click', function() {
            toggleFeatureHighlight(feature);
        });

        feature.addEventListener('mouseenter', function() {
            feature.style.transform = 'translateX(10px)';
            feature.style.fontWeight = '600';
        });

        feature.addEventListener('mouseleave', function() {
            if (!feature.classList.contains('highlighted')) {
                feature.style.transform = 'translateX(0)';
                feature.style.fontWeight = '';
            }
        });
    });
}

function toggleFeatureHighlight(feature) {
    if (feature.classList.contains('highlighted')) {
        feature.classList.remove('highlighted');
        feature.style.backgroundColor = '';
        feature.style.fontWeight = '';
    } else {
        feature.classList.add('highlighted');
        feature.style.backgroundColor = 'rgba(238, 77, 45, 0.1)';
        feature.style.fontWeight = '600';
    }
}

// Quantity selector (fixed)
function addQuantitySelector() {
    var priceSection = document.querySelector('.price-section');

    if (priceSection && !document.querySelector('.quantity-selector')) {
        var quantityDiv = document.createElement('div');
        quantityDiv.className = 'quantity-selector';
        quantityDiv.style.cssText = 'margin: 15px 0; display: flex; align-items: center; gap: 10px;';

        quantityDiv.innerHTML = `
            <label style="font-weight: 600;">Quantity:</label>
            <button class="qty-minus" style="padding: 5px 15px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px;">-</button>
            <input type="number" class="qty-input" value="1" min="1" max="10" style="width: 60px; padding: 5px; text-align: center; border: 1px solid #ddd; border-radius: 4px;">
            <button class="qty-plus" style="padding: 5px 15px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px;">+</button>
        `;

        priceSection.parentNode.insertBefore(quantityDiv, priceSection.nextSibling);

        var minusBtn = quantityDiv.querySelector('.qty-minus');
        var plusBtn = quantityDiv.querySelector('.qty-plus');
        var qtyInput = quantityDiv.querySelector('.qty-input');

        minusBtn.addEventListener('click', function() {
            var qty = parseInt(qtyInput.value);
            if (isNaN(qty) || qty <= 1) qty = 1;
            else qty--;
            qtyInput.value = qty;
            updatePriceDisplay(qty);
        });

        plusBtn.addEventListener('click', function() {
            var qty = parseInt(qtyInput.value);
            if (isNaN(qty)) qty = 1;
            if (qty < parseInt(qtyInput.max)) qty++;
            else qty = parseInt(qtyInput.max);
            qtyInput.value = qty;
            updatePriceDisplay(qty);
        });

        qtyInput.addEventListener('change', function() {
            var qty = parseInt(qtyInput.value);
            if (isNaN(qty) || qty < 1) qty = 1;
            if (qty > parseInt(qtyInput.max)) qty = parseInt(qtyInput.max);
            qtyInput.value = qty;
            updatePriceDisplay(qty);
        });
    }
}

// Update price display
function updatePriceDisplay(quantity) {
    var priceElement = document.querySelector('.price');
    if (priceElement) {
        var basePrice = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) || 0;
        var totalPrice = basePrice * quantity;
        priceElement.textContent = '$' + totalPrice.toFixed(2);

        priceElement.style.transform = 'scale(1.1)';
        priceElement.style.transition = 'transform 0.2s ease';
        setTimeout(function() {
            priceElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// Load product
function loadProductFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('id');

    if (productId) {
        fetch('commerce1.json')
            .then(response => response.json())
            .then(data => {
                var product = data.gym_equipment.find(p => p.id === parseInt(productId));
                if (product) updateProductDisplay(product);
            })
            .catch(error => console.error('Error loading product:', error));
    }
}

// Update product display
function updateProductDisplay(product) {
    var productName = document.querySelector('.product-name');
    var description = document.querySelector('.description');
    var price = document.querySelector('.price');
    var productImage = document.querySelector('.product-image');
    var features = document.querySelector('.features');

    if (productName) productName.textContent = product.name;
    if (description) description.textContent = product.description;
    if (price) price.textContent = '$' + product.price.toFixed(2);
    if (productImage && product.image) productImage.src = product.image;

    if (features && product.features) {
        features.innerHTML = '';
        product.features.forEach(f => {
            var li = document.createElement('li');
            li.textContent = f;
            features.appendChild(li);
        });
        setupFeatureInteractions();
    }
}

// Cart functions
function getCart() {
    var cartJson = localStorage.getItem('cart');
    return cartJson ? JSON.parse(cartJson) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function findProductInCart(cart, productId) {
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) return i;
    }
    return -1;
}

function updateCartCount() {
    var cart = getCart();
    var totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    console.log('Cart has ' + totalItems + ' items');
}

// Helpers
function getProductName() {
    var el = document.querySelector('.product-name');
    return el ? el.textContent : 'Product';
}

function getProductPrice() {
    var el = document.querySelector('.price');
    if (el) return parseFloat(el.textContent.replace(/[^0-9.]/g, '')) || 0;
    return 0;
}

function getQuantity() {
    var input = document.querySelector('.qty-input');
    return input ? parseInt(input.value) || 1 : 1;
}

function getProductId() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 'unknown';
}

function calculateTotal(price, quantity) {
    return '$' + (price * quantity).toFixed(2);
}

function addHoverEffect(button) {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Scroll animations
function setupScrollAnimations() {
    var productDetails = document.querySelector('.product-details');
    if (productDetails) {
        productDetails.style.opacity = '0';
        productDetails.style.transform = 'translateY(20px)';
        productDetails.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        setTimeout(function() {
            productDetails.style.opacity = '1';
            productDetails.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Notification
function showNotification(message, type = 'info') {
    var notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    let bg = '#111', color = 'white';
    if (type === 'success') bg = '#4CAF50';
    if (type === 'error') bg = '#f44336';

    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: ${bg}; color: ${color};
        padding: 15px 20px; border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000; font-family: "Poppins", sans-serif;
        font-weight: 600; border: 2px solid #555;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
