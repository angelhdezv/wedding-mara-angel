// Countdown
(function () {
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

//Envelope
(function () {
    const screen = document.getElementById('envelope-screen');
    const envelope = screen?.querySelector('.envelope');
    if (!envelope) return;

    envelope.addEventListener('click', () => {
        envelope.classList.add('open');

        // Esperamos que se abra la solapa y suba la carta
        setTimeout(() => {
            envelope.classList.add('fade-out');
        }, 2000);

        // Luego ocultamos el overlay y mostramos la invitación
        setTimeout(() => {
            screen.classList.add('hide');
        }, 2000);
    });
})();

// === INVITADOS PERSONALIZADOS (con pantalla de carga global) ===
(async function () {
    const loaderScreen = document.getElementById('loading-screen');
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const currentPage = window.location.pathname.split('/').pop();

    if (!code && (currentPage === '' || currentPage === 'index.html')) {
        window.location.href = 'code.html';
        return;
    }

    if (currentPage === 'code.html') return;

    const guestInfoDiv = document.createElement('section');
    guestInfoDiv.classList.add('guest-info');
    document.querySelector('main').prepend(guestInfoDiv);

    try {
        // 👇 Mostrar loader
        if (loaderScreen) loaderScreen.classList.remove('hide');

        const response = await fetch(
            `https://script.google.com/macros/s/AKfycbyUQOg6Hyt_2jAkoscyLbHtK6f4VV2SC-G08NIAF6dYlEdC4EKnQFIkZOuuRp9x2WPsog/exec?code=${encodeURIComponent(code)}`
        );
        const result = await response.json();

        if (result.code !== 'ok' || !result.data) {
            window.location.href = 'code.html';
            return;
        }

        const { name, tickets } = result.data;
        const message = encodeURIComponent(
            `Hola Maraitzi & Ángel, soy ${name}, quiero confirmar la asistencia de ${tickets} persona${tickets > 1 ? 's' : ''} a su boda. 💍`
        );

        guestInfoDiv.innerHTML = `
      <p>👋 Hola <strong>${name}</strong>,</p>
      <p>Este enlace incluye <strong>${tickets}</strong> boleto${tickets > 1 ? 's' : ''} 🎟️</p>
    `;

        const confirmButton = document.querySelector('.btn.confirm');
        if (confirmButton) {
            confirmButton.href = `https://wa.me/?text=${message}`;
        }
    } catch (error) {
        console.error('Error cargando invitado:', error);
        guestInfoDiv.innerHTML = `
      <p>⚠️ No se pudo verificar tu invitación.<br>
      Intenta más tarde o contacta a los novios 💌</p>
    `;
    } finally {
        // 👇 Ocultar loader
        if (loaderScreen) loaderScreen.classList.add('hide');
    }
})();

// === VALIDACIÓN DE CÓDIGO (solo se ejecuta en code.html, con endpoint remoto) ===
(function () {
    const input = document.getElementById('code-input');
    const button = document.getElementById('code-button');
    const errorMsg = document.getElementById('error-message');
    if (!input || !button) return; // Evita correr esto en index.html

    button.addEventListener('click', async () => {
        const code = input?.value?.toLowerCase()?.trim();
        if (!code) return;
        errorMsg.classList.add("hidden");
        const loader = document.getElementById('loading-message');
        if (loader) loader.classList.remove('hidden'); // 👈 Mostrar animación

        try {
            const response = await fetch(
                `https://script.google.com/macros/s/AKfycbyUQOg6Hyt_2jAkoscyLbHtK6f4VV2SC-G08NIAF6dYlEdC4EKnQFIkZOuuRp9x2WPsog/exec?code=${encodeURIComponent(code)}`
            );
            const result = await response.json();

            if (result.code === "ok" && result.data) {
                window.location.href = `index.html?code=${encodeURIComponent(code)}`;
            } else {
                errorMsg.textContent = "⚠️ Código no encontrado, revisa tu invitación 💌";
                errorMsg.classList.remove('hidden');
            }
        } catch (err) {
            console.error("Error verificando código:", err);
            errorMsg.textContent = "⚠️ Error verificando tu código, intenta más tarde 💌";
            errorMsg.classList.remove('hidden');
        } finally {
            if (loader) loader.classList.add('hidden'); // 👈 Ocultar animación
        }
    });
})();