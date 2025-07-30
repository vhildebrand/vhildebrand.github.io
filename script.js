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

// Simple Fallback Lightbox
function createSimpleLightbox(imageSrc, imageAlt) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = imageAlt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 4px;
    `;
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keyup', handleEscape);
        }
    };
    document.addEventListener('keyup', handleEscape);
}

// PhotoSwipe Lightbox
function initPhotoSwipe() {
    // Check if PhotoSwipe is loaded
    if (typeof PhotoSwipeLightbox === 'undefined' || typeof PhotoSwipe === 'undefined') {
        console.warn('PhotoSwipe not loaded, using fallback lightbox');
        initFallbackLightbox();
        return;
    }
    
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
                    w: parseInt(link.getAttribute('data-pswp-width')) || 800,
                    h: parseInt(link.getAttribute('data-pswp-height')) || 600,
                    title: link.querySelector('img').getAttribute('alt') || ''
                });
            });
            
            // Initialize PhotoSwipe with error handling
            try {
                const lightbox = new PhotoSwipeLightbox({
                    dataSource: items,
                    pswpModule: PhotoSwipe,
                    index: index
                });
                
                lightbox.init();
                lightbox.loadAndOpen(index);
            } catch (error) {
                console.error('PhotoSwipe initialization failed:', error);
                // Use simple lightbox fallback
                const imageSrc = clickedGallery.getAttribute('href');
                const imageAlt = clickedGallery.querySelector('img').getAttribute('alt');
                createSimpleLightbox(imageSrc, imageAlt);
            }
        });
    });
}

// Fallback lightbox for when PhotoSwipe is not available
function initFallbackLightbox() {
    const imageLinks = document.querySelectorAll('.image-container a');
    
    imageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const imageSrc = link.getAttribute('href');
            const imageAlt = link.querySelector('img').getAttribute('alt');
            createSimpleLightbox(imageSrc, imageAlt);
        });
    });
}

// Enhanced More/Less toggle with blog post view
function initToggleMore() {
    document.querySelectorAll('.toggle-more').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const project = this.closest('.project');
            
            if (this.textContent === 'More') {
                showProjectDetail(project);
                this.textContent = 'Less';
            } else {
                hideProjectDetail();
                this.textContent = 'More';
            }
        });
    });
}

function showProjectDetail(project) {
    // Get project data
    const title = project.querySelector('h2').textContent;
    const subtitle = project.querySelector('.project-year').textContent;
    const moreContent = project.querySelector('.more-content p').textContent;
    const images = project.querySelectorAll('.project-image');
    const tags = project.querySelectorAll('.tag');
    
    // Create detail view
    const detailView = document.createElement('div');
    detailView.className = 'project-detail-view';
    detailView.innerHTML = `
        <button class="close-detail-view">&times;</button>
        <div class="project-detail-content">
            <div class="project-detail-text">
                <h1 class="project-detail-title">${title}</h1>
                <p class="project-detail-subtitle">${subtitle}</p>
                <div class="blog-content">
                    <p>${moreContent}</p>
                    <p>This project represents a significant step forward in the field, combining cutting-edge technology with thoughtful design principles. The development process involved extensive research, prototyping, and iteration to achieve the final result.</p>
                    <p>Key challenges overcome during development included scalability concerns, user experience optimization, and integration with existing systems. The solution employs modern architectural patterns and best practices to ensure maintainability and performance.</p>
                    <p>The impact of this work extends beyond the immediate application, contributing to broader understanding of the problem space and providing a foundation for future innovations in the domain.</p>
                </div>
                <div class="project-detail-tags">
                    <h3>Technologies Used</h3>
                    <div class="project-tags">
                        ${Array.from(tags).map(tag => `<span class="tag">${tag.textContent}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="project-detail-images">
                <div class="project-detail-images-container">
                    ${Array.from(images).map(img => `<img src="${img.src}" alt="${img.alt}" class="project-detail-image">`).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(detailView);
    
    // Fade other projects
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    main.classList.add('projects-faded');
    footer.classList.add('projects-faded');
    project.classList.add('active-project');
    
    // Show detail view
    requestAnimationFrame(() => {
        detailView.classList.add('active');
        startTypingAnimation(detailView);
    });
    
    // Add close functionality
    const closeBtn = detailView.querySelector('.close-detail-view');
    closeBtn.addEventListener('click', hideProjectDetail);
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            hideProjectDetail();
        }
    };
    document.addEventListener('keyup', handleEscape);
    
    // Store cleanup function
    detailView._cleanup = () => {
        document.removeEventListener('keyup', handleEscape);
    };
}

function hideProjectDetail() {
    const detailView = document.querySelector('.project-detail-view');
    if (detailView) {
        // Cleanup event listeners
        if (detailView._cleanup) {
            detailView._cleanup();
        }
        
        // Hide detail view
        detailView.classList.remove('active');
        
        // Restore projects
        const main = document.querySelector('main');
        const footer = document.querySelector('footer');
        main.classList.remove('projects-faded');
        footer.classList.remove('projects-faded');
        document.querySelectorAll('.project').forEach(p => p.classList.remove('active-project'));
        
        // Reset toggle buttons
        document.querySelectorAll('.toggle-more').forEach(toggle => {
            toggle.textContent = 'More';
        });
        
        // Remove detail view after animation
        setTimeout(() => {
            if (detailView.parentNode) {
                detailView.parentNode.removeChild(detailView);
            }
        }, 600);
    }
}

function startTypingAnimation(detailView) {
    const paragraphs = detailView.querySelectorAll('.blog-content p');
    let currentParagraph = 0;
    
    function typeParagraph(paragraph, text, callback) {
        paragraph.classList.add('typing');
        paragraph.innerHTML = '';
        
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        paragraph.appendChild(cursor);
        
        let charIndex = 0;
        
        function typeCharacter() {
            if (charIndex < text.length) {
                const textNode = document.createTextNode(text.charAt(charIndex));
                paragraph.insertBefore(textNode, cursor);
                charIndex++;
                
                // Variable typing speed for natural feel
                const delay = Math.random() * 30 + 20;
                setTimeout(typeCharacter, delay);
            } else {
                // Remove cursor and call callback
                cursor.remove();
                if (callback) callback();
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeCharacter, 800 + (currentParagraph * 200));
    }
    
    function processNextParagraph() {
        if (currentParagraph < paragraphs.length) {
            const paragraph = paragraphs[currentParagraph];
            const text = paragraph.textContent;
            
            typeParagraph(paragraph, text, () => {
                currentParagraph++;
                setTimeout(processNextParagraph, 300);
            });
        }
    }
    
    processNextParagraph();
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