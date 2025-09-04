// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const modal = document.getElementById('messageModal');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.querySelector('.close');
const bottles = document.querySelectorAll('.bottle');
const blowButton = document.getElementById('blowCandles');
const candles = document.querySelector('.candles');

// Loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
            startAnimations();
        }, 500);
    }, 2000);
});

// Start animations after loading
function startAnimations() {
    updateTimes();
    setInterval(updateTimes, 1000);
    startCountdown();
    observeTimeline();
}

// Time zone updates
function updateTimes() {
    const now = new Date();
    
    // Mumbai, India time zone
    const mumbaiTime = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Phoenix, USA time zone (Arizona doesn't observe DST)
    const phoenixTime = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Phoenix',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('mumbai-time').textContent = mumbaiTime;
    document.getElementById('phoenix-time').textContent = phoenixTime;
}

// Message bottles functionality
bottles.forEach(bottle => {
    bottle.addEventListener('click', () => {
        const message = bottle.getAttribute('data-message');
        showMessage(message);
        
        // Add click animation
        bottle.style.transform = 'translateY(-10px) scale(1.1)';
        setTimeout(() => {
            bottle.style.transform = 'translateY(-10px) scale(1.05)';
        }, 200);
    });
});

function showMessage(message) {
    modalMessage.textContent = message;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Blow candles functionality
blowButton.addEventListener('click', () => {
    blowCandles();
});

function blowCandles() {
    candles.classList.add('blown');
    blowButton.textContent = 'Make another wish! 🎉';
    
    // Create celebration confetti
    createConfetti();
    
    // Show birthday message
    setTimeout(() => {
        showMessage("🎉 Happy Birthday, Purva Pookie Pie Khare! Your wish is my command. I love you more than words can express, and I can't wait to celebrate many more birthdays together! 🎂💕");
    }, 1000);
    
    // Reset candles after 3 seconds
    setTimeout(() => {
        candles.classList.remove('blown');
        blowButton.textContent = 'Make a wish and blow the candles! 🕯️';
    }, 5000);
}

function createConfetti() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    document.body.appendChild(celebration);
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        celebration.appendChild(confetti);
    }
    
    setTimeout(() => {
        celebration.remove();
    }, 6000);
}

// Countdown timer
function startCountdown() {
    // Set to December 17th, 2025 - when you'll meet again!
    const targetDate = new Date('2025-12-17T00:00:00');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Timeline animation observer
function observeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'timelineSlideIn 0.8s ease-out forwards';
            }
        });
    }, {
        threshold: 0.1
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Photo Gallery System
let currentGallery = [];
let currentPhotoIndex = 0;
let currentFolder = '';

// Photo gallery modal elements
const photoGalleryModal = document.getElementById('photoGalleryModal');
const galleryTitle = document.getElementById('galleryTitle');
const galleryGrid = document.getElementById('galleryGrid');
const fullscreenViewer = document.getElementById('fullscreenViewer');
const fullscreenImage = document.getElementById('fullscreenImage');
const photoCounter = document.getElementById('photoCounter');
const thumbnailStrip = document.getElementById('thumbnailStrip');

// Photo cards interaction - now opens gallery
document.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', () => {
        const folder = card.getAttribute('data-folder');
        openPhotoGallery(folder);
    });
    
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) rotate(2deg) scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotate(0deg) scale(1)';
    });
});

// Load photo count for each category
async function loadPhotoCounts() {
    const folders = ['our time together', 'our video calls', 'baby purva'];
    
    for (const folder of folders) {
        try {
            const photos = await loadPhotosFromFolder(folder);
            const card = document.querySelector(`[data-folder="${folder}"]`);
            const countElement = card.querySelector('.photo-count');
            
            if (photos.length > 0) {
                countElement.textContent = `${photos.length} ${photos.length === 1 ? 'photo' : 'photos'}`;
            } else {
                countElement.textContent = 'Add some photos!';
            }
        } catch (error) {
            console.log(`No photos in ${folder} folder yet`);
            const card = document.querySelector(`[data-folder="${folder}"]`);
            const countElement = card.querySelector('.photo-count');
            countElement.textContent = 'Add some photos!';
        }
    }
}

// Load photos from a folder
async function loadPhotosFromFolder(folder) {
    const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const photos = [];
    
    // Since we can't scan directories in a browser, we'll try common filenames
    // Users will need to follow a naming convention
    const commonNames = [
        'image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7', 'image8', 'image9', 'image10',
        'image11', 'image12', 'image13', 'image14', 'image15', 'image16', 'image17', 'image18', 'image19', 'image20',
        'photo1', 'photo2', 'photo3', 'photo4', 'photo5', 'photo6', 'photo7', 'photo8', 'photo9', 'photo10',
        'photo11', 'photo12', 'photo13', 'photo14', 'photo15', 'photo16', 'photo17', 'photo18', 'photo19', 'photo20',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
    ];
    
    for (const name of commonNames) {
        for (const format of supportedFormats) {
            try {
                const imagePath = `photos/${folder}/${name}.${format}`;
                // Try to load the image to see if it exists
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        photos.push({
                            src: imagePath,
                            name: `${name}.${format}`
                        });
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = imagePath;
                });
            } catch (error) {
                // Image doesn't exist, continue
            }
        }
    }
    
    return photos;
}

// Open photo gallery for a specific folder
async function openPhotoGallery(folder) {
    currentFolder = folder;
    photoGalleryModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Set title
    const folderTitles = {
        'our time together': 'Our Time Together 💕',
        'our video calls': 'Our Video Calls 📱',
        'baby purva': 'Baby Purva 👶'
    };
    galleryTitle.textContent = folderTitles[folder] || 'Our Memories';
    
    // Show loading
    galleryGrid.innerHTML = `
        <div class="gallery-loading">
            <div class="loading-spinner"></div>
            <p>Loading your beautiful memories...</p>
        </div>
    `;
    
    try {
        // Load photos
        currentGallery = await loadPhotosFromFolder(folder);
        
        if (currentGallery.length === 0) {
            // Show empty state
            galleryGrid.innerHTML = `
                <div class="gallery-empty">
                    <h4>No photos yet!</h4>
                    <p>Add some photos to the <strong>photos/${folder}/</strong> folder.<br>
                    Supported formats: .jpg, .jpeg, .png, .gif, .webp<br><br>
                    Try naming them: image1.jpg, photo1.png, 1.jpg, etc.</p>
                </div>
            `;
        } else {
            // Display photos in grid
            displayPhotoGrid();
        }
    } catch (error) {
        galleryGrid.innerHTML = `
            <div class="gallery-empty">
                <h4>Couldn't load photos</h4>
                <p>Make sure photos are in the <strong>photos/${folder}/</strong> folder</p>
            </div>
        `;
    }
}

// Display photos in grid layout
function displayPhotoGrid() {
    galleryGrid.innerHTML = '';
    
    currentGallery.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="${photo.src}" alt="${photo.name}" loading="lazy">`;
        
        galleryItem.addEventListener('click', () => {
            openFullscreenViewer(index);
        });
        
        galleryGrid.appendChild(galleryItem);
    });
}

// Open fullscreen viewer
function openFullscreenViewer(index) {
    currentPhotoIndex = index;
    fullscreenViewer.style.display = 'block';
    galleryGrid.style.display = 'none';
    
    // Initially hide the loader
    const photoLoader = document.querySelector('.photo-loader');
    if (photoLoader) {
        photoLoader.style.display = 'none';
        photoLoader.textContent = 'Loading...'; // Reset text in case it was changed to error message
    }
    
    updateFullscreenPhoto();
    updateThumbnails();
}

// Update fullscreen photo
function updateFullscreenPhoto() {
    if (currentGallery.length === 0) return;
    
    const photo = currentGallery[currentPhotoIndex];
    const photoLoader = document.querySelector('.photo-loader');
    
    // Show loader and hide image initially
    photoLoader.style.display = 'block';
    fullscreenImage.style.opacity = '0';
    
    // Update photo counter
    photoCounter.textContent = `${currentPhotoIndex + 1} of ${currentGallery.length}`;
    
    // Load the image
    fullscreenImage.onload = function() {
        // Hide loader and show image when loaded
        photoLoader.style.display = 'none';
        fullscreenImage.style.opacity = '1';
    };
    
    fullscreenImage.onerror = function() {
        // Handle error case
        photoLoader.textContent = 'Failed to load image';
    };
    
    // Set the image source (this triggers loading)
    fullscreenImage.src = photo.src;
    
    // Update thumbnail selection
    document.querySelectorAll('.thumbnail-item').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentPhotoIndex);
    });
}

// Update thumbnails
function updateThumbnails() {
    thumbnailStrip.innerHTML = '';
    
    currentGallery.forEach((photo, index) => {
        const thumbItem = document.createElement('div');
        thumbItem.className = 'thumbnail-item';
        if (index === currentPhotoIndex) thumbItem.classList.add('active');
        
        thumbItem.innerHTML = `<img src="${photo.src}" alt="${photo.name}">`;
        thumbItem.addEventListener('click', () => {
            currentPhotoIndex = index;
            updateFullscreenPhoto();
        });
        
        thumbnailStrip.appendChild(thumbItem);
    });
}

// Gallery controls
document.querySelector('.gallery-close').addEventListener('click', closePhotoGallery);
document.querySelector('.viewer-close').addEventListener('click', closePhotoGallery);
document.querySelector('.viewer-back').addEventListener('click', () => {
    fullscreenViewer.style.display = 'none';
    galleryGrid.style.display = 'grid';
});

document.querySelector('.prev-btn').addEventListener('click', () => {
    if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
        updateFullscreenPhoto();
    }
});

document.querySelector('.next-btn').addEventListener('click', () => {
    if (currentPhotoIndex < currentGallery.length - 1) {
        currentPhotoIndex++;
        updateFullscreenPhoto();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (photoGalleryModal.style.display === 'block') {
        switch(e.key) {
            case 'Escape':
                if (fullscreenViewer.style.display === 'block') {
                    fullscreenViewer.style.display = 'none';
                    galleryGrid.style.display = 'grid';
                } else {
                    closePhotoGallery();
                }
                break;
            case 'ArrowLeft':
                if (fullscreenViewer.style.display === 'block' && currentPhotoIndex > 0) {
                    currentPhotoIndex--;
                    updateFullscreenPhoto();
                }
                break;
            case 'ArrowRight':
                if (fullscreenViewer.style.display === 'block' && currentPhotoIndex < currentGallery.length - 1) {
                    currentPhotoIndex++;
                    updateFullscreenPhoto();
                }
                break;
        }
    }
});

function closePhotoGallery() {
    photoGalleryModal.style.display = 'none';
    fullscreenViewer.style.display = 'none';
    galleryGrid.style.display = 'grid';
    document.body.style.overflow = 'auto';
}

// Initialize photo counts on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadPhotoCounts, 1000); // Small delay to ensure everything is loaded
});

// Smooth scrolling for navigation
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Add some random floating hearts
function createFloatingHearts() {
    const heart = document.createElement('div');
    heart.innerHTML = '💕';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.fontSize = '1.5rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '999';
    heart.style.animation = 'floatUp 4s ease-out forwards';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 4000);
}

// Add floating hearts periodically
setInterval(createFloatingHearts, 3000);

// CSS for floating hearts animation (added via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add scroll-triggered animations
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});

// Initialize scroll animations
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
});

// Keyboard shortcuts for fun interactions
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'h':
            // Press 'H' for hearts
            for (let i = 0; i < 5; i++) {
                setTimeout(createFloatingHearts, i * 200);
            }
            break;
        case 'b':
            // Press 'B' to blow candles
            blowCandles();
            break;
        case 'm':
            // Press 'M' for a random message
            const randomMessages = [
                "Just wanted to remind you that you're the most beautiful person in my world! 💕",
                "Thinking of you right now and smiling like crazy! 😊",
                "Distance means nothing because you mean everything! 🌍💕",
                "Can't wait to hold you in my arms again! 🤗",
                "You make every day brighter just by existing! ☀️"
            ];
            const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
            showMessage(randomMessage);
            break;
    }
});

// Add resize handler for responsive behavior
window.addEventListener('resize', () => {
    // Update any size-dependent animations or calculations
    updateTimes();
});

// Add visibility change handler to pause/resume animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause heavy animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Console message for your girlfriend if she opens developer tools
console.log(`
🎉❤️ HAPPY BIRTHDAY, BEAUTIFUL! ❤️🎉

If you're reading this, you found my secret message! 
You're not just beautiful on the outside, but you're also curious and amazing!

I love how you explore and discover new things.
Just like how you discovered my heart and made it yours! 💕

With all my love,
Your Boyfriend 💕

P.S. - Try pressing 'H', 'B', or 'M' on your keyboard for some surprises! 😉
`);

// Additional surprise - make the cursor leave heart trails
let isHeartTrailActive = false;

function toggleHeartTrail() {
    isHeartTrailActive = !isHeartTrailActive;
}

document.addEventListener('mousemove', (e) => {
    if (isHeartTrailActive && Math.random() < 0.1) {
        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.style.position = 'fixed';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.fontSize = '1rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '999';
        heart.style.animation = 'heartTrail 1s ease-out forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
});

// CSS for heart trail animation
const heartTrailStyle = document.createElement('style');
heartTrailStyle.textContent = `
    @keyframes heartTrail {
        0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(180deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(heartTrailStyle);

// Activate heart trail on special sections
document.querySelectorAll('#hero, #birthday').forEach(section => {
    section.addEventListener('mouseenter', () => {
        isHeartTrailActive = true;
    });
    
    section.addEventListener('mouseleave', () => {
        isHeartTrailActive = false;
    });
});

// Mobile-specific enhancements
function isMobile() {
    return window.innerWidth <= 768 || 'ontouchstart' in window;
}

// Touch-friendly photo gallery navigation
if (isMobile()) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Add swipe gesture support to photo viewer
    const photoViewer = document.getElementById('fullscreenViewer');
    if (photoViewer) {
        photoViewer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        photoViewer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swipe right - previous photo
                    const prevBtn = document.querySelector('.prev-btn');
                    if (prevBtn && prevBtn.style.display !== 'none') {
                        prevBtn.click();
                    }
                } else {
                    // Swipe left - next photo
                    const nextBtn = document.querySelector('.next-btn');
                    if (nextBtn && nextBtn.style.display !== 'none') {
                        nextBtn.click();
                    }
                }
            }
        }
    }
    
    // Enhanced touch feedback for interactive elements
    document.querySelectorAll('.bottle, .photo-card, .blow-button').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }, { passive: true });
    });
    
    // Touch-based heart trail for mobile
    document.addEventListener('touchmove', (e) => {
        if (isHeartTrailActive && Math.random() < 0.05) {
            const touch = e.touches[0];
            const heart = document.createElement('div');
            heart.innerHTML = '💕';
            heart.style.position = 'fixed';
            heart.style.left = touch.clientX + 'px';
            heart.style.top = touch.clientY + 'px';
            heart.style.fontSize = '1rem';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '999';
            heart.style.animation = 'heartTrail 1s ease-out forwards';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 1000);
        }
    }, { passive: true });
    
    // Activate heart trail on touch for special sections
    document.querySelectorAll('#hero, #birthday').forEach(section => {
        section.addEventListener('touchstart', () => {
            isHeartTrailActive = true;
            setTimeout(() => {
                isHeartTrailActive = false;
            }, 3000); // Auto-disable after 3 seconds
        }, { passive: true });
    });
    
    // Prevent zoom on double-tap for specific elements
    document.querySelectorAll('.bottle, .photo-card, .blow-button, .countdown-item').forEach(element => {
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
        });
    });
    
    // Optimize performance on mobile by reducing animation frequency
    const originalUpdateTimes = updateTimes;
    updateTimes = function() {
        // Update time less frequently on mobile to save battery
        if (document.hidden) return; // Don't update when tab is not visible
        originalUpdateTimes();
    };
    
    // Add visibility change listener for better mobile performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause expensive animations when tab is hidden
            document.querySelectorAll('.stars, body::before').forEach(element => {
                if (element.style) {
                    element.style.animationPlayState = 'paused';
                }
            });
        } else {
            // Resume animations when tab is visible
            document.querySelectorAll('.stars, body::before').forEach(element => {
                if (element.style) {
                    element.style.animationPlayState = 'running';
                }
            });
        }
    });
}