document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.relaciones-carousel').forEach(function (carousel) {
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        let activeIndex = slides.findIndex(function (slide) {
            return slide.classList.contains('active');
        });
        let timer;
        const previousButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');

        if (activeIndex < 0) {
            activeIndex = 0;
        }

        function render() {
            slides.forEach(function (slide, index) {
                const position = (index - activeIndex + slides.length) % slides.length;
                const isActive = position === 0;

                slide.classList.toggle('active', isActive);
                slide.dataset.position = position === 0 ? 'center' : position === 1 ? 'right' : 'left';
                slide.setAttribute('aria-hidden', String(!isActive));
            });
        }

        function nextSlide() {
            activeIndex = (activeIndex + 1) % slides.length;
            render();
        }

        function previousSlide() {
            activeIndex = (activeIndex - 1 + slides.length) % slides.length;
            render();
        }

        function start() {
            stop();
            timer = window.setInterval(nextSlide, Number(carousel.dataset.carouselInterval) || 4000);
        }

        function stop() {
            window.clearInterval(timer);
        }

        function restart() {
            stop();
            start();
        }

        render();
        previousButton.addEventListener('click', function () {
            previousSlide();
            restart();
        });
        nextButton.addEventListener('click', function () {
            nextSlide();
            restart();
        });
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        carousel.addEventListener('focusin', stop);
        carousel.addEventListener('focusout', start);
        start();
    });
});