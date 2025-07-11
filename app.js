// Foxgrove Coffee Consulting JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initFormValidation();
    initScrollAnimations();
    initHeaderScrollEffect();
});

// Smooth Scrolling Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav__link, .footer__link, .hero__cta');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight || 80;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    updateActiveNavLink(targetId);
                }
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.classList.remove('nav__link--active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('nav__link--active');
        }
    });
}

// Form Validation and Submission
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear all previous errors
            clearAllErrors();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            for (let [key, value] of formData.entries()) {
                formObject[key] = value.trim();
            }
            
            // Validate form
            const validation = validateForm(formObject);
            
            if (validation.isValid) {
                handleFormSubmission(formObject);
            } else {
                displayValidationErrors(validation.errors);
            }
        });
        
        // Real-time validation
        const formInputs = contactForm.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                // Clear error state when user starts typing
                this.classList.remove('form-control--error');
                removeFieldError(this);
                
                // Add success state for valid fields
                if (this.value.trim() && validateFieldValue(this)) {
                    this.classList.add('form-control--success');
                } else {
                    this.classList.remove('form-control--success');
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    validateField(this);
                }
            });
        });
    }
}

// Form Validation Logic
function validateForm(data) {
    const errors = [];
    
    // Required field validation
    if (!data.name || data.name.length < 2) {
        errors.push({ field: 'name', message: 'Please enter a valid full name (at least 2 characters)' });
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    
    if (!data.message || data.message.length < 10) {
        errors.push({ field: 'message', message: 'Please provide project details (at least 10 characters)' });
    }
    
    // Optional field validation
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Individual field validation
function validateField(field) {
    const isValid = validateFieldValue(field);
    const value = field.value.trim();
    
    if (isValid) {
        field.classList.remove('form-control--error');
        field.classList.add('form-control--success');
        removeFieldError(field);
    } else {
        field.classList.remove('form-control--success');
        field.classList.add('form-control--error');
        showFieldError(field, getFieldErrorMessage(field));
    }
    
    return isValid;
}

// Validate field value
function validateFieldValue(field) {
    const value = field.value.trim();
    
    switch (field.name) {
        case 'name':
            return value && value.length >= 2;
        case 'email':
            return value && isValidEmail(value);
        case 'phone':
            return !value || isValidPhone(value); // Optional field
        case 'message':
            return value && value.length >= 10;
        case 'company':
            return true; // Optional field
        default:
            return true;
    }
}

// Get error message for field
function getFieldErrorMessage(field) {
    const value = field.value.trim();
    
    switch (field.name) {
        case 'name':
            return 'Please enter a valid full name (at least 2 characters)';
        case 'email':
            return 'Please enter a valid email address';
        case 'phone':
            return 'Please enter a valid phone number';
        case 'message':
            return 'Please provide project details (at least 10 characters)';
        default:
            return 'Please enter a valid value';
    }
}

// Helper validation functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)\.]{10,}$/;
    return phoneRegex.test(phone);
}

// Error display functions
function showFieldError(field, message) {
    removeFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-4)';
    
    field.parentNode.appendChild(errorElement);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearAllErrors() {
    // Remove all error classes
    document.querySelectorAll('.form-control').forEach(field => {
        field.classList.remove('form-control--error', 'form-control--success');
    });
    
    // Remove all error messages
    document.querySelectorAll('.form-error').forEach(error => error.remove());
}

function displayValidationErrors(errors) {
    errors.forEach(error => {
        const field = document.querySelector(`[name="${error.field}"]`);
        if (field) {
            field.classList.add('form-control--error');
            showFieldError(field, error.message);
        }
    });
    
    // Focus on first error field
    if (errors.length > 0) {
        const firstErrorField = document.querySelector(`[name="${errors[0].field}"]`);
        if (firstErrorField) {
            firstErrorField.focus();
        }
    }
}

// Form Submission Handler
function handleFormSubmission(formData) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (in real implementation, this would be an API call)
    setTimeout(() => {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        
        // Clear validation classes
        clearAllErrors();
        
    }, 1000);
}

function showSuccessMessage() {
    // Remove existing success message if any
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="
            background: rgba(var(--color-success-rgb), 0.1);
            border: 1px solid var(--color-success);
            color: var(--color-success);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            margin-bottom: var(--space-16);
            text-align: center;
            font-weight: var(--font-weight-medium);
        ">
            ✓ Thank you for your message! We'll get back to you within 24 hours.
        </div>
    `;
    
    const form = document.getElementById('contactForm');
    form.insertBefore(successMessage, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 5000);
}

// Scroll Animations
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: just add the animation class immediately
        document.querySelectorAll('.service-card, .stat-card').forEach(card => {
            card.classList.add('animate-on-scroll');
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        observer.observe(card);
    });
}

// Header Scroll Effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let ticking = false;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'var(--foxgrove-white)';
            header.style.backdropFilter = 'none';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Add custom CSS classes for form validation
const style = document.createElement('style');
style.textContent = `
    .form-control--error {
        border-color: var(--color-error) !important;
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1) !important;
    }
    
    .form-control--success {
        border-color: var(--color-success) !important;
    }
    
    .form-control--error:focus {
        border-color: var(--color-error) !important;
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.2) !important;
    }
    
    .nav__link--active {
        color: var(--color-primary) !important;
    }
    
    .nav__link--active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);