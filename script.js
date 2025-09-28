document.addEventListener('DOMContentLoaded', () => {
    // --- MAIN SITE LOGIC ---

    const select = (el, all = false) => all ? document.querySelectorAll(el) : document.querySelector(el);
    const header = select('#main-header');
    if (header) { window.addEventListener('scroll', () => { window.scrollY > 50 ? header.classList.add('scrolled') : header.classList.remove('scrolled'); }); }
    const mobileMenuBtn = select('#mobile-menu-btn');
    const mobileMenuPanel = select('#mobile-menu-panel');
    const hamburger = select('.hamburger');
    if (mobileMenuBtn && mobileMenuPanel && hamburger) { mobileMenuBtn.addEventListener('click', () => { mobileMenuPanel.classList.toggle('translate-x-full'); hamburger.classList.toggle('active'); }); select('.mobile-nav-link', true).forEach(link => { link.addEventListener('click', () => { mobileMenuPanel.classList.add('translate-x-full'); hamburger.classList.remove('active'); }); }); }
    const typingElement = select('#hero-typing');
    if (typingElement) { const words = ["clear, actionable insights.", "efficient automated systems.", "operational excellence."]; let wordIndex = 0, charIndex = 0, isDeleting = false; const type = () => { const currentWord = words[wordIndex]; let timeout = isDeleting ? 50 : 120; if (isDeleting) { typingElement.textContent = currentWord.substring(0, charIndex - 1); charIndex--; } else { typingElement.textContent = currentWord.substring(0, charIndex + 1); charIndex++; } if (!isDeleting && charIndex === currentWord.length) { isDeleting = true; timeout = 2000; } else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; timeout = 500; } setTimeout(type, timeout); }; type(); }
    const sections = select('main section', true);
    const navLinks = select('.nav-link-desktop', true);
    if (sections.length && navLinks.length) { const scrollObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { navLinks.forEach(link => { link.classList.toggle('active', link.getAttribute('href').substring(1) === entry.target.id); }); } }); }, { rootMargin: '-40% 0px -60% 0px' }); sections.forEach(sec => scrollObserver.observe(sec)); }
    const timelineData = [ { id: 'edu1', startDate: '2020-08-01', endDate: '2023-05-01', type: 'education', title: 'Biotechnology Hons.', details: 'Completed my honours degree at TNB College, Bhagalpur.' }, { id: 'exp1', startDate: '2024-02-01', endDate: 'Present', type: 'experience', title: 'NPE Operations Team', details: 'Joined the core operations team at Bharti Airtel Head Office, Gurugram.' }, { id: 'edu2', startDate: '2024-07-01', endDate: 'Present', type: 'education', title: 'MSc Biotechnology', details: 'Began postgraduate studies (ODL) at Karnataka State Open University.' }, ];
    const timelineSliderTrack = select('#timeline-slider-track');
    const timelineFilters = select('#timeline-filters');
    let currentTimelineFilter = 'all';
    let currentTimelineSort = 'desc';
    const formatFullDate = (dateString) => { if (!dateString || dateString === 'Present') return 'Present'; const date = new Date(dateString); return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }); }
    const renderTimelineCards = () => { if (!timelineSliderTrack) return; let filteredData = (currentTimelineFilter === 'all') ? timelineData : timelineData.filter(item => item.type === currentTimelineFilter); filteredData.sort((a, b) => { const dateA = new Date(a.startDate); const dateB = new Date(b.startDate); return currentTimelineSort === 'asc' ? dateA - dateB : dateB - dateA; }); timelineSliderTrack.innerHTML = filteredData.length === 0 ? `<div class="text-center w-full p-8 text-gray-500">No events match the current filter.</div>` : filteredData.map(event => ` <div class="slide"> <div class="slide-content p-6 h-full rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col"> <div class="flex items-center mb-4"> <div class="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-4 flex-shrink-0"> ${event.type === 'education' ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--accent-red)]"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--accent-red)]"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`} </div> <div> <h3 class="text-lg font-bold text-white">${event.title}</h3> <p class="font-mono text-xs text-[var(--accent-red)]/80">${formatFullDate(event.startDate)} - ${formatFullDate(event.endDate)}</p> </div> </div> <p class="text-sm text-gray-400 flex-grow">${event.details}</p> </div> </div> `).join(''); initializeSlider('#timeline-slider-container'); }
    if (timelineFilters) { timelineFilters.addEventListener('click', (e) => { if (e.target.tagName !== 'BUTTON') return; const filter = e.target.dataset.filter; const sort = e.target.dataset.sort; if (filter) { currentTimelineFilter = filter; select('#timeline-filters button[data-filter]', true).forEach(btn => btn.classList.remove('active')); } if (sort) { currentTimelineSort = sort; select('#timeline-filters button[data-sort]', true).forEach(btn => btn.classList.remove('active')); } e.target.classList.add('active'); renderTimelineCards(); }); }
    function initializeSlider(containerSelector) { const container = select(containerSelector); if(!container) return; const track = container.querySelector('.slider-track'); const nextButton = container.parentElement.querySelector('.slider-button.next'); const prevButton = container.parentElement.querySelector('.slider-button.prev'); if(!track) return; let slides = Array.from(track.children); let currentIndex = 0; let isDragging = false, startX, currentTranslate, prevTranslate; const getSlidesPerView = () => (window.innerWidth >= 1024) ? 3 : (window.innerWidth >= 768) ? 2 : 1; const getSlideWidth = () => slides.length > 0 ? slides[0].clientWidth : 0; const updateSlider = (animate = true) => { if (slides.length === 0) { if (prevButton) prevButton.style.display = 'none'; if (nextButton) nextButton.style.display = 'none'; return; } const slidesPerView = getSlidesPerView(); const maxIndex = Math.max(0, slides.length - slidesPerView); if (currentIndex > maxIndex) currentIndex = maxIndex; if (currentIndex < 0) currentIndex = 0; const slideWidth = getSlideWidth(); currentTranslate = currentIndex * slideWidth; track.style.transition = animate ? 'transform 0.4s ease-out' : 'none'; track.style.transform = `translateX(-${currentTranslate}px)`; if (prevButton) prevButton.style.display = currentIndex === 0 ? 'none' : 'flex'; if (nextButton) nextButton.style.display = currentIndex >= maxIndex ? 'none' : 'flex'; const centerIndex = Math.floor(currentIndex + (slidesPerView - 1) / 2); slides.forEach((slide, index) => { slide.classList.toggle('active-slide', index === centerIndex); }); }; const moveSlide = (direction) => { const slidesPerView = getSlidesPerView(); const maxIndex = slides.length - slidesPerView; currentIndex += direction; if (currentIndex < 0) currentIndex = 0; if (currentIndex > maxIndex) currentIndex = maxIndex; updateSlider(); }
    if (nextButton) nextButton.onclick = () => moveSlide(1); if (prevButton) prevButton.onclick = () => moveSlide(-1); slides.forEach((slide, index) => { slide.addEventListener('click', () => { if (isDragging) return; const slidesPerView = getSlidesPerView(); const maxIndex = Math.max(0, slides.length - slidesPerView); let newCurrentIndex = Math.round(index - (slidesPerView - 1) / 2); newCurrentIndex = Math.max(0, Math.min(newCurrentIndex, maxIndex)); currentIndex = newCurrentIndex; updateSlider(); }); }); const dragStart = (e) => { isDragging = false; setTimeout(() => isDragging = true, 150); startX = e.type === 'touchstart' ? e.touches[0].clientX : e.pageX; track.style.transition = 'none'; prevTranslate = -currentIndex * getSlideWidth(); track.style.cursor = 'grabbing'; }
    const drag = (e) => { if(!track.style.cursor.includes('grabbing')) return; const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.pageX; const diff = currentX - startX; currentTranslate = prevTranslate + diff; track.style.transform = `translateX(${currentTranslate}px)`; }
    const dragEnd = () => { if(!track.style.cursor.includes('grabbing')) return; track.style.cursor = 'grab'; const movedBy = currentTranslate - prevTranslate; if(movedBy < -75) moveSlide(1); else if (movedBy > 75) moveSlide(-1); else updateSlider(); setTimeout(() => isDragging = false, 50); }
    track.addEventListener('mousedown', dragStart); track.addEventListener('touchstart', dragStart, { passive: true }); track.addEventListener('mouseup', dragEnd); track.addEventListener('mouseleave', dragEnd); track.addEventListener('touchend', dragEnd); track.addEventListener('mousemove', drag); track.addEventListener('touchmove', drag); if (container._sliderResizeHandler) { window.removeEventListener('resize', container._sliderResizeHandler); } container._sliderResizeHandler = () => { slides = Array.from(track.children); updateSlider(false); }; window.addEventListener('resize', container._sliderResizeHandler); setTimeout(() => { slides = Array.from(track.children); updateSlider(false); }, 100); }
    renderTimelineCards();
    initializeSlider('#projects-slider-container');
    
    // --- PLEXUS BACKGROUND LOGIC ---
    
    const canvas = document.getElementById('plexus-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // --- Configurable Parameters ---
    const PARTICLE_COUNT = 80;
    const MAX_LINK_DISTANCE = 120;
    const PARTICLE_SPEED = 0.5;
    const PARTICLE_COLOR = 'rgba(200, 200, 200, 0.5)';
    const LINE_COLOR = 'rgba(228, 0, 0, 0.4)'; // Using your accent red color with opacity

    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
            this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
            this.radius = Math.random() * 1.5 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = PARTICLE_COLOR;
            ctx.fill();
        }
    }

    function init() {
        resizeCanvas();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < MAX_LINK_DISTANCE) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = LINE_COLOR;
                    ctx.lineWidth = 1 - distance / MAX_LINK_DISTANCE; // Line gets thinner as it gets longer
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();
});
