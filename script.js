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

// === INVITADOS PERSONALIZADOS + CONFIRMACIÓN ===
(async function () {
    const loaderScreen = document.getElementById("loading-screen");
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const currentPage = window.location.pathname.split("/").pop();

    if (!code && (currentPage === "" || currentPage === "index.html")) {
        window.location.href = "code.html";
        return;
    }

    if (currentPage === "code.html") return;

    const guestInfoDiv = document.createElement("section");
    guestInfoDiv.classList.add("guest-info");
    document.querySelector("main").prepend(guestInfoDiv);

    try {
        if (loaderScreen) loaderScreen.classList.remove("hide");

        const res = await fetch(
            `https://script.google.com/macros/s/AKfycbyPwS5RJsxdnrsbJpcaIGSlYcsHfC7PtqudxcX87EGab1cDGmDgW_vQT5uxaJlsbGsDmA/exec?code=${encodeURIComponent(code)}`
        );
        const result = await res.json();
        if (result.code !== "ok" || !result.data) throw new Error("not found");

        const { name, tickets, confirmation } = result.data;

        guestInfoDiv.innerHTML = `
      <p>👋 Hola <strong>${name}</strong>,</p>
      <p>Este enlace incluye <strong>${tickets}</strong> boleto${tickets > 1 ? "s" : ""} 🎟️</p>
      <div id="confirmed-message" class="hidden"></div>
      <div class="actions">
        <a id="confirm-button" class="btn confirm" href="#">Confirmar asistencia</a>
      </div>
    `;

        const confirmBtn = document.getElementById("confirm-button");
        const confirmedMessage = document.getElementById("confirmed-message");

        // ✅ Si ya confirmó, ocultamos botón y mostramos mensaje
        if (confirmation?.isConfirmed) {
            confirmBtn.classList.add("hidden");
            confirmedMessage.classList.remove("hidden");
            const date = confirmation.date_of_confirmation
                ? new Date(confirmation.date_of_confirmation).toLocaleString("es-MX")
                : "fecha desconocida";
            confirmedMessage.innerHTML = `
        🎉 ¡Gracias, <strong>${name}</strong>!<br>
        Confirmaste la asistencia de <strong>${confirmation.guests}</strong> persona${confirmation.guests > 1 ? "s" : ""}<br>
        el día <em>${date}</em> 💍✨
      `;
            return;
        }

        // ✅ Si no ha confirmado, mostrar modal
        confirmBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(tickets, name, code);
        });
    } catch (error) {
        console.error("Error:", error);
        window.location.href = `code.html`;
        return;
    } finally {
        if (loaderScreen) loaderScreen.classList.add("hide");
    }
})();

// === MODAL LOGIC ===
function openModal(maxTickets, name, code) {
    const modal = document.getElementById("confirmation-modal");
    const closeBtn = document.getElementById("modal-close");
    const stepInitial = document.getElementById("modal-step-initial");
    const stepCustom = document.getElementById("modal-step-custom");
    const stepFinal = document.getElementById("modal-step-final");
    const stepSuccess = document.getElementById("modal-step-success");
    const guestCount = document.getElementById("guest-count");

    const confirmAll = document.getElementById("confirm-all");
    const confirmCustom = document.getElementById("confirm-custom");
    const confirmCustomSend = document.getElementById("confirm-custom-send");
    const cancelCustom = document.getElementById("cancel-custom");
    const confirmFinal = document.getElementById("confirm-final");
    const cancelFinal = document.getElementById("cancel-final");
    const closeSuccess = document.getElementById("close-success");

    modal.classList.remove("hidden");
    guestCount.max = maxTickets;
    guestCount.value = 1;

    const showStep = (step) => {
        [stepInitial, stepCustom, stepFinal, stepSuccess].forEach((el) =>
            el.classList.add("hidden")
        );
        step.classList.remove("hidden");
    };

    closeBtn.onclick = () => modal.classList.add("hidden");

    confirmAll.onclick = () => {
        stepFinal.dataset.guests = maxTickets;
        showStep(stepFinal);
    };
    confirmCustom.onclick = () => showStep(stepCustom);
    cancelCustom.onclick = () => showStep(stepInitial);
    cancelFinal.onclick = () => showStep(stepInitial);

    confirmCustomSend.onclick = () => {
        const count = parseInt(guestCount.value, 10);
        if (count < 1 || count > maxTickets) {
            alert(`Por favor, ingresa un número válido de asistentes entre 1 y ${maxTickets}.`);
            return;
        }
        stepFinal.dataset.guests = count;
        showStep(stepFinal);
    };

    confirmFinal.onclick = async () => {
        const guests = parseInt(stepFinal.dataset.guests || maxTickets, 10);
        await sendConfirmation(code, guests, name, modal, showStep, stepSuccess);
    };

    closeSuccess.onclick = () => modal.classList.add("hidden");
}

// === ENVÍO DE CONFIRMACIÓN AL BACKEND ===
async function sendConfirmation(code, guests, name, modal, showStep, stepSuccess) {
    const confirmFinal = document.getElementById("confirm-final");
    const originalText = confirmFinal.textContent;
    const confirmedMessage = document.getElementById("confirmed-message");
    const confirmBtn = document.getElementById("confirm-button");

    try {
        confirmFinal.disabled = true;
        confirmFinal.textContent = "Confirmando...";
        confirmFinal.classList.add("loading");

        // ✅ Abrir WhatsApp inmediatamente (antes del fetch)
        const msg = encodeURIComponent(
            `Hola Maraitzi & Ángel, soy ${name}, confirmo la asistencia de ${guests} persona${guests > 1 ? "s" : ""} 💍`
        );
        window.open(`https://wa.me/?text=${msg}`, "_blank");

        // Luego enviar la confirmación al backend
        const res = await fetch(
            "https://script.google.com/macros/s/AKfycbyPwS5RJsxdnrsbJpcaIGSlYcsHfC7PtqudxcX87EGab1cDGmDgW_vQT5uxaJlsbGsDmA/exec",
            {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ code, guests }),
            }
        );

        const result = await res.json();

        if (result.code === "ok") {
            showStep(stepSuccess);

            const date = new Date().toLocaleString("es-MX");
            if (confirmedMessage && confirmBtn) {
                confirmBtn.classList.add("hidden");
                confirmedMessage.classList.remove("hidden");
                confirmedMessage.innerHTML = `
          🎉 ¡Gracias, <strong>${name}</strong>!<br>
          Confirmaste la asistencia de <strong>${guests}</strong> persona${guests > 1 ? "s" : ""}<br>
          el día <em>${date}</em> 💍✨
        `;
            }
        } else {
            alert("Ocurrió un error al guardar la confirmación.");
        }
    } catch (err) {
        console.error(err);
        alert("Error al enviar confirmación. Intenta más tarde 💌");
    } finally {
        confirmFinal.disabled = false;
        confirmFinal.textContent = originalText;
        confirmFinal.classList.remove("loading");
    }
}

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
                `https://script.google.com/macros/s/AKfycbyPwS5RJsxdnrsbJpcaIGSlYcsHfC7PtqudxcX87EGab1cDGmDgW_vQT5uxaJlsbGsDmA/exec?code=${encodeURIComponent(code)}`
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

function downloadICS(type) {
    let title, location, start, end, description;

    if (type === "ceremonia") {
        title = "Ceremonia Religiosa - Boda de Maraitzi & Ángel 💒";
        location = "Iglesia del Señor del Perdón, Santa Cruz, Teoloyucan, México";
        start = "20260131T184500Z"; // 12:45 hora CDMX = 18:45 UTC
        end = "20260131T203000Z";
        description = "Ceremonia religiosa de Maraitzi & Ángel 💍";
    } else if (type === "recepcion") {
        title = "Recepción - Boda de Maraitzi & Ángel 🥂";
        location = "Salón de Eventos Granja María Elena, Santiago, Teoloyucan, México";
        start = "20260131T210000Z"; // 14:00 hora CDMX = 20:00 UTC
        end = "20260201T050000Z";   // hasta 8 p.m. aprox
        description = "Recepción y celebración de la boda 💃✨";
    }

    // 🔥 ICS limpio y 100% compatible
    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "CALSCALE:GREGORIAN",
        "PRODID:-//Maraitzi&Angel//Boda//ES",
        "BEGIN:VEVENT",
        `UID:${type}@boda-maraitzi-angel.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${title}`,
        `LOCATION:${location}`,
        `DESCRIPTION:${description}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Boda-Maraitzi-Angel-${type}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}