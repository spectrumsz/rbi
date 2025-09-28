// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles
    initParticles();

    // Navigation and page management
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const navMenu = document.getElementById('nav-links');
    const burger = document.getElementById('burger-menu');

    // Burger Menu Toggle
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    navLinks.forEach(link => {
        if (link.getAttribute('target') === '_blank') return;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetPageId = link.getAttribute('data-page');
            showPage(targetPageId);
            
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            if(navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                burger.classList.remove('toggle');
            }
        });
    });

    // Copy Script Button
    const copyBtn = document.getElementById('copyBtn');
    const scriptCode = document.getElementById('script').innerText;
    
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(scriptCode).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied!';
            
            setTimeout(() => {
                copyBtn.innerText = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    // Floating Script Effect
    const scriptElement = document.getElementById('script');
    const floatingScript = document.getElementById('floatingScript');

    scriptElement.addEventListener('mouseenter', function() {
        floatingScript.textContent = this.textContent.trim();
        floatingScript.style.opacity = '1';
    });

    scriptElement.addEventListener('mouseleave', function() {
        floatingScript.style.opacity = '0';
    });

    document.addEventListener('mousemove', function(e) {
        floatingScript.style.left = (e.pageX + 15) + 'px';
        floatingScript.style.top = (e.pageY + 15) + 'px';
    });

    // Reviews System
    initReviewsSystem();

    // Settings System
    initSettingsSystem();

    // Load saved settings
    loadSettings();
});

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });
}

function initParticles() {
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#1a73e8" },
            "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
            "opacity": { "value": 0.5, "random": false, "anim": { "enable": false } },
            "size": { "value": 3, "random": true, "anim": { "enable": false } },
            "line_linked": { "enable": true, "distance": 150, "color": "#1a73e8", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 4, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
            "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } }
        },
        "retina_detect": true
    });
}

function initReviewsSystem() {
    const starRating = document.querySelectorAll('.star-rating i');
    const ratingInput = document.getElementById('rating');
    const reviewForm = document.getElementById('reviewForm');
    const reviewsGrid = document.getElementById('reviewsGrid');

    // Star rating interaction
    if (starRating.length > 0) {
        starRating.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                ratingInput.value = rating;
                
                starRating.forEach(s => {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                });
                
                for (let i = 0; i < rating; i++) {
                    starRating[i].classList.remove('far');
                    starRating[i].classList.add('fas', 'active');
                }
            });

            star.addEventListener('mouseover', function() {
                const rating = this.getAttribute('data-rating');
                starRating.forEach(s => {
                    s.classList.remove('fas');
                    s.classList.add('far');
                });
                
                for (let i = 0; i < rating; i++) {
                    starRating[i].classList.remove('far');
                    starRating[i].classList.add('fas');
                }
            });

            star.addEventListener('mouseout', function() {
                const currentRating = ratingInput.value;
                starRating.forEach(s => {
                    s.classList.remove('fas');
                    s.classList.add('far');
                });
                
                if (currentRating) {
                    for (let i = 0; i < currentRating; i++) {
                        starRating[i].classList.remove('far');
                        starRating[i].classList.add('fas', 'active');
                    }
                }
            });
        });
    }

    // Review form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userName = document.getElementById('userName').value;
            const rating = ratingInput.value;
            const reviewText = document.getElementById('reviewText').value;
            
            if (!userName || !rating || !reviewText) {
                alert('Please fill in all fields');
                return;
            }

            const review = {
                id: Date.now(),
                userName: document.getElementById('anonymousReviews')?.checked ? 'Anonymous' : userName,
                rating: parseInt(rating),
                text: reviewText,
                date: new Date().toLocaleDateString()
            };

            saveReview(review);
            displayReviews();
            updateAverageRating();
            
            // Reset form
            reviewForm.reset();
            starRating.forEach(s => {
                s.classList.remove('fas', 'active');
                s.classList.add('far');
            });
            ratingInput.value = '';
            
            alert('Review submitted successfully!');
        });
    }

    // Load and display reviews
    displayReviews();
    updateAverageRating();
}

function saveReview(review) {
    const reviews = getReviews();
    reviews.unshift(review); // Add to beginning
    localStorage.setItem('luaHubReviews', JSON.stringify(reviews));
}

function getReviews() {
    return JSON.parse(localStorage.getItem('luaHubReviews') || '[]');
}

function displayReviews() {
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (!reviewsGrid) return;
    
    const reviews = getReviews();
    
    reviewsGrid.innerHTML = '';
    
    if (reviews.length === 0) {
        reviewsGrid.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
        return;
    }
    
    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <img src="https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png" alt="${review.userName}" class="review-avatar">
                <div class="review-user">
                    <h3>${review.userName}</h3>
                    <div class="review-stars">
                        ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                        ${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
                    </div>
                </div>
            </div>
            <p class="review-text">${review.text}</p>
            <span class="review-date">${review.date}</span>
        `;
        reviewsGrid.appendChild(reviewCard);
    });
}

function updateAverageRating() {
    const reviews = getReviews();
    const averageRatingElement = document.getElementById('averageRating');
    const reviewCountElement = document.getElementById('reviewCount');
    
    if (!averageRatingElement || !reviewCountElement) return;
    
    if (reviews.length === 0) {
        averageRatingElement.textContent = '0.0';
        reviewCountElement.textContent = 'No reviews yet';
        return;
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);
    
    averageRatingElement.textContent = averageRating;
    reviewCountElement.textContent = `Based on ${reviews.length} reviews`;
}

function initSettingsSystem() {
    const saveBtn = document.getElementById('saveSettings');
    const resetBtn = document.getElementById('resetSettings');
    
    if (saveBtn) saveBtn.addEventListener('click', saveSettings);
    if (resetBtn) resetBtn.addEventListener('click', resetSettings);
    
    // Add change listeners to update settings in real-time
    document.querySelectorAll('.switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            if (this.id === 'darkModeToggle') {
                document.body.classList.toggle('dark-mode', this.checked);
            }
            if (this.id === 'particlesToggle') {
                const particles = document.getElementById('particles-js');
                particles.style.display = this.checked ? 'block' : 'none';
            }
        });
    });
}

function saveSettings() {
    const settings = {
        darkMode: document.getElementById('darkModeToggle').checked,
        particles: document.getElementById('particlesToggle').checked,
        emailNotifications: document.getElementById('emailNotifications').checked,
        discordNotifications: document.getElementById('discordNotifications').checked,
        saveReviews: document.getElementById('saveReviews').checked,
        anonymousReviews: document.getElementById('anonymousReviews').checked
    };
    
    localStorage.setItem('luaHubSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('luaHubSettings') || '{}');
    
    // Apply settings
    const darkModeToggle = document.getElementById('darkModeToggle');
    const particlesToggle = document.getElementById('particlesToggle');
    const emailNotifications = document.getElementById('emailNotifications');
    const discordNotifications = document.getElementById('discordNotifications');
    const saveReviews = document.getElementById('saveReviews');
    const anonymousReviews = document.getElementById('anonymousReviews');
    
    if (darkModeToggle) darkModeToggle.checked = settings.darkMode || false;
    if (particlesToggle) particlesToggle.checked = settings.particles !== false; // Default true
    if (emailNotifications) emailNotifications.checked = settings.emailNotifications || false;
    if (discordNotifications) discordNotifications.checked = settings.discordNotifications !== false; // Default true
    if (saveReviews) saveReviews.checked = settings.saveReviews !== false; // Default true
    if (anonymousReviews) anonymousReviews.checked = settings.anonymousReviews || false;
    
    // Apply visual changes
    document.body.classList.toggle('dark-mode', settings.darkMode);
    const particles = document.getElementById('particles-js');
    if (particles) {
        particles.style.display = settings.particles !== false ? 'block' : 'none';
    }
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        localStorage.removeItem('luaHubSettings');
        location.reload();
    }
}
