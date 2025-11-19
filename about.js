
// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    startAboutPage();
});

// Main function to initialize everything
function startAboutPage() {
    setupLogoClick();
    setupCartIcon();
    setupScrollAnimations();
    setupParallaxEffect();
}

// Logo click
function setupLogoClick() {
    var logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'LANDING.html';
        });
        logo.style.cursor = 'pointer';
    }
}

// Add to Cart 
function setupCartIcon() {
    var cartIcon = document.querySelector('.cart');
    if (cartIcon) {
        // Since it's now an anchor tag, we can still add hover effects via JavaScript
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

// Scroll animations
function setupScrollAnimations() {
    var sections = document.querySelectorAll('.content-section, .value-card, .team-card');
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(function(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

