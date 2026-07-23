document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.flip-card').forEach((card) => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('is-flipped');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('is-flipped');
        });
    });
});
