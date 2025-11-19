document.addEventListener('DOMContentLoaded', function() {
    startContactPage();
});


// Main function to initialize everything
function startContactPage() {
    setupLogoClick();
    setupCartIcon();
    setupContactForm();
    setupFAQ();
    setupScrollAnimations();
    setupInfoCards();
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

// Setup contact form
function setupContactForm() {
    var contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleFormSubmit();
        });
        
        // Add input focus effects
        var inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('focus', function() {
                this.style.borderColor = '#111';
                this.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.1)';
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.style.borderColor = '#555';
                    this.style.boxShadow = '';
                }
            });
        });
    }
}

// Handle form submission
function handleFormSubmit() {
    var form = document.getElementById('contactForm');
    var submitButton = form.querySelector('.submit-button');
    var originalText = submitButton.textContent;
    
    // Get form values
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var subject = document.getElementById('subject').value;
    var message = document.getElementById('message').value;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';

    setTimeout(function() {
        // Show success message
        showNotification('Thank you, ' + name + '! Your message has been sent successfully.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        
        // Save to localStorage (for demo purposes)
        var formData = {
            name: name,
            email: email,
            subject: subject,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        var submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    }, 2000);
}

//Setup FAQ accordion
function setupFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        var question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(function(otherItem) {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Scroll animations
function setupScrollAnimations() {
    var sections = document.querySelectorAll('.contact-form-section, .info-card, .faq-item');
    
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

// Setup info cards interactions
function setupInfoCards() {
    var infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            var icon = this.querySelector('.info-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            var icon = this.querySelector('.info-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
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

