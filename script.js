document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const hamburger = document.querySelector('.hamburger');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuPanel.classList.toggle('translate-x-full');
        hamburger.classList.toggle('active');
    });
    document.querySelectorAll('#mobile-menu-panel a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuPanel.classList.add('translate-x-full');
            hamburger.classList.remove('active');
        });
    });

    // Hero typing animation
    const typingElement = document.getElementById('hero-typing');
    const words = ["clear, actionable insights.", "efficient automated systems.", "operational excellence."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    type();

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.nav-link-desktop');
    const scrollObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').substring(1) === entry.target.id);
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });
    sections.forEach(sec => scrollObserver.observe(sec));

    // --- HORIZONTAL TIMELINE LOGIC ---
    const timelineData = [
        { id: 'edu1', startDate: '2020-08-01', endDate: '2023-05-01', displayDate: '2020', title: 'Biotechnology Hons.', details: 'Completed my honours degree at TNB College, Bhagalpur.' },
        { id: 'exp1', startDate: '2024-02-01', endDate: 'Present', displayDate: 'FEB 2024', title: 'NPE Operations Team', details: 'Joined the core operations team at Bharti Airtel Head Office, Gurugram.' },
        { id: 'edu2', startDate: '2024-07-01', endDate: 'Present', displayDate: 'JUL 2024', title: 'MSc Biotechnology', details: 'Began postgraduate studies (Open and Distance Learning) at Karnataka State Open University.' },
    ];
    
    const timelineContainer = document.getElementById('timeline-container');
    const detailsContainer = document.getElementById('timeline-details-container');
    const detailsContent = document.getElementById('timeline-details-content');
    const sortAscBtn = document.getElementById('sort-asc');
    const sortDescBtn = document.getElementById('sort-desc');
    let currentSortOrder = 'asc';

    function formatFullDate(dateString) {
        if (!dateString || dateString === 'Present') return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    }

    function renderTimeline(sortOrder) {
        timelineContainer.innerHTML = ''; // Clear existing timeline
        
        const sortedData = [...timelineData].sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        sortedData.forEach((event, index) => {
            const eventEl = document.createElement('div');
            eventEl.className = 'timeline-event';
            eventEl.style.left = `${15 + (index * 30)}%`; // Spacing out events
            eventEl.dataset.id = event.id;

            const dotEl = document.createElement('div');
            dotEl.className = 'timeline-dot';
            
            const dateEl = document.createElement('div');
            dateEl.className = 'timeline-date';
            dateEl.textContent = event.displayDate;

            eventEl.appendChild(dotEl);
            eventEl.appendChild(dateEl);
            timelineContainer.appendChild(eventEl);

            dotEl.addEventListener('click', () => {
                const isAlreadyActive = dotEl.classList.contains('active');
                
                document.querySelectorAll('.timeline-dot.active').forEach(d => d.classList.remove('active'));
                
                if (isAlreadyActive) {
                    detailsContainer.classList.remove('expanded');
                } else {
                    dotEl.classList.add('active');
                    
                    detailsContainer.classList.remove('expanded'); // Collapse before showing new content
                    
                    setTimeout(() => {
                        detailsContent.innerHTML = `
                            <div class="flex justify-between items-center mb-2 pb-2 border-b border-[var(--border-color)]">
                                <h4 class="font-bold text-white text-lg">${event.title}</h4>
                                <p class="font-mono text-xs text-red-500/80">${formatFullDate(event.startDate)} - ${formatFullDate(event.endDate)}</p>
                            </div>
                            <p class="text-gray-400 pt-2">${event.details}</p>
                        `;
                        
                        const timelineWrapperRect = document.querySelector('.horizontal-timeline-wrapper').getBoundingClientRect();
                        const eventRect = eventEl.getBoundingClientRect();
                        const pointerPosition = (eventRect.left - timelineWrapperRect.left) + (eventRect.width / 2);

                        detailsContent.style.setProperty('--pointer-position', `${pointerPosition}px`);
                        
                        detailsContainer.classList.add('expanded');
                    }, 250); // Delay matches collapse animation time
                }
            });
        });
    }

    sortAscBtn.addEventListener('click', () => {
        currentSortOrder = 'asc';
        sortAscBtn.classList.add('active');
        sortDescBtn.classList.remove('active');
        detailsContainer.classList.remove('expanded');
        renderTimeline(currentSortOrder);
    });

    sortDescBtn.addEventListener('click', () => {
        currentSortOrder = 'desc';
        sortDescBtn.classList.add('active');
        sortAscBtn.classList.remove('active');
        detailsContainer.classList.remove('expanded');
        renderTimeline(currentSortOrder);
    });

    renderTimeline(currentSortOrder);

    // --- Project Slider ---
    const track = document.querySelector('.slider-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.slider-button.next');
        const prevButton = document.querySelector('.slider-button.prev');
        let currentIndex = 0;
        let isDragging = false, startX, startScrollLeft;

        const getSlidesPerView = () => {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        };

        const updateSlider = () => {
            if(slides.length === 0) return;
            const slidesPerView = getSlidesPerView();
            const slideWidth = track.clientWidth / slidesPerView;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            prevButton.style.display = currentIndex === 0 ? 'none' : 'flex';
            nextButton.style.display = currentIndex >= slides.length - slidesPerView ? 'none' : 'flex';
        };

        const nextSlide = () => {
             const slidesPerView = getSlidesPerView();
            if (currentIndex < slides.length - slidesPerView) {
                currentIndex++;
                updateSlider();
            }
        }

        const prevSlide = () => {
             if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        }

        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
        
        // Swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum swipe distance
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
            }
        }


        window.addEventListener('resize', () => {
            currentIndex = 0; // Reset on resize
            updateSlider();
        });

        // Initial setup
        setTimeout(updateSlider, 100);
    }
});

