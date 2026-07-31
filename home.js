const mobileBtn = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu-panel');

        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        const bgSlides = document.querySelectorAll('.bg-slide');
        const slideTexts = document.querySelectorAll('.slide-text');
        const prevBtns = document.querySelectorAll('.prev-slide-btn');
        const nextBtns = document.querySelectorAll('.next-slide-btn');
        const pauseBtns = document.querySelectorAll('.pause-slide-btn');
        
        const currentNumEls = document.querySelectorAll('.current-num');
        const totalNumEls = document.querySelectorAll('.total-num');
        const slideProgressEls = document.querySelectorAll('.slide-progress');

        const heroSlider = document.getElementById('hero-slider');
        
        let currentSlide = 0;
        let slideTimer;
        let isPaused = false;
        const slideIntervalTime = 5000;

        totalNumEls.forEach(el => el.textContent = String(bgSlides.length).padStart(2, '0'));

        function updateSlideClasses() {
            bgSlides.forEach((slide, index) => {
                slide.classList.toggle('opacity-100', index === currentSlide);
                slide.classList.toggle('opacity-0', index !== currentSlide);
            });

            slideTexts.forEach((textBlock, index) => {
                if (index === currentSlide) {
                    textBlock.classList.remove('opacity-0', 'pointer-events-none');
                    textBlock.classList.add('opacity-100');
                } else {
                    textBlock.classList.remove('opacity-100');
                    textBlock.classList.add('opacity-0', 'pointer-events-none');
                }
            });

            const currentStr = String(currentSlide + 1).padStart(2, '0');
            currentNumEls.forEach(el => el.textContent = currentStr);
        }

        function startProgress() {
            if (isPaused) return;
            slideProgressEls.forEach(bar => {
                if (!bar) return;
                bar.style.transition = 'none';
                bar.style.width = '0%';
                void bar.offsetWidth;
                bar.style.transition = `width ${slideIntervalTime}ms linear`;
                bar.style.width = '100%';
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % bgSlides.length;
            updateSlideClasses();
            startProgress();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + bgSlides.length) % bgSlides.length;
            updateSlideClasses();
            startProgress();
        }

        function resetTimer() {
            clearInterval(slideTimer);
            startProgress();
            if (!isPaused) {
                slideTimer = setInterval(nextSlide, slideIntervalTime);
            }
        }

        function togglePlayPause() {
            isPaused = !isPaused;
            
            if (isPaused) {
                clearInterval(slideTimer);
                slideProgressEls.forEach(bar => {
                    const computedWidth = window.getComputedStyle(bar).width;
                    bar.style.transition = 'none';
                    bar.style.width = computedWidth;
                });
            } else {
                nextSlide();
                resetTimer();
            }

            pauseBtns.forEach(btn => {
                const pauseIcon = btn.querySelector('.pause-icon');
                const playIcon = btn.querySelector('.play-icon');
                if (!pauseIcon || !playIcon) return;
                if (isPaused) {
                    pauseIcon.classList.add('hidden');
                    playIcon.classList.remove('hidden');
                } else {
                    pauseIcon.classList.remove('hidden');
                    playIcon.classList.add('hidden');
                }
            });
        }

        pauseBtns.forEach(btn => {
            btn.addEventListener('click', togglePlayPause);
        });

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                nextSlide();
                resetTimer();
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                prevSlide();
                resetTimer();
            });
        });

        if (heroSlider) {
            heroSlider.addEventListener('click', (e) => {
                if (e.target.closest('button') || e.target.closest('a')) return;
                togglePlayPause();
            });
        }

        slideTimer = setInterval(nextSlide, slideIntervalTime);
        startProgress();
