(function() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;

    const daysEl = countdown.querySelector('.days');
    const hoursEl = countdown.querySelector('.hours');
    const minutesEl = countdown.querySelector('.minutes');
    const secondsEl = countdown.querySelector('.seconds');

    const targetDate = new Date('2026-01-31T13:00:00-06:00');

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            daysEl.textContent = 0;
            hoursEl.textContent = 0;
            minutesEl.textContent = 0;
            secondsEl.textContent = 0;
            clearInterval(interval);
            return;
        }

        const seconds = Math.floor(diff / 1000) % 60;
        const minutes = Math.floor(diff / (1000 * 60)) % 60;
        const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        daysEl.textContent = days;
        hoursEl.textContent = hours;
        minutesEl.textContent = minutes;
        secondsEl.textContent = seconds;
    }

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
})();

(function() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const imageFiles = ['1.jpeg', '2.jpeg', '3.jpeg'];
    const items = [];

    imageFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');

        const img = document.createElement('img');
        img.src = `images/us/${file}`;
        img.alt = `Imagen ${index + 1}`;
        img.classList.add('carousel-img');

        item.appendChild(img);
        carousel.appendChild(item);
        items.push(item);
    });

    let currentIndex = 0;

    function showIndex(index) {
        const itemWidth = items[0].getBoundingClientRect().width;
        carousel.style.transform = `translateX(-${index * itemWidth}px)`;
        items.forEach((item, idx) => {
            item.classList.toggle('active', idx === index);
        });
    }

    function next() {
        currentIndex = (currentIndex + 1) % items.length;
        showIndex(currentIndex);
    }

    showIndex(0);
    setInterval(next, 1500);

    window.addEventListener('resize', () => showIndex(currentIndex));
})();
