document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const hamburger = document.querySelector('.hamburger');
    if (mobileMenuBtn && mobileMenuPanel && hamburger) {
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
    }

    // Hero typing animation
    const typingElement = document.getElementById('hero-typing');
    if (typingElement) {
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
    }

    // REWRITTEN Scroll reveal animation
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.nav-link-desktop');
    if (sections.length > 0 && navLinks.length > 0) {
        const scrollObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        const linkHref = link.getAttribute('href').substring(1);
                        link.classList.toggle('active', linkHref === entry.target.id);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -60% 0px' });
        sections.forEach(sec => scrollObserver.observe(sec));
    }

    // --- TIMELINE SLIDER ---
    const timelineData = [
        { id: 'edu1', startDate: '2020-08-01', endDate: '2023-05-01', type: 'education', title: 'Biotechnology Hons.', details: 'Completed my honours degree at TNB College, Bhagalpur.' },
        { id: 'exp1', startDate: '2024-02-01', endDate: 'Present', type: 'experience', title: 'NPE Operations Team', details: 'Joined the core operations team at Bharti Airtel Head Office, Gurugram.' },
        { id: 'edu2', startDate: '2024-07-01', endDate: 'Present', type: 'education', title: 'MSc Biotechnology', details: 'Began postgraduate studies (Open and Distance Learning) at Karnataka State Open University.' },
    ];
    
    const timelineSliderTrack = document.getElementById('timeline-slider-track');
    const timelineFilters = document.getElementById('timeline-filters');
    let currentTimelineFilter = 'all';
    let currentTimelineSort = 'asc';

    function formatFullDate(dateString) {
        if (!dateString || dateString === 'Present') return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    }

    function renderTimelineCards() {
        let filteredData = timelineData;

        if (currentTimelineFilter !== 'all') {
            filteredData = timelineData.filter(item => item.type === currentTimelineFilter);
        }

        filteredData.sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            return currentTimelineSort === 'asc' ? dateA - dateB : dateB - dateA;
        });

        timelineSliderTrack.innerHTML = '';
        if (filteredData.length === 0) {
            timelineSliderTrack.innerHTML = `<div class="text-center w-full p-8 text-gray-500">No events match the current filter.</div>`;
            initializeSlider('#timeline-slider-container');
            return;
        }

        filteredData.forEach(event => {
            const card = document.createElement('div');
            card.className = 'slide';
            card.innerHTML = `
                <div class="p-6 h-full rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-4">
                            ${event.type === 'education' ? 
                                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--accent-red)]"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>` : 
                                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--accent-red)]"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`
                            }
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-white">${event.title}</h3>
                            <p class="font-mono text-xs text-red-500/80">${formatFullDate(event.startDate)} - ${formatFullDate(event.endDate)}</p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-400 flex-grow">${event.details}</p>
                </div>
            `;
            timelineSliderTrack.appendChild(card);
        });
        
        initializeSlider('#timeline-slider-container');
    }

    if (timelineFilters) {
        timelineFilters.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;
            
            const filter = e.target.dataset.filter;
            const sort = e.target.dataset.sort;

            if (filter) {
                currentTimelineFilter = filter;
                document.querySelectorAll('#timeline-filters button[data-filter]').forEach(btn => btn.classList.remove('active'));
            }
            if (sort) {
                currentTimelineSort = sort;
                document.querySelectorAll('#timeline-filters button[data-sort]').forEach(btn => btn.classList.remove('active'));
            }
            e.target.classList.add('active');
            renderTimelineCards();
        });
    }
    
    // --- GENERIC SLIDER INITIALIZATION ---
    function initializeSlider(containerSelector) {
         const container = document.querySelector(containerSelector);
         if(!container) return;
         const track = container.querySelector('.slider-track');
         if(!track) return;

        const slides = Array.from(track.children);
        const nextButton = container.parentElement.querySelector('.slider-button.next');
        const prevButton = container.parentElement.querySelector('.slider-button.prev');
        let currentIndex = 0;
        let isDragging = false, startX, currentTranslate, prevTranslate;

        const getSlidesPerView = () => {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        };

        const getSlideWidth = () => {
            return slides.length > 0 ? slides[0].clientWidth : 0;
        }

        const updateSlider = () => {
            if(slides.length === 0) {
                 if (prevButton) prevButton.style.display = 'none';
                 if (nextButton) nextButton.style.display = 'none';
                return;
            };
            const slidesPerView = getSlidesPerView();
            const slideWidth = getSlideWidth();
            currentTranslate = currentIndex * slideWidth;
            track.style.transform = `translateX(-${currentTranslate}px)`;
            
            if (prevButton) prevButton.style.display = currentIndex === 0 ? 'none' : 'flex';
            if (nextButton) nextButton.style.display = currentIndex >= slides.length - slidesPerView ? 'none' : 'flex';
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

        if(nextButton) nextButton.onclick = nextSlide;
        if(prevButton) prevButton.onclick = prevSlide;
        
        // Drag/Swipe functionality
        track.addEventListener('mousedown', dragStart);
        track.addEventListener('touchstart', dragStart, { passive: true });
        track.addEventListener('mouseup', dragEnd);
        track.addEventListener('touchend', dragEnd);
        track.addEventListener('mouseleave', dragEnd);
        track.addEventListener('mousemove', drag);
        track.addEventListener('touchmove', drag);
        
        function dragStart(e) {
            isDragging = true;
            startX = e.type === 'touchstart' ? e.touches[0].clientX : e.pageX;
            track.style.transition = 'none';
            prevTranslate = -currentIndex * getSlideWidth();
        }

        function drag(e) {
            if(!isDragging) return;
            e.preventDefault();
            const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.pageX;
            const diff = currentX - startX;
            currentTranslate = prevTranslate + diff;
            track.style.transform = `translateX(${currentTranslate}px)`;
        }

        function dragEnd(e) {
             if(!isDragging) return;
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;
            const slideWidth = getSlideWidth();
            
            if(movedBy < -50) { // Increased sensitivity
                nextSlide();
            } else if (movedBy > 50) {
                prevSlide();
            } else {
                updateSlider();
            }
            track.style.transition = 'transform 0.5s ease-in-out';
        }

        window.addEventListener('resize', () => {
            currentIndex = 0; // Reset on resize
            updateSlider();
        });

        setTimeout(updateSlider, 100);
    }

    // Initial render and setup for both sliders
    renderTimelineCards();
    initializeSlider('.slider-container');
});

