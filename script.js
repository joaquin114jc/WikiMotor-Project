// ==========================================
// 1. VARIABLES GLOBALES Y ESTADO
// ==========================================
let currentAudio = null; 
let audioCtx, oscillator, gainNode;

// ==========================================
// 2. CONFIGURACIÓN INICIAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarWikiMotor();
    initThemeToggle();
    initSearch();
    initCalculator();
    initBlueprintMode();
    // initComparator(); // Asegúrate de tener esta función definida o coméntala
});

// ==========================================
// 3. GESTIÓN DE AUDIO (MOTORES)
// ==========================================
function reproducirMotor(archivo, nombreMotor = "Desconocido", tipoTransmision = "N/A") {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(`sound/${archivo}.mp3`);
    currentAudio.volume = 0.6;
    currentAudio.play().catch(e => console.warn("Audio bloqueado:", archivo));

    const displayMotor = document.getElementById('preview-motor');
    const displayTrans = document.getElementById('preview-transmision');
    
    if (displayMotor) displayMotor.innerText = nombreMotor;
    if (displayTrans) displayTrans.innerText = tipoTransmision;
}

// ==========================================
// 4. MODO BLUEPRINT (AUDIO SINTETIZADO)
// ==========================================
function startElectricHum() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillator.type = 'triangle'; 
    oscillator.frequency.setValueAtTime(35, audioCtx.currentTime); 
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.8);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
}

function stopElectricHum() {
    if (gainNode && oscillator) {
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        setTimeout(() => { try { oscillator.stop(); } catch(e){} }, 500);
    }
}

// ==========================================
// 5. COMPONENTES DE INTERFAZ Y BUSCADOR
// ==========================================
function initBlueprintMode() {
    // Referencia al botón principal (el botón "mágico")
    const botonModo = document.querySelector('.hero-btn');
    
    if (botonModo) {
        botonModo.addEventListener('click', function() {
            // A. Efecto de Flash visual
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: white; z-index: 9999; opacity: 0.3; pointer-events: none;
            `;
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 100);

            // B. Cambio de Estado y Audio
            document.body.classList.toggle('blueprint-mode');
            
            if (document.body.classList.contains('blueprint-mode')) {
                startElectricHum();
                console.log("Engineering Mode: Online");
            } else {
                stopElectricHum();
                console.log("Standard View: Online");
            }

            // C. Animación de sacudida (Feedback físico)
            this.style.animation = 'none';
            this.offsetHeight; // Forzar reflujo para reiniciar animación CSS
            this.style.animation = 'shake 0.4s ease-in-out';
        });
    }
}

function initSearch() {
    const search = document.getElementById('wiki-search');
    const status = document.getElementById('search-status');
    
    if (search) {
        search.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const articles = document.querySelectorAll('.wiki-article, .grid-card, .glossary-card');
            let foundCount = 0;

            articles.forEach(article => {
                const text = article.innerText.toLowerCase();
                if (text.includes(term)) {
                    article.style.display = "";
                    foundCount++;
                } else {
                    article.style.display = "none";
                }
            });

            if (status) {
                status.innerText = term === "" ? "READY" : `${foundCount} MATCHES FOUND`;
                status.style.color = foundCount > 0 ? "#00ff41" : "#d5001c";
            }
        });
    }
}

// ==========================================
// 6. UTILIDADES (CÁLCULO Y CARGA)
// ==========================================
function initCalculator() {
    const btn = document.getElementById('calc-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            const hp = document.getElementById('hp-input').value;
            const result = document.getElementById('result');
            if (hp && result) {
                result.innerText = (hp * 0.7457).toFixed(1);
            }
        });
    }
}

async function cargarWikiMotor() {
    const contenedor = document.getElementById('contenedor-articulos');
    if (!contenedor) return;

    try {
        const respuesta = await fetch('data.json');
        const datos = await respuesta.json();
        
        contenedor.innerHTML = datos.vehiculos.map(auto => `
            <div class="wiki-article">
                <h3>${auto.marca} ${auto.modelo}</h3>
                <p><strong>Motor:</strong> ${auto.motor}</p>
                <p><strong>Transmisión:</strong> ${auto.transmision}</p>
                <button onclick="reproducirMotor('${auto.archivo}', '${auto.motor}', '${auto.transmision}')">
                    REPRODUCIR SONIDO
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error cargando base de datos técnica:", error);
    }
}

function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => document.body.classList.toggle('dark-mode'));
}