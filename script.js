// script.js

// Real-time Clock
function updateClock() {
  const clockElement = document.getElementById('clock');
  if (clockElement) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      clockElement.textContent = `${hours} : ${minutes} : ${seconds}`;
  }
}

setInterval(updateClock, 1000);
updateClock(); // initial call

// Scroll-based fade-in animation
function initScrollAnimations() {
    const projects = document.querySelectorAll('.project');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    projects.forEach(project => {
        observer.observe(project);
    });
}

// PhotoSwipe Lightbox
function initPhotoSwipe() {
    // Initialize PhotoSwipe for each project
    const imageContainers = document.querySelectorAll('.image-container');
    
    imageContainers.forEach(container => {
        const pswpUID = container.getAttribute('data-pswp-uid');
        
        container.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!e.target.closest('a')) return;
            
            const clickedGallery = e.target.closest('a');
            const index = parseInt(clickedGallery.getAttribute('data-index')) || 0;
            
            // Build items array from all images in this container
            const items = [];
            const links = container.querySelectorAll('a');
            
            links.forEach(link => {
                items.push({
                    src: link.getAttribute('href'),
                    w: parseInt(link.getAttribute('data-pswp-width')),
                    h: parseInt(link.getAttribute('data-pswp-height')),
                    title: link.querySelector('img').getAttribute('alt')
                });
            });
            
            // Initialize PhotoSwipe
            const lightbox = new PhotoSwipeLightbox({
                dataSource: items,
                pswpModule: PhotoSwipe,
                index: index
            });
            
            lightbox.init();
            lightbox.loadAndOpen(index);
        });
    });
}

// More/Less toggle with smooth animation
function initToggleMore() {
    document.querySelectorAll('.toggle-more').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const moreContent = this.previousElementSibling;
            
            if (moreContent.style.display === 'none' || moreContent.style.display === '') {
                // Show content with smooth animation
                moreContent.style.display = 'block';
                moreContent.style.opacity = '0';
                moreContent.style.transform = 'translateY(-10px)';
                
                // Trigger animation
                requestAnimationFrame(() => {
                    moreContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    moreContent.style.opacity = '1';
                    moreContent.style.transform = 'translateY(0)';
                });
                
                this.textContent = 'Less';
            } else {
                // Hide content with smooth animation
                moreContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                moreContent.style.opacity = '0';
                moreContent.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    moreContent.style.display = 'none';
                }, 300);
                
                this.textContent = 'More';
            }
        });
    });
}

// Project filtering
function initProjectFilters() {
    const filterLinks = document.querySelectorAll('footer nav a[data-filter]');
    const projects = document.querySelectorAll('.project');
    
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const filter = link.getAttribute('data-filter');
            
            projects.forEach(project => {
                const tags = project.querySelectorAll('.tag');
                const projectCategories = Array.from(tags).map(tag => tag.textContent.toLowerCase());
                
                if (filter === 'all') {
                    project.style.display = 'block';
                } else {
                    // Simple category matching based on tags
                    const shouldShow = projectCategories.some(category => {
                        switch (filter) {
                            case 'web':
                                return ['react', 'node.js', 'd3.js', 'javascript', 'html', 'css'].includes(category);
                            case 'mobile':
                                return ['react native', 'mobile', 'ios', 'android'].includes(category);
                            case 'data':
                                return ['d3.js', 'python', 'postgresql', 'mongodb', 'data'].includes(category);
                            default:
                                return false;
                        }
                    });
                    
                    project.style.display = shouldShow ? 'block' : 'none';
                }
            });
        });
    });
    
    // Set 'All' as default active
    const allFilter = document.querySelector('footer nav a[data-filter="all"]');
    if (allFilter) {
        allFilter.classList.add('active');
    }
}

// Smooth scrolling for internal links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax effect for images (subtle)
function initParallaxEffect() {
    const images = document.querySelectorAll('.project-image');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        images.forEach((img, index) => {
            const rate = scrolled * -0.1;
            const yPos = -(rate / (index + 1));
            
            // Apply subtle parallax only if element is in viewport
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                img.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initPhotoSwipe();
    initToggleMore();
    initProjectFilters();
    initSmoothScrolling();
    initParallaxEffect();
    
    // Add a small delay to ensure proper initialization
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll-heavy functions
window.addEventListener('scroll', throttle(() => {
    // Any additional scroll-based functionality can go here
}, 16)); // ~60fps