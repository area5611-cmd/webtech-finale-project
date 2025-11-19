var products = []; 

var JSON_FILE = "commerce1.json";

// Get HTML elements
var searchInput = document.getElementById("searchInput");
var sortButtons = document.querySelectorAll(".filter");
var priceDropdown = document.querySelector(".price-dropdown");
var priceOptions = document.querySelectorAll(".price-option");
var productContainer = document.getElementById("productContainer");
var cartIcon = document.querySelector(".cart");
var logo = document.querySelector(".logo");


document.addEventListener("DOMContentLoaded", function() {
  
    var jsonFiles = [
        JSON_FILE,                                  
        "commerce1.json"          
    ];
    
    
    function tryLoadJSON(index) {
        // If all attempts failed
        if (index >= jsonFiles.length) {
            console.error("Could not load JSON file: " + JSON_FILE);
            showError("Failed to load products. Please check if 'commerce - Copy.json' exists in the same folder.");
            return;
        }
        
        console.log("Load: " + jsonFiles[index]);
        
        fetch(jsonFiles[index])
           
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Failed to load JSON: HTTP " + response.status);
                }
                return response.json();
            })

            
            .then(function(data) {             
                if (!data || !data.gym_equipment || !Array.isArray(data.gym_equipment)) {
                    throw new Error("Invalid JSON structure. Expected 'gym_equipment' array.");
                }
                
                // Store products in our variable
                products = data.gym_equipment;
                console.log("Successful! Loaded " + products.length + " products from " + JSON_FILE);
                
                // Display all products on the page
                showProducts(products);
                
                // Setup all interactive features
                setupCartIcon();
                setupLogoClick();
                setupProductCardInteractions();
                setupSearchEnhancements();
                setupFilterAnimations();
                updateCartBadge();
            })
            .catch(function(err) {
                // If this attempt failed, try the next filename format
                console.error("FETCH error (attempt " + (index + 1) + "):", err.message);
                tryLoadJSON(index + 1);
            });
    }
    
    tryLoadJSON(0);
});


//  Display products 

function showProducts(list) {
    productContainer.innerHTML = "";

    if (list.length === 0) {
        productContainer.innerHTML = "<p style='text-align: center; padding: 40px; color: #999;'>No products found.</p>";
        return;
    }

    // Add loading animation
    productContainer.style.opacity = '0.5';
    
    setTimeout(function() {
        for (var i = 0; i < list.length; i++) {
            var product = list[i];
            createProductCard(product, i);
        }
        productContainer.style.opacity = '1';
        productContainer.style.transition = 'opacity 0.3s ease';
    }, 100);
}

// Create product card with interactions
function createProductCard(product, index) {
    var card = document.createElement("div");
    card.className = "product-card";
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add click to view details
    card.addEventListener('click', function() {
        window.location.href = 'PROD_DETAILS.html?id=' + product.id;
    });
    
    // Add hover effects
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
        this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
    });
    
    // Add double-click to add to cart
    card.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        addToCartQuick(product);
    });
    
    // Add product image if available
    var imageHtml = '';
    if (product.image) {
        imageHtml = '<div class="product-image-wrapper" style="width: 100%; height: 200px; overflow: hidden; border-radius: 10px 10px 0 0; background: #f5f5f5; margin: -20px -20px 15px -20px;"><img src="' + product.image + '" alt="' + product.name + '" style="width: 100%; height: 100%; object-fit: cover;"></div>';
    }
    
    card.innerHTML = imageHtml + `
      <h3>${product.name}</h3>
      <p><strong>Brand:</strong> ${product.brand}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
      <p>${product.description}</p>
      <ul>
        ${product.features.map(function(f) { return '<li>' + f + '</li>'; }).join("")}
      </ul>
      <p><strong>${product.in_stock ? "In Stock" : "Out of Stock"}</strong></p>
      <button class="quick-add-btn" style="margin-top: 15px; padding: 12px 24px; background: transparent; color: #111; border: 2px solid #111; border-radius: 10px; cursor: pointer; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 14px; width: 100%; transition: all 0.3s ease;">Quick Add</button>
    `;

    productContainer.appendChild(card);
    
    // Animate card appearance
    setTimeout(function() {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, index * 50);
    
    // Setup quick add button
    var quickAddBtn = card.querySelector('.quick-add-btn');
    if (quickAddBtn) {
        quickAddBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCartQuick(product);
        });
    }
}


// Enhanced search functionality
if (searchInput) {
    searchInput.addEventListener("input", function(e) {
        var term = e.target.value.toLowerCase().trim();
        
        // Show search icon animation
        if (term.length > 0) {
            searchInput.style.borderColor = '#ee4d2d';
        } else {
            searchInput.style.borderColor = '';
        }
        
        // Debounce search
        clearTimeout(searchInput.searchTimeout);
        searchInput.searchTimeout = setTimeout(function() {
            var filtered = products.filter(function(p) {
                return p.name.toLowerCase().includes(term) ||
                       p.brand.toLowerCase().includes(term) ||
                       p.category.toLowerCase().includes(term) ||
                       (p.description && p.description.toLowerCase().includes(term));
            });
            
            showProducts(filtered);
            showSearchResults(filtered.length, term);
        }, 300);
    });
    
    // Add search icon click
    searchInput.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 0 3px rgba(238, 77, 45, 0.1)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.boxShadow = '';
    });
}



// Sort buttons 
for (var i = 0; i < sortButtons.length; i++) {
    sortButtons[i].addEventListener("click", function() {
        // Remove active from all
        for (var j = 0; j < sortButtons.length; j++) {
            sortButtons[j].classList.remove("active");
        }
        
        // Add active to clicked
        this.classList.add("active");
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(function() {
            this.style.transform = 'scale(1)';
        }.bind(this), 150);

        var sortType = this.getAttribute("data-sort");
        var sorted = products.slice();

        if (sortType === "latest") {
            sorted.sort(function(a, b) { return b.id - a.id; });
        } else if (sortType === "top") {
            sorted.sort(function(a, b) {
                return (b.sold || 0) - (a.sold || 0);
            });
        }

        showProducts(sorted);
        showNotification('Products sorted by ' + sortType, 'info');
    });
}



// Price dropdown 

if (priceDropdown) {
    var priceButton = priceDropdown.querySelector(".price-btn");
    
    if (priceButton) {
        priceButton.addEventListener("click", function(e) {
            e.stopPropagation();
            priceDropdown.classList.toggle("show");
        });
    }
}

for (var i = 0; i < priceOptions.length; i++) {
    priceOptions[i].addEventListener("click", function() {
        var sortType = this.getAttribute("data-sort");
        var sorted = products.slice();

        if (sortType === "priceLow") {
            sorted.sort(function(a, b) { return a.price - b.price; });
        } else if (sortType === "priceHigh") {
            sorted.sort(function(a, b) { return b.price - a.price; });
        }

        showProducts(sorted);
        priceDropdown.classList.remove("show");
        showNotification('Products sorted by price', 'info');
    });
}

// Close dropdown if clicked outside
document.addEventListener("click", function(e) {
    if (priceDropdown && !priceDropdown.contains(e.target)) {
        priceDropdown.classList.remove("show");
    }
});

//  Additional interactive functions

// Setup cart icon - Navigate to cart page
function setupCartIcon() {
    if (cartIcon) {
        cartIcon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        cartIcon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        cartIcon.addEventListener('click', function(event) {       
        });
    }
}

// Setup logo click - Navigate to landing page
function setupLogoClick() {
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'LANDING.html';
        });
        logo.style.cursor = 'pointer';
    }
}

// Setup filter animations
function setupFilterAnimations() {
    var filters = document.querySelectorAll('.filter');
    for (var i = 0; i < filters.length; i++) {
        filters[i].addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        filters[i].addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
}

// Quick add to cart
function addToCartQuick(product) {
    var cart = getCart();
    var existingIndex = findProductInCart(cart, product.id);
    
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartBadge();
    showNotification(product.name + ' added to cart!', 'success');
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
        if (cart[i].id === productId) {
            return i;
        }
    }
    return -1;
}

function updateCartBadge() {
    var cart = getCart();
    var totalItems = 0;
    for (var i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity || 1;
    }
    
    if (cartIcon && totalItems > 0) {
        // Remove existing badge
        var existingBadge = cartIcon.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        var badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = totalItems;
        badge.style.cssText = 'position: absolute; top: -8px; right: -8px; ' +
                              'background: #111; color: white; ' +
                              'border-radius: 50%; width: 22px; height: 22px; ' +
                              'display: flex; align-items: center; justify-content: center; ' +
                              'font-size: 12px; font-weight: bold; ' +
                              'font-family: "Poppins", sans-serif; ' +
                              'border: 2px solid #555; box-shadow: 0 2px 6px rgba(0,0,0,0.3);';
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(badge);
    }
}


function showSearchResults(count, term) {
    if (term && count === 0) {
        showNotification('No products found for "' + term + '"', 'info');
    }
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    type = type || 'info';
    
    var notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    var bgColor = '#111';
    var textColor = 'white';
    if (type === 'success') {
        bgColor = '#555';
        textColor = 'white';
    }
    if (type === 'error') {
        bgColor = '#111';
        textColor = 'white';
    }
    
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; ' +
                                 'background: ' + bgColor + '; color: ' + textColor + '; ' +
                                 'padding: 15px 20px; border-radius: 10px; ' +
                                 'box-shadow: 0 4px 12px rgba(0,0,0,0.3); ' +
                                 'z-index: 10000; font-family: "Poppins", sans-serif; ' +
                                 'font-weight: 600; border: 2px solid #555; ' +
                                 'animation: slideIn 0.3s ease;';
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 3000);
}