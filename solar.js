// solar.js
// Controla la velocidad de las órbitas y el brillo del sol

document.addEventListener('DOMContentLoaded', function () {
    // Control de velocidad de órbitas
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const orbits = document.querySelectorAll('.orbit');
    let baseDurations = [3, 5, 7, 9, 12, 15, 18, 21];
    function updateOrbitSpeed(mult) {
        orbits.forEach((orbit, i) => {
            let duration = baseDurations[i] / mult;
            orbit.style.animationDuration = duration + 's';
        });
        speedValue.textContent = mult.toFixed(2) + 'x';
    }
    if (speedSlider) {
        speedSlider.addEventListener('input', function () {
            updateOrbitSpeed(parseFloat(this.value));
        });
        updateOrbitSpeed(parseFloat(speedSlider.value));
    }

    // Botón para pausar/reanudar órbitas
    const toggleBtn = document.getElementById('toggle-orbits');
    let orbitsPaused = false;
    toggleBtn.addEventListener('click', function () {
        orbitsPaused = !orbitsPaused;
        orbits.forEach(orbit => {
            orbit.style.animationPlayState = orbitsPaused ? 'paused' : 'running';
        });
        toggleBtn.textContent = orbitsPaused ? 'Reanudar órbitas' : 'Pausar órbitas';
    });

    // Permitir mover planetas por su órbita con el mouse
    const planetOrbits = document.querySelectorAll('.orbit');
    planetOrbits.forEach(orbit => {
        const planet = orbit.querySelector('.planet');
        if (!planet) return;
        let dragging = false;
        let center = null;
        let radius = 0;
        let planetAngle = 0;

        planet.addEventListener('mousedown', function (e) {
            dragging = true;
            const rect = orbit.getBoundingClientRect();
            center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            const planetRect = planet.getBoundingClientRect();
            radius = rect.width / 2;
            // Calcular ángulo inicial
            const dx = planetRect.left + planetRect.width / 2 - center.x;
            const dy = planetRect.top + planetRect.height / 2 - center.y;
            planetAngle = Math.atan2(dy, dx);
            document.body.style.userSelect = 'none';
        });
        window.addEventListener('mousemove', function (e) {
            if (!dragging) return;
            const dx = e.clientX - center.x;
            const dy = e.clientY - center.y;
            planetAngle = Math.atan2(dy, dx);
            // Detener animación CSS
            orbit.style.animationPlayState = 'paused';
            // Mover planeta manualmente
            const px = Math.cos(planetAngle) * radius;
            const py = Math.sin(planetAngle) * radius;
            planet.style.left = '50%';
            planet.style.top = '50%';
            planet.style.transform = `translate(-50%, -50%) translate(${px}px, ${py}px)`;
        });
        window.addEventListener('mouseup', function () {
            if (dragging) {
                dragging = false;
                // Restaurar animación y posición
                orbit.style.animationPlayState = '';
                planet.style.left = '100%';
                planet.style.top = '50%';
                planet.style.transform = 'translate(-50%, -50%)';
                document.body.style.userSelect = '';
            }
        });
    });

    // Cambiar color del Sol
    const sunColorInput = document.getElementById('sun-color');
    const sun = document.querySelector('.sun');
    if (sunColorInput && sun) {
        sunColorInput.addEventListener('input', function () {
            const color = this.value;
            // Cambia el gradiente y todos los tonos del sol al color elegido
            sun.style.background = `radial-gradient(circle at 60% 40%, #fff 0%, ${color} 60%, ${color} 100%)`;
            sun.style.boxShadow = `0 0 120px 60px ${color}cc, 0 0 300px 120px ${color}44, 0 0 40px 10px ${color}cc`;
            sun.style.borderColor = color;
        });
    }

    // Cambiar color del fondo del universo
    const universeBgInput = document.createElement('input');
    universeBgInput.type = 'color';
    universeBgInput.value = '#000000';
    universeBgInput.id = 'universe-bg';
    universeBgInput.style.verticalAlign = 'middle';
    universeBgInput.style.marginLeft = '8px';
    const label = document.createElement('label');
    label.style.color = '#fff';
    label.style.fontSize = '1em';
    label.style.marginTop = '10px';
    label.style.display = 'inline-block';
    label.textContent = 'Fondo del universo:';
    label.appendChild(universeBgInput);
    // Insertar el control en el panel de controles
    const controlsPanel = document.querySelector('div[style*="position:fixed"]');
    if (controlsPanel) controlsPanel.appendChild(document.createElement('br'));
    if (controlsPanel) controlsPanel.appendChild(label);
    universeBgInput.addEventListener('input', function () {
        document.body.style.background = this.value;
    });
});
