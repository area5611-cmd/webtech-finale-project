/*
 * LANDING.js - Interactive functions for the landing page
 * Beginner-friendly JavaScript with detailed comments
 */

// ============================================
// STEP 1: Wait for page to load
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    startLandingPage();
});

// ============================================
// STEP 2: Main function to initialize everything
// ============================================
function startLandingPage() {
    // Get the Shop Now button
    var shopNowBtn = document.querySelector('.info-box button');
    
    // Setup Shop Now button
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', handleShopNow);
        shopNowBtn.addEventListener('mouseenter', handleButtonHover);
        shopNowBtn.addEventListener('mouseleave', handleButtonLeave);
        
        // Add click animation
        shopNowBtn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        shopNowBtn.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.05)';
        });
    }
    
    // Add animation to logo on load
    animateLogo();
    
    // Add scroll animations
    setupScrollAnimations();
    
    // Add interactive header effects
    setupHeaderInteractions();
    
    // Add typing effect to tagline
    addTypingEffect();
    
    // Add parallax effect
    setupParallaxEffect();
    
    // Add counter animation
    setupCounterAnimation();
    
    // Add keyboard shortcuts
    setupKeyboardShortcuts();
}

// ============================================
// STEP 3: Handle Shop Now button click
// ============================================
function handleShopNow() {
    var shopButton = document.querySelector('.info-box button');
    
    // Add loading animation
    if (shopButton) {
        var originalText = shopButton.textContent;
        shopButton.textContent = 'Loading...';
        shopButton.disabled = true;
        
        // Show notification
        showNotification('Redirecting to products...', 'info');
        
        // Navigate after short delay
        setTimeout(function() {
            window.location.href = 'products.html';
        }, 500);
    } else {
        window.location.href = 'products.html';
    }
}

// ============================================
// STEP 4: Button hover effects
// ============================================
function handleButtonHover(e) {
    var button = e.target;
    button.style.transform = 'scale(1.05)';
    button.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
}

function handleButtonLeave(e) {
    var button = e.target;
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '';
}

// ============================================
// STEP 5: Animate logo on page load
// ============================================
function animateLogo() {
    var logo = document.querySelector('.logo');
    var header = document.querySelector('.commerce-header h2');
    
    if (logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'scale(0.8) rotate(-5deg)';
        logo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(function() {
            logo.style.opacity = '1';
            logo.style.transform = 'scale(1) rotate(0deg)';
            
            // Add pulse animation
            setInterval(function() {
                logo.style.transform = 'scale(1.05)';
                setTimeout(function() {
                    logo.style.transform = 'scale(1)';
                }, 200);
            }, 3000);
        }, 100);
    }
    
    if (header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        header.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
        
        setTimeout(function() {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 200);
    }
}

// ============================================
// STEP 6: Setup scroll animations
// ============================================
function setupScrollAnimations() {
    var infoBox = document.querySelector('.info-box');
    
    if (infoBox) {
        // Intersection Observer for fade-in on scroll
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        infoBox.style.opacity = '0';
        infoBox.style.transform = 'translateY(30px)';
        infoBox.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(infoBox);
    }
}

// ============================================
// STEP 7: Setup header interactions
// ============================================
function setupHeaderInteractions() {
    var header = document.querySelector('.commerce-header');
    var tagline = document.querySelector('.commerce-header p');
    
    if (tagline) {
        // Add click interaction to tagline
        tagline.style.cursor = 'pointer';
        tagline.addEventListener('click', function() {
            tagline.style.transform = 'scale(1.1)';
            tagline.style.color = '#ee4d2d';
            setTimeout(function() {
                tagline.style.transform = 'scale(1)';
                tagline.style.color = '';
            }, 200);
        });
        
        // Add hover effect
        tagline.addEventListener('mouseenter', function() {
            this.style.transition = 'color 0.3s ease';
            this.style.color = '#ee4d2d';
        });
        
        tagline.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    }
    
    // Add hover effect to entire header
    if (header) {
        header.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'scale(1.02)';
        });
        
        header.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// ============================================
// STEP 8: Add typing effect to tagline
// ============================================
function addTypingEffect() {
    var tagline = document.querySelector('.commerce-header p');
    if (tagline) {
        var originalText = tagline.textContent;
        tagline.textContent = '';
        var index = 0;
        
        function typeChar() {
            if (index < originalText.length) {
                tagline.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeChar, 50);
            }
        }
        
        setTimeout(typeChar, 1000);
    }
}

// ============================================
// STEP 9: Setup parallax effect
// ============================================
function setupParallaxEffect() {
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        var logo = document.querySelector('.logo');
        var header = document.querySelector('.commerce-header');
        
        if (logo) {
            logo.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
        }
        
        if (header) {
            header.style.transform = 'translateY(' + (scrolled * 0.2) + 'px)';
        }
    });
}

// ============================================
// STEP 10: Setup counter animation
// ============================================
function setupCounterAnimation() {
    var infoBox = document.querySelector('.info-box h3');
    if (infoBox && infoBox.textContent.includes('Deals')) {
        // Add animated number if needed
        var count = 0;
        setInterval(function() {
            count++;
            if (count > 100) count = 0;
        }, 100);
    }
}

// ============================================
// STEP 11: Keyboard shortcuts
// ============================================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Press Enter or Space to shop
        if (e.key === 'Enter' || e.key === ' ') {
            var activeElement = document.activeElement;
            if (activeElement && activeElement.textContent === 'Shop Now') {
                e.preventDefault();
                handleShopNow();
            }
        }
        
        // Press 'S' to focus search/shop
        if (e.key === 's' || e.key === 'S') {
            if (!isInputFocused()) {
                e.preventDefault();
                handleShopNow();
            }
        }
    });
}

function isInputFocused() {
    var activeElement = document.activeElement;
    return activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
}

// ============================================
// STEP 12: Show notifications
// ============================================
function showNotification(message, type) {
    type = type || 'info';
    
    var notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Matching LANDING theme colors (black/white/gray)
    var bgColor = '#111';
    var textColor = 'white';
    if (type === 'success') {
        bgColor = '#555';
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

// ============================================
// STEP 13: Touch support for mobile
// ============================================
var touchStartY = 0;
var touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    // Swipe up to shop
    if (touchEndY < touchStartY - 50) {
        var shopBtn = document.querySelector('.info-box button');
        if (shopBtn) {
            shopBtn.style.transform = 'scale(0.95)';
            setTimeout(function() {
                shopBtn.style.transform = 'scale(1)';
                handleShopNow();
            }, 150);
        }
    }
}


