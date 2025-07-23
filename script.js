// Countdown
(function() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;

    const dynamicEl = document.getElementById('countdown-dynamic');

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
            if (dynamicEl) {
                dynamicEl.textContent = '0 días, 0 horas, 0 minutos y 0 segundos';
            }
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

        if (dynamicEl) {
            dynamicEl.textContent = `${days} días, ${hours} horas, ${minutes} minutos y ${seconds} segundos`;
        }
    }

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
})();

// Carrusel estilo Polaroid
(function () {
    const container = document.querySelector('.carousel-polaroid');
    if (!container) return;

    const imageFiles = ['1.jpeg', '2.jpeg', '3.jpeg'];
    const images = [];

    imageFiles.forEach((file, index) => {
        const img = document.createElement('img');
        img.className = 'polaroid-image';
        img.src = `images/us/${file}`;
        img.alt = `Imagen ${index + 1}`;
        container.appendChild(img);
        images.push(img);
    });

    let currentIndex = 0;

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }

    showImage(currentIndex);

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }, 5000); // 5 segundos
})();
