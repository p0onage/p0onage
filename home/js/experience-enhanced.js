/**
 * Enhanced Experience Section JavaScript
 * Handles expandable headers, smooth animations, and interactive features
 */

class ExperienceEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupInitialState();
    }

    setupEventListeners() {
        // Add click listeners to all experience headers
        document.addEventListener('click', (e) => {
            const header = e.target.closest('.experience-header');
            if (header) {
                this.toggleExperience(header);
            }

            const showMoreBtn = e.target.closest('.show-more-btn');
            if (showMoreBtn) {
                this.toggleDescription(showMoreBtn);
            }
        });

        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            const header = e.target.closest('.experience-header');
            if (header && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this.toggleExperience(header);
            }
        });

        // Add smooth scroll behavior for better UX
        document.addEventListener('DOMContentLoaded', () => {
            this.addScrollBehavior();
        });
    }

    setupInitialState() {
        // Make headers focusable and add ARIA attributes
        const headers = document.querySelectorAll('.experience-header');
        headers.forEach((header, index) => {
            header.setAttribute('tabindex', '0');
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', `experience-content-${index}`);
            
            const content = header.nextElementSibling;
            if (content && content.classList.contains('experience-content')) {
                content.setAttribute('id', `experience-content-${index}`);
                content.setAttribute('aria-hidden', 'true');
            }
        });
    }

    toggleExperience(header) {
        const content = header.nextElementSibling;
        const expandIcon = header.querySelector('.expand-icon');
        const isExpanded = header.classList.contains('expanded');

        if (isExpanded) {
            this.collapseExperience(header, content, expandIcon);
        } else {
            this.expandExperience(header, content, expandIcon);
        }
    }

    expandExperience(header, content, expandIcon) {
        // Close other expanded sections for better UX
        this.collapseAllOthers(header);

        header.classList.add('expanded');
        content.classList.add('expanded');
        
        // Update ARIA attributes
        header.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');

        // Add fade in animation to content
        content.addEventListener('transitionend', () => {
            if (content.classList.contains('expanded')) {
                content.classList.add('fade-in');
            }
        }, { once: true });

        // Smooth scroll to the expanded section
        setTimeout(() => {
            header.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);

        // Announce to screen readers
        this.announceChange(`Expanded ${this.getCompanyName(header)} experience details`);
    }

    collapseExperience(header, content, expandIcon) {
        header.classList.remove('expanded');
        content.classList.remove('expanded', 'fade-in');
        
        // Update ARIA attributes
        header.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');

        // Announce to screen readers
        this.announceChange(`Collapsed ${this.getCompanyName(header)} experience details`);
    }

    collapseAllOthers(currentHeader) {
        const allHeaders = document.querySelectorAll('.experience-header.expanded');
        allHeaders.forEach(header => {
            if (header !== currentHeader) {
                const content = header.nextElementSibling;
                this.collapseExperience(header, content);
            }
        });
    }

    toggleDescription(button) {
        const description = button.parentNode.querySelector('.position-description');
        const isExpanded = description.classList.contains('expanded');

        if (isExpanded) {
            description.classList.remove('expanded');
            description.style.maxHeight = '100px';
            button.textContent = 'Show more';
        } else {
            description.classList.add('expanded');
            description.style.maxHeight = 'none';
            button.textContent = 'Show less';
        }

        // Smooth animation
        description.style.transition = 'max-height 0.3s ease';
    }

    getCompanyName(header) {
        const companyElement = header.querySelector('.experience-main-info h3');
        return companyElement ? companyElement.textContent.trim() : 'company';
    }

    announceChange(message) {
        // Create a live region for screen reader announcements
        let liveRegion = document.getElementById('experience-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'experience-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
        liveRegion.textContent = message;
    }

    addScrollBehavior() {
        // Add intersection observer for scroll animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationDelay = '0.1s';
                        entry.target.classList.add('fade-in');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.experience-section').forEach(section => {
                observer.observe(section);
            });
        }
    }

    // Utility method to expand all sections (useful for print or accessibility)
    expandAll() {
        const headers = document.querySelectorAll('.experience-header:not(.expanded)');
        headers.forEach(header => {
            const content = header.nextElementSibling;
            this.expandExperience(header, content);
        });
    }

    // Utility method to collapse all sections
    collapseAll() {
        const headers = document.querySelectorAll('.experience-header.expanded');
        headers.forEach(header => {
            const content = header.nextElementSibling;
            this.collapseExperience(header, content);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.experienceEnhancer = new ExperienceEnhancer();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExperienceEnhancer;
}