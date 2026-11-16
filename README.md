<div align="center">

# R O R O 

### *Seis meses. Seis apagones. Un golpe en la puerta.*

**Thriller psicológico · Sigilo · Aventura narrativa · 2D top-down · Pixel art**

<br>

![Phaser](https://img.shields.io/badge/Phaser-3.90.0-8A2BE2?style=for-the-badge&labelColor=14121b)
![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-e0b354?style=for-the-badge&logo=javascript&logoColor=14121b&labelColor=14121b)
![Vite](https://img.shields.io/badge/Vite-8.3.8-646CFF?style=for-the-badge&logo=vite&logoColor=white&labelColor=14121b)
<br>
![HTML5](https://img.shields.io/badge/HTML5-Canvas_/_WebGL-d65a5a?style=flat-square&logo=html5&logoColor=white&labelColor=14121b)
![CSS3](https://img.shields.io/badge/CSS3-estilos-5a4a6e?style=flat-square&logo=css3&logoColor=white&labelColor=14121b)
![Node.js](https://img.shields.io/badge/Node.js-%5E20.19_%7C_%E2%89%A522.12-7fc28a?style=flat-square&logo=nodedotjs&logoColor=white&labelColor=14121b)
![Idiomas](https://img.shields.io/badge/idiomas-ES_%7C_EN-a89bb5?style=flat-square&labelColor=14121b)
![Plataforma](https://img.shields.io/badge/plataforma-navegador_web-f2e9dc?style=flat-square&labelColor=14121b)

<br>

> *El detective ya está dentro del apartamento.*
> *Encuentra las pruebas. Escóndelas. No dejes que encuentre suficientes.*

</div>

---

##  Índice

1. [Acerca del juego](#-acerca-del-juego)
2. [Características](#-características)
3. [Tecnologías utilizadas](#-tecnologías-utilizadas)
4. [Instalación y ejecución](#-instalación-y-ejecución)
5. [Controles](#-controles)
6. [Estructura del proyecto](#-estructura-del-proyecto)
7. [Arquitectura](#-arquitectura)
8. [Recursos y créditos](#-recursos-y-créditos)
9. [Equipo de desarrollo](#-equipo-de-desarrollo)
10. [Estado del proyecto](#-estado-del-proyecto)

---

## 🕯️ Acerca del juego

### La historia

Desde hace **seis meses**, Roro despierta cada mañana sin recordar nada de la noche anterior. Cada mes aparece algo nuevo en su apartamento: ropa ensangrentada, objetos que pertenecen a desconocidos, un arma y una nota con un nombre.

Con el tiempo, Roro ha aprendido una rutina: **encontrarlo todo, esconderlo todo y olvidar**.

Pero este es el sexto mes, y esta vez alguien llama a la puerta antes de que la rutina termine. Es la policía. Un detective entra al apartamento para investigar una muerte en el edificio.

### El objetivo

Controlas a Roro dentro de su apartamento. Debes **encontrar y esconder seis pruebas** antes de que el detective reúna las suficientes para resolver el caso:

| Prueba | Cantidad | Ubicación inicial |
|---|:---:|---|
| Pertenencias de la víctima (globo terráqueo, adornos de estrellas, lámpara azul, mapa enmarcado) | 4 | Aleatoria, entre puntos válidos predefinidos |
| Bate de béisbol (el arma del crimen) | 1 | Fija, en el dormitorio |
| Nota con el nombre de la víctima | 1 | Fija, en la sala de estar |

Cada prueba escondida suma **1 punto** (máximo **6**).

### Mecánicas principales

- **Llevar y esconder.** Roro solo puede cargar **un objeto a la vez**. Debe llevarlo a uno de los **16 escondites** del apartamento y pulsar `E`. Los objetos escondidos pueden recuperarse y moverse a otro lugar (el punto se resta y se vuelve a sumar).
- **La nota.** Primero se lee: se abre una vista ampliada del papel con el nombre de la víctima y el juego se detiene. Después se puede recoger y esconder.
- **Las rondas del detective.** El detective registra el apartamento en **cuatro rondas**, de lo más evidente a lo más oculto:
  1. Lugares muy obvios, más un vistazo a cada habitación.
  2. Lugares no tan obvios.
  3. Lugares ocultos.
  4. Lugares muy ocultos (ronda más rápida).

  El orden de los puntos se mezcla en cada partida y, tras cada una de las tres primeras rondas, **interroga a Roro**.
- **Cuándo encuentra pruebas.** Cada escondite se registra **una sola vez**: un lugar ya revisado es seguro. Una prueba se descubre si está en el escondite que el detective registra o si está a la vista cerca de él mientras busca. Las pruebas que Roro lleva en las manos nunca se descubren.
- **Presión del caso.** Cada prueba descubierta acerca al detective a la solución. Necesita **3 en Fácil, 2 en Normal y 1 en Difícil**. Cuantas menos le faltan, más rápida suena la música y más intenso es el borde rojo de la pantalla.
- **Distracción.** La tetera de la cocina silba tras unos segundos y atrae al detective. Al terminar de revisarla, vuelve exactamente al punto de su ruta donde lo dejó. Tiene un tiempo de espera de 30 s.
- **Puertas.** Roro puede abrir y cerrar las puertas interiores. El detective abre las que encuentra cerradas en su camino.
- **Final.** Si el detective termina su visita sin resolver el caso, **Roro gana**. Si reúne las pruebas necesarias, Roro es **atrapado**.

### Dificultades

| Modo | Visibilidad | Pruebas para resolver el caso |
|---|---|:---:|
|  **Fácil** | Todo el apartamento y el detective, en todo momento | 3 |
|  **Normal** | Solo la habitación donde está Roro (las dos, si está en una puerta) | 2 |
|  **Difícil** | Solo un pequeño círculo alrededor de Roro | 1 |

En Normal y Difícil el detective deja de verse fuera de la zona visible. Sus **pasos** se escuchan cuando está cerca (hasta unas tres casillas) y su sonido se desplaza a la izquierda o a la derecha según su posición.

---

##  Características

Todas las funcionalidades de esta lista están implementadas en el código actual.

<table>
<tr>
<td valign="top" width="50%">

** Jugabilidad**
- Movimiento en 8 direcciones con velocidad diagonal normalizada
- Sprites con orientación frontal, trasera y lateral (espejada a la izquierda)
- Sistema de interacción unificado con `E`: siempre actúa sobre el objeto más cercano
- Estados explícitos de cada prueba: *no encontrada*, *cargada*, *escondida* y *descubierta*
- Puntuación derivada de los estados, que no puede contarse dos veces ni superar 6
- Sistema de presión del caso según la dificultad

</td>
<td valign="top" width="50%">

** Inteligencia artificial**
- Máquina de estados finitos con 8 estados: *Waiting*, *Entering*, *Inspecting*, *Interviewing*, *Redirected*, *Returning*, *Finished* y *Caught*
- Tabla explícita de transiciones permitidas
- Navegación A* sobre una cuadrícula de casillas transitables, sin atravesar paredes ni muebles
- Recalcula la ruta si se atasca y omite destinos inalcanzables
- Cuatro rutas de inspección con orden aleatorio pero siempre válido

</td>
</tr>
<tr>
<td valign="top">

** Atmósfera y presentación**
- Apartamento de 5 zonas (dormitorio, baño, cocina, pasillo y sala de estar) construido con el tileset
- Superposición de oscuridad para los modos Normal y Difícil
- Interrogatorios en una pantalla aparte con retrato, nombre y texto que aparece letra por letra (sin saltos ni opciones)
- Música que cambia según la escena y se acelera con la presión del caso
- Efectos de sonido para pasos, puertas, objetos, tetera, menús, victoria y derrota

</td>
<td valign="top">

** Sistema**
- Escenas de Phaser para cada estado del juego: menú, dificultad, introducción, partida, diálogo, pausa, victoria y derrota
- Pausa con reanudar, reiniciar, menú principal, silencio y barra de volumen
- Persistencia en `localStorage`: mejores puntuaciones, nivel alcanzado, estadísticas, dificultad, idioma y audio
- Interfaz bilingüe español / inglés, seleccionable desde el menú
- Escalado adaptable a la ventana y controles táctiles en pantalla
- Pruebas automáticas de la lógica, los idiomas y el audio

</td>
</tr>
</table>

---

##  Tecnologías utilizadas

| Tecnología | Versión | Uso en el proyecto |
|---|---|---|
| [**Phaser**](https://phaser.io/) | `3.90.0` | Motor del juego: escenas, renderizado WebGL/Canvas, Arcade Physics, animaciones, cámara, entrada y sonido |
| **JavaScript** | ES Modules | Lenguaje de todo el proyecto (sin TypeScript ni frameworks adicionales) |
| [**Vite**](https://vite.dev/) | `8.3.8` | Servidor de desarrollo y compilación para producción |
| **HTML5 / CSS3** | — | Página contenedora (`index.html`) y estilos de escalado (`src/style.css`) |
| **Node.js** | `^20.19.0` o `>=22.12.0` | Requisito de Vite 8; también ejecuta los scripts de verificación |
| **Web Storage** (`localStorage`) | — | Guardado de puntuaciones, idioma y ajustes de audio |
| **Web Audio API** | — | Reproducción de música y efectos a través de Phaser |

Phaser es la única dependencia de ejecución y Vite la única de desarrollo (ver [`package.json`](package.json)).

---

##  Instalación y ejecución

### Requisitos previos

- [**Node.js**](https://nodejs.org/) `20.19` o superior (o `22.12` o superior), con **npm**
- [**Git**](https://git-scm.com/)
- Un navegador moderno con soporte para WebGL o Canvas

### 1. Clonar el repositorio

```bash
git clone https://github.com/CelesteLascano017/Roro.git
cd Roro
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

Abre la dirección que muestra Vite en la terminal (por defecto, `http://localhost:5173`).

### Otros comandos

| Comando | Descripción |
|---|---|
| `npm run build` | Genera la versión de producción en `dist/` (con rutas relativas, para que funcione desde cualquier carpeta) |
| `npm run preview` | Sirve localmente la versión compilada de `dist/` |
| `npm test` | Ejecuta las pruebas automáticas: lógica del juego, catálogo de idiomas y sistema de audio |
| `npm run check-assets` | Muestra qué recursos declarados existen y cuáles faltan, con sus rutas esperadas |

### Opciones en la URL (desarrollo)

| Parámetro | Efecto |
|---|---|
| `?debug` | Dibuja los cuerpos de colisión de Arcade Physics |
| `?touch` | Fuerza los controles táctiles en un ordenador de escritorio |

---

## Controles

### Teclado y ratón

| Tecla | Acción |
|---|---|
| `W` `A` `S` `D` / `↑` `←` `↓` `→` | Mover a Roro |
| `E` | Interactuar: recoger, esconder, recuperar, leer la nota, abrir/cerrar puertas, encender la tetera |
| `Esc` | Pausar y reanudar |
| `M` | Activar o desactivar el sonido |
| `W` / `S` o `↑` / `↓` | Navegar por los botones de los menús |
| `Enter` / `Espacio` | Confirmar en los menús |
| `E` / `Espacio` / `Enter` / clic | Avanzar en la introducción y en los interrogatorios |
| `←` / `→` | Ajustar el volumen en el menú de pausa |
| Clic | Pulsar botones, cerrar la nota y arrastrar la barra de volumen |

### Controles táctiles

Aparecen automáticamente en dispositivos táctiles, o con `?touch` en la URL.

| Control en pantalla | Acción |
|---|---|
| Cruceta `^` `v` `<` `>` (abajo a la izquierda) | Mover a Roro |
| Botón **E** (abajo a la derecha) | Interactuar |
| Botón **II** (arriba a la derecha) | Pausar |
| Toque en botones y en la barra de volumen | Igual que el clic del ratón |

---

## Estructura del proyecto

```text
Roro/
├── index.html                  Página contenedora del juego
├── vite.config.js              Configuración de Vite y plugin que lista los recursos disponibles
├── package.json                Scripts y dependencias
├── docs/                       Documento de diseño, requisitos, reglas, referencias e inventario de recursos
├── public/assets/              Recursos del juego (se sirven tal cual)
│   ├── characters/             Sprites de Roro y del detective (idle y caminar en 3 direcciones)
│   ├── environment/tilesets/   Tileset de interiores
│   ├── objects/                Pertenencias de la víctima, bate y nota
│   ├── sounds/                 Música (.mp3) y efectos de sonido (.wav)
│   └── ui/fonts/               Fuente pixel m6x11
├── scripts/                    Scripts de Node: pruebas, informe de recursos y generador de efectos
└── src/
    ├── main.js                 Configuración de Phaser y lista de escenas
    ├── style.css               Estilos de la página y escalado pixelado
    ├── data/                   Configuración y contenido, sin lógica
    │   ├── gameConfig.js       Resolución, velocidades, tiempos, dificultades e historia
    │   ├── assetManifest.js    Claves, rutas y procesamiento de cada recurso
    │   ├── apartmentData.js    Habitaciones, puertas, muebles, escondites y puntos de aparición
    │   ├── evidenceData.js     Las seis pruebas, sus estados y el texto de la nota
    │   ├── detectiveRoutes.js  Las cuatro rutas de inspección
    │   ├── dialogueData.js     Introducción e interrogatorios
    │   ├── translations.js     Catálogo de textos en español
    │   ├── animationData.js    Definición de animaciones
    │   └── tilesetData.js      Regiones del tileset
    ├── scenes/                 Una escena de Phaser por pantalla del juego
    ├── world/                  Modelo del apartamento y su renderizado
    ├── physics/                Colisiones, navegación A* y detección de habitaciones
    ├── ai/                     Máquina de estados del detective
    ├── objects/                Personajes, puertas, pruebas, escondites y distracciones
    ├── managers/               Servicios: recursos, audio, guardado, idioma, pruebas, rutas, interacción, entrada
    ├── ui/                     HUD, avisos, nota, diálogos, oscuridad, presión del caso, botones y controles táctiles
    └── utils/                  Procesamiento de imágenes, aleatoriedad, eventos y atmósfera del caso
```

---

## Arquitectura

El juego separa **datos**, **lógica** y **presentación**. Toda la información editable (el apartamento, las rutas, los textos y los tiempos) vive en `src/data/`, y el resto del código la lee de ahí.

### Flujo de escenas

```text
BootScene ─▶ PreloadScene ─▶ MainMenuScene ─▶ DifficultyScene ─▶ IntroductionScene ─▶ ApartmentScene
                                   ▲                                                    │  ├─▶ PauseScene    (superpuesta)
                                   │                                                    │  └─▶ DialogueScene (interrogatorios)
                                   └──────────── VictoryScene / DefeatScene ◀───────────┘
```

| Escena | Responsabilidad |
|---|---|
| `PreloadScene` | Carga los recursos con barra de progreso, quita el fondo de los sprites recortados y crea las animaciones |
| `MainMenuScene` | Título, instrucciones, idioma, sonido y mejores puntuaciones |
| `ApartmentScene` | Partida: conecta todos los sistemas, pero no contiene las reglas |
| `DialogueScene` | Interrogatorios lineales, sin saltos ni opciones |
| `PauseScene` | Detiene la física, los temporizadores y la IA de la partida |
| `VictoryScene` / `DefeatScene` | Resultado, puntuación, mejor marca y opciones para reiniciar o volver al menú |

### Sistemas principales

| Módulo | Función |
|---|---|
| `world/ApartmentLayout` | Modelo puro del nivel. De él se derivan los gráficos, las colisiones, la navegación y la visibilidad |
| `physics/CollisionManager` | Cuerpos estáticos de Arcade Physics para paredes, muebles y puertas cerradas, independientes de los gráficos |
| `physics/NavigationManager` | Pathfinding A* sin cortar esquinas, con suavizado de rutas |
| `physics/RoomTriggerSystem` | Detecta en qué habitación está cada personaje mediante *overlaps* |
| `ai/DetectiveStateMachine` | Decide **qué** hace el detective. `objects/Detective` decide **cómo** se mueve |
| `managers/EvidenceManager` | Única autoridad sobre los estados de las pruebas, la puntuación y el progreso del caso |
| `managers/InspectionManager` | Construye las rutas y aleatoriza su orden, comprobando que cada punto sea alcanzable |
| `managers/InteractionManager` | Elige el objeto interactivo más cercano y muestra su aviso |
| `managers/AudioManager` | Música, efectos, silencio, volumen y sonido posicional |
| `managers/LanguageManager` | Traducción de textos en tiempo de ejecución |
| `managers/SaveManager` | Persistencia en `localStorage`, tolerante a fallos |
| `managers/AssetManager` | Carga, procesamiento y sustitutos de los recursos que faltan |

### Máquina de estados del detective

```text
WAITING ─▶ ENTERING ─▶ INSPECTING ⇄ INTERVIEWING          (rondas 1-3)
                            │
                            ├─▶ REDIRECTED ─▶ RETURNING ─▶ INSPECTING   (distracción)
                            ├─▶ FINISHED   (ronda 4 terminada: victoria)
                            └─▶ CAUGHT     (caso resuelto: derrota)
```

Las transiciones permitidas están en `DETECTIVE_TRANSITIONS` (`src/ai/DetectiveStateMachine.js`); cualquier otra se rechaza.

> El modelo del nivel, la navegación, las pruebas, las rutas y la máquina de estados no dependen de Phaser. Por eso `npm test` puede verificarlos directamente con Node.

---

##  Recursos y créditos

### Gráficos

| Recurso | Autor | Fuente | Licencia |
|---|---|---|---|
| Personajes (Roro y el detective), *32 Free Animated Characters Pack* | Lexlom | [lexlom.itch.io](https://lexlom.itch.io/32-character-pack-pixel-art-4-direction-idle-walking) | CC0, según el autor (consta en `docs/ASSETS.md`) |
| Tileset *Pixel Lands Interiors (demo)* | Trislin | [trislin.itch.io](https://trislin.itch.io/pixel-lands-interiors) |  Pendiente de verificar en la página original |
| Pertenencias de la víctima y bate de béisbol |  Sin verificar | Paquete de objetos descargado; origen pendiente de registrar |  Sin verificar |
| Nota y papel de la nota (`victim_note.png`, `name_victim.png`) |  Sin verificar | — |  Sin verificar |

### Tipografía

| Recurso | Autor | Licencia |
|---|---|---|
| m6x11 (`m6x11.ttf`) | Daniel Linssen |  Pendiente de verificar (`docs/ASSETS.md` indica que falta confirmar la fuente exacta) |

### Música

| Archivo | Uso | Fuente y licencia |
|---|---|---|
| `menu_sound.mp3` | Menú principal |  Sin verificar (`docs/ASSETS.md`) |
| `suspenseful.mp3` | Partida (se acelera con la presión del caso) |  Sin verificar (`docs/ASSETS.md`) |
| `rest_sound.mp3` | Dificultad, introducción, pausa, interrogatorios y resultados |  Sin verificar (`docs/ASSETS.md`) |

### Efectos de sonido

Los efectos `.wav` (pasos, golpes en la puerta, puertas, recoger y esconder, papel, tetera, menú, victoria y derrota) son **audio procedural original** creado para este proyecto, sin grabaciones ni muestras externas, según `docs/ASSETS.md`. Pueden regenerarse con:

```bash
node scripts/generate-effects.mjs
```

### Herramientas

[Phaser](https://phaser.io/) · [Vite](https://vite.dev/) · [Node.js](https://nodejs.org/)

>  Los recursos marcados con  aún no tienen autor ni licencia confirmados. Deben verificarse antes de publicar o distribuir el juego.

---

## Equipo de desarrollo

Información obtenida del historial de Git del repositorio.

| Integrante (Git / GitHub) | Contribuciones registradas |
|---|---|
| **Dumdum** · [@CelesteLascano017](https://github.com/CelesteLascano017) | Configuración inicial del proyecto, documentación de diseño y recursos gráficos; implementación del juego (escenas, sistemas, IA, interfaz y scripts de verificación); comentarios explicativos del código |
| **Criowl / Cristhian C.** · [@CriOwl](https://github.com/CriOwl) | Traducción del juego al español; integración de música y efectos de sonido; barra de volumen; sistema de presión del caso (pruebas necesarias por dificultad); fusión de la rama `developer` (PR #1) |

<sub>Proyecto final del primer término de la asignatura **Aplicaciones Web**.</sub>

---



### Implementado

- Flujo completo: menú → dificultad → introducción → partida → interrogatorios → victoria o derrota, con reinicio
- Las seis pruebas, los 16 escondites, las cuatro rutas y los tres interrogatorios
- Tres dificultades, con su visibilidad y presión del caso
- Música, efectos, silencio y volumen persistentes
- Español e inglés
- Controles de teclado, ratón y táctiles

### Limitaciones conocidas

- **Gráficos provisionales.** No existen todavía imágenes para las puertas, los muebles de cocina y baño ni los retratos de diálogo (12 recursos opcionales). El juego dibuja sustitutos con contorno magenta, o reutiliza el sprite del personaje en el caso de los retratos. `npm run check-assets` lista las rutas esperadas.
- **Créditos incompletos.** Falta confirmar el origen y la licencia de la música, de los objetos de prueba, de la nota y de la fuente, y la licencia del tileset.
- **Sin capturas de pantalla.** El repositorio aún no incluye capturas de pantalla.
- La animación de caminar de Roro continúa mientras empuja contra una pared.
- El detective y Roro no colisionan entre sí; es intencionado, para que Roro no pueda bloquear su camino.
- En pantallas verticales de móvil el juego se muestra pequeño, con franjas negras.
- El equilibrio de la dificultad (tiempos, rango de visión, enfriamiento de la tetera) no se ha ajustado con pruebas de juego de jugadores reales.
- `package.json` declara la licencia `ISC`, pero el repositorio no incluye un archivo `LICENSE`.

---

<div align="center">

*Encuentra todo. Esconde todo. Olvida.*

**🔪 RORO 🔪**

</div>
