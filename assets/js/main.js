/*
============================================================
HEALTH SCALE DIGITAL - MAIN JAVASCRIPT
============================================================

This file handles interactive functionality:
1. Mobile navigation menu toggle
2. Smooth scrolling for anchor links
3. Header scroll behavior
4. Active navigation link highlighting

============================================================
*/

// Wait for DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
    
    /*
    ============================================================
    1. MOBILE NAVIGATION MENU TOGGLE
    ============================================================
    Opens and closes the mobile menu when the hamburger icon is clicked.
    */
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Toggle menu open/close when hamburger is clicked
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Toggle aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Close menu when a nav link is clicked (for smooth scrolling on mobile)
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Close menu when clicking outside of it
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    
    /*
    ============================================================
    2. SMOOTH SCROLLING FOR ANCHOR LINKS
    ============================================================
    Enables smooth scrolling when clicking navigation links.
    Accounts for the fixed header height.
    */
    
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    allAnchorLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" (go to top)
            if (targetId === '#') {
                event.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                // Calculate scroll position accounting for fixed header
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    /*
    ============================================================
    3. HEADER SCROLL BEHAVIOR
    ============================================================
    Adds a shadow to the header when scrolling down.
    Optional: Can also hide/show header on scroll.
    */
    
    const header = document.getElementById('header');
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.pageYOffset;
        
        // Add shadow when scrolled down
        if (currentScrollPosition > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollPosition = currentScrollPosition;
    });
    
    
    /*
    ============================================================
    4. ACTIVE NAVIGATION LINK HIGHLIGHTING
    ============================================================
    Highlights the current section's nav link as user scrolls.
    */
    
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollPosition = window.pageYOffset + headerHeight + 100;
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's link
                const activeLink = document.querySelector('.nav__link[href="#' + sectionId + '"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    
    /*
    ============================================================
    5. OPTIONAL: INTERSECTION OBSERVER FOR ANIMATIONS
    ============================================================
    Uncomment this section to enable fade-in animations
    when elements come into view.
    */
    
    /*
    const animatedElements = document.querySelectorAll('.service__card, .team__member, .why-us__item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(function(element) {
        observer.observe(element);
    });
    */
    
});


/*
============================================================
UTILITY FUNCTIONS
============================================================
Helper functions that can be used throughout the site.
*/

/**
 * Debounce function - limits how often a function can be called
 * Useful for scroll and resize event handlers
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - Milliseconds to wait before calling
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 * 
 * @param {Element} element - DOM element to check
 * @returns {boolean} - True if element is visible in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
