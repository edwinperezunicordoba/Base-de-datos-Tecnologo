document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.tab-panel');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');

            buttons.forEach((btn) => {
                btn.classList.remove('active', 'bg-green-600', 'text-white');
                btn.classList.add('bg-white', 'text-green-700');
            });

            button.classList.add('active', 'bg-green-600', 'text-white');
            button.classList.remove('bg-white', 'text-green-700');

            panels.forEach((panel) => {
                panel.classList.toggle('hidden', panel.id !== target);
            });
        });
    });
});
