# 🎴 Trivia Flashcards Live: Multi-Player & Dual Engine

Una aplicación web interactiva de trivia tipo *flashcards* (tarjetas) diseñada para jugar en grupo o en solitario desde cualquier navegador. El proyecto está construido con **JavaScript modular (ES6)** y desplegado directamente en **GitHub Pages**.

---

## 🚀 Características Principales

* **🎮 Soporte Multijugador Local:** Permite de 1 a 5 jugadores con nombres y paleta de colores personalizables.
* **🌐 Doble Motor de Trivia (Dual Engine):**
  * **Español (Google Gemini API):** Preguntas generadas dinámicamente en inteligencia artificial según las categorías elegidas.
  * **Inglés (The Trivia API):** Base de datos abierta con miles de preguntas clasificadas.
* **📂 Selección de Categorías y Dificultad:** Filtrado por temas (Cine, Música, Ciencia, Geografía, Historia, etc.) y niveles de dificultad.
* **🔊 Efectos de Sonido Integrados:** Audio sintetizado en tiempo real con la **Web Audio API** nativa (sin archivos `.mp3` pesados).
* **📊 Análisis de Conocimiento y Modal de Resultados:** Marcador interactivo, desgloses por categoría y anuncio de ganador al finalizar la partida.
* **📱 Diseño Responsive & Dark Mode:** Interfaz moderna adaptada para pantallas móviles, tablets y computadoras.
* **🔒 Privacidad:** La clave de API de Gemini se almacena de forma segura en el almacenamiento local del navegador (`LocalStorage`).

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica.
* **CSS3:** Variables, Grid, Flexbox y animación 3D para el volteo de tarjetas (*flip effect*).
* **JavaScript (ES6+):** Arquitectura totalmente modular usando `import` / `export` nativo.
* **Google Gemini API & The Trivia API:** Motores externos de preguntas.
* **Web Audio API:** Generación de sonidos mediante código.

---

## 📂 Estructura del Proyecto

El proyecto sigue el principio de **separación de responsabilidades (Separation of Concerns)** para facilitar su mantenimiento y escalabilidad:

```text
trivia/
│
├── index.html              # Punto de entrada HTML
│
├── css/                    # Hojas de estilo modulares
│   ├── base.css            # Normalización, variables y estilos generales
│   ├── setup.css           # Estilos de la pantalla de configuración
│   ├── game.css            # Estilos del tablero y tarjetas
│   └── modal.css           # Estilos de la ventana de resultados
│
└── js/                     # Lógica JavaScript (ES6 Modules)
    ├── main.js             # Punto de entrada e inicialización principal
    ├── state.js            # Estado global del juego
    ├── storage.js          # Manejo de LocalStorage (API Keys)
    ├── audio.js            # Sintetizador de efectos de sonido
    ├── i18n.js             # Gestión de idioma (Español / Inglés)
    ├── api/                # Conectores de APIs externas
    │   ├── gemini.js       # Integración con Google Gemini AI
    │   └── trivia-api.js   # Integración con The Trivia API
    └── ui/                 # Controladores de interfaz de usuario
        ├── setupUI.js      # Lógica de la pantalla de configuración
        ├── gameUI.js       # Lógica del tablero de juego
        └── modalUI.js      # Lógica del modal de ganador y estadísticas