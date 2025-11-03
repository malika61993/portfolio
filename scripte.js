// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Navbar Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form validation
const form = document.querySelector('.contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic validation
    let isValid = true;
    
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Name is required');
        isValid = false;
    }
    
    if (emailInput.value.trim() === '') {
        showError(emailInput, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email');
        isValid = false;
    }
    
    if (messageInput.value.trim() === '') {
        showError(messageInput, 'Message is required');
        isValid = false;
    }
    
    if (isValid) {
        // Here you would typically send the form data to a server
        alert('Message sent successfully!');
        form.reset();
    }
});

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    const error = document.createElement('small');
    error.textContent = message;
    error.style.color = 'red';
    formGroup.appendChild(error);
    
    setTimeout(() => {
        formGroup.removeChild(error);
        formGroup.classList.remove('error');
    }, 3000);
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 25, 47, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.boxShadow = 'none';
    }
});

// Typewriter effect
const text = "I'm a passionate Data Analyst and Front-End Developer from Guelmim, Morocco";
const typingSpeed = 50;
let i = 0;

function typeWriter() {
    if (i < text.length) {
        document.querySelector('.typewriter').textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, typingSpeed);
    }
}

// Start the typewriter effect when the page loads
window.addEventListener('load', () => {
    document.querySelector('.typewriter').textContent = '';
    typeWriter();
});

/* -------------------------------------------------------------------
   Copy buttons + Celebration Bar
   - Copies email or phone to clipboard with reliable fallback
   - Shows a small blue "Copied!" tooltip near the clicked button
   - Shows a bright gold celebration bar at the top for ~3.5s
   - Updates a live region for screen-readers
   ------------------------------------------------------------------- */

// Robust clipboard copy helper with fallback
async function copyTextToClipboard(text) {
    if (!text) return false;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (e) {
        // fall through to fallback below
    }
    // Fallback for older browsers
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        return ok;
    } catch (err) {
        return false;
    }
}

// Show blue tooltip near button for a short duration (ms)
function showTooltip(button, duration = 2000) {
    if (!button) return;
    button.classList.add('show-tooltip');
    if (button._tooltipTimeout) clearTimeout(button._tooltipTimeout);
    button._tooltipTimeout = setTimeout(() => {
        button.classList.remove('show-tooltip');
        button._tooltipTimeout = null;
    }, duration);
}

// Create and show celebration bar (gold) at top of viewport for ~3500ms
function showCelebrationBar(message = 'Copied to clipboard', duration = 3500) {
    // avoid creating multiple bars at same time
    if (document.querySelector('.celebration-bar')) return;
    const bar = document.createElement('div');
    bar.className = 'celebration-bar';
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-live', 'polite');

    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'bar-text';
    text.textContent = message;

    bar.appendChild(sparkle);
    bar.appendChild(text);
    document.body.appendChild(bar);

    // trigger animation by adding show class
    // slight timeout to ensure element is in DOM
    requestAnimationFrame(() => {
        bar.classList.add('show');
    });

    // remove after duration + small buffer
    setTimeout(() => {
        // remove with slight fade
        bar.classList.remove('show');
        setTimeout(() => bar.remove(), 400);
    }, duration);
}

// wire up copy buttons
function setupCopyButtons() {
    const emailTextEl = document.getElementById('email-text');
    const phoneTextEl = document.getElementById('phone-text');
    const announcer = document.getElementById('copy-announcer');

    const emailBtn = document.getElementById('copy-email');
    const phoneBtn = document.getElementById('copy-phone');

    function handleCopy(btn, value) {
        copyTextToClipboard(value).then(success => {
            if (success) {
                showTooltip(btn, 2200); // show blue tooltip
                showCelebrationBar('Copied ✓', 3500); // golden bar for ~3.5s
                // update live region for screen readers
                if (announcer) announcer.textContent = value + ' copied to clipboard';
            } else {
                // fallback visual
                showTooltip(btn, 2200);
                if (announcer) announcer.textContent = 'Copy failed';
            }
        });
    }

    if (emailBtn && emailTextEl) {
        emailBtn.addEventListener('click', (e) => {
            // read visible text so copy always matches displayed value
            const value = emailTextEl.textContent.trim();
            handleCopy(emailBtn, value);
        });
    }

    if (phoneBtn && phoneTextEl) {
        phoneBtn.addEventListener('click', (e) => {
            const value = phoneTextEl.textContent.trim();
            handleCopy(phoneBtn, value);
        });
    }
}

// initialize copy buttons when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCopyButtons);
} else {
    setupCopyButtons();
}

