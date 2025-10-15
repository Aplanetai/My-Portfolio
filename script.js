document.addEventListener('DOMContentLoaded', () => {
    const tileContainer = document.getElementById('tile-container');

    new Sortable(tileContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
    });

    const navToggle = document.getElementById('nav-toggle');
    const navPanel = document.getElementById('nav-panel');
    const navLinks = navPanel.querySelectorAll('a');

    const closeNav = () => {
        navToggle.classList.remove('nav-open');
        navPanel.classList.remove('open');
    };

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('nav-open');
        navPanel.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (navPanel.classList.contains('open') && !navPanel.contains(e.target) && !navToggle.contains(e.target)) {
            closeNav();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });


    const searchBar = document.getElementById('search-bar');
    const allTiles = Array.from(document.querySelectorAll('#tile-container > .tile'));
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        allTiles.forEach(tile => {
            const content = tile.dataset.content.toLowerCase();
            if (content.includes(searchTerm)) {
                tile.classList.remove('hidden');
            } else {
                tile.classList.add('hidden');
            }
        });
    });

    const filterContainer = document.getElementById('timeline-filters');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const linkedTiles = document.querySelectorAll('.experience-linked');
    
    filterContainer.addEventListener('click', (e) => {
        if (e.target.matches('.filter-btn')) {
            const filter = e.target.dataset.filter;
            const currentActive = filterContainer.querySelector('.filter-btn.active');
            if (currentActive) {
                currentActive.classList.remove('active', 'bg-red-600');
                 if(currentActive.dataset.filter === 'all') {
                   currentActive.classList.add('bg-gray-600');
                } else {
                   currentActive.classList.add('bg-gray-800');
                }
            }
            e.target.classList.add('active', 'bg-red-600');
            e.target.classList.remove('bg-gray-800', 'bg-gray-600');

            timelineItems.forEach(item => {
                const yearRange = item.dataset.year;
                let show = false;
                if (filter === 'all' || yearRange.includes(filter) || (filter === 'present' && yearRange.includes('present'))) {
                   show = true;
                }
                item.style.display = show ? 'block' : 'none';
            });

            linkedTiles.forEach(tile => {
                const yearRange = tile.dataset.year;
                 let show = false;
                if (filter === 'all' || yearRange.includes(filter) || (filter === 'present' && yearRange.includes('present'))) {
                   show = true;
                }
                tile.classList.toggle('hidden', !show);
            });
        }
    });

    const floatingButton = document.getElementById('nav-toggle');
    const hamburgerLines = floatingButton.querySelectorAll('.hamburger-line');

    const getLuminance = (color) => {
        const rgb = color.match(/\d+/g);
        if (!rgb) return 0;
        const [r, g, b] = rgb.map(c => {
            c /= 255.0;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const updateButtonContrast = () => {
        if (!floatingButton) return;
        const rect = floatingButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const elementsUnder = document.elementsFromPoint(centerX, centerY);
        let bgColor = 'rgb(17, 24, 39)';
        
        for (const element of elementsUnder) {
            if (element.id !== 'nav-toggle') {
                const style = window.getComputedStyle(element);
                const color = style.backgroundColor;
                if (color && color !== 'rgba(0, 0, 0, 0)') {
                    bgColor = color;
                    break;
                }
            }
        }
        
        const luminance = getLuminance(bgColor);
        const iconColor = luminance > 0.5 ? '#111827' : '#FFFFFF';
        
        hamburgerLines.forEach(line => {
            line.style.backgroundColor = iconColor;
        });
    };
    
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            if (!inThrottle) {
                func.apply(this, arguments);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };
    
    const throttledContrastUpdate = throttle(updateButtonContrast, 100);
    updateButtonContrast();
    window.addEventListener('scroll', throttledContrastUpdate);
    window.addEventListener('resize', throttledContrastUpdate);

    const processTile = document.querySelector('[data-content*="my process"]');
    if (processTile) {
        const processContainer = processTile.querySelector('.process-container');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    processContainer.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(processTile);
    }
});
