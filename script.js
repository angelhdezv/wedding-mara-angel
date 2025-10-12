const DBInvitados = {
  "Pruebita": 1,
  "Pruebitita": 2
};

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

// === INVITADOS PERSONALIZADOS ===
(async function () {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get('nombre');
  if (!nombre) return;

  const guestInfoDiv = document.createElement('section');
  guestInfoDiv.classList.add('guest-info');
  document.querySelector('main').prepend(guestInfoDiv);

  try {
    const data = DBInvitados;

    console.log("data: "+data)

    console.log("nombre: "+nombre)
    const boletos = data[nombre];
    console.log("boletos: "+boletos)
    if (boletos) {
      guestInfoDiv.innerHTML = `
        <p>👋 Hola <strong>${decodeURIComponent(nombre)}</strong>,</p>
        <p>Este enlace incluye <strong>${boletos}</strong> boleto${boletos > 1 ? 's' : ''} 🎟️</p>
      `;
    } else {
      guestInfoDiv.innerHTML = `
        <p>👋 Hola <strong>${decodeURIComponent(nombre)}</strong>,</p>
        <p>No encontramos boletos asignados a este enlace 😔.<br>
        Por favor contacta a Maraitzi o Ángel 💌</p>
      `;
    }
  } catch (error) {
    console.error('Error cargando DBInvitados.json:', error);
    guestInfoDiv.innerHTML = `
      <p>⚠️ No se pudo verificar tu invitación en este momento.<br>
      Intenta más tarde o contacta a los novios 💌</p>
    `;
  }
})();