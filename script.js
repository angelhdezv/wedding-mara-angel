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
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const imageFiles = ['1.jpeg', '2.jpeg', '3.jpeg'];
    const images = [];

    imageFiles.forEach((file, index) => {
        const img = document.createElement('img');
        img.src = `images/us/${file}`;
        img.alt = `Imagen ${index + 1}`;
        track.appendChild(img);
        images.push(img);
    });

    let currentIndex = 0;

    function showIndex() {
        const slideWidth = images[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        images.forEach((img, idx) => {
            img.classList.toggle('active', idx === currentIndex);
        });
    }

    function next() {
        currentIndex = (currentIndex + 1) % images.length;
        showIndex();
    }

    showIndex();
    setInterval(next, 3000);

    window.addEventListener('resize', showIndex);
})();
