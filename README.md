# Migraciones hacia adentro

Ensayo digital sobre desplazamiento, formación y mirada en el cine indígena contemporáneo, a partir de la obra de **Keratuma (Mileidy Domicó)** y **Luis Tróchez Tunubalá**.

Es una página web de un solo recorrido vertical: el scroll baja del territorio a la ciudad, a la universidad, al fuero interno y termina en la sala de cine. No necesita instalar nada: son archivos HTML, CSS y JavaScript que se abren directamente en el navegador.

## Qué hay en cada archivo

| Archivo | Qué contiene | ¿Lo edito? |
|---|---|---|
| `contenido.js` | Fragmentos biográficos, conceptos del diagrama, hoja de contactos, películas, preguntas del muro | **Sí, aquí va casi todo el trabajo** |
| `index.html` | La estructura y los textos largos de cada sección (títulos, párrafos) | Sí, para cambiar textos de las secciones |
| `estilos.css` | Colores, tipografías y diseño | Solo si quieres cambiar el aspecto |
| `app.js` | La lógica (timecode, hilos, diagrama, muro) | Normalmente no |
| `assets/img/` | Aquí van las imágenes y fotogramas | Sube tus imágenes aquí |
| `assets/audio/` | Aquí van los fragmentos de voz o sonido | Sube tus audios aquí |

Los textos entre `[corchetes]` son espacios por completar.

## 1. Subirlo a GitHub (sin usar la terminal)

1. Entra a [github.com](https://github.com) con tu cuenta y haz clic en **New repository**.
2. Nombre sugerido: `migraciones-hacia-adentro`. Elige **Public** (necesario para publicarlo gratis con GitHub Pages). Crea el repositorio.
3. En la página del repositorio vacío, haz clic en **uploading an existing file**.
4. Arrastra **todo el contenido** de esta carpeta (no la carpeta misma): `index.html`, `estilos.css`, `contenido.js`, `app.js`, `README.md` y la carpeta `assets`.
5. Escribe un mensaje como "Primera versión del prototipo" y haz clic en **Commit changes**.

## 2. Publicarlo como página web

1. En el repositorio, ve a **Settings → Pages**.
2. En *Source* elige **Deploy from a branch**, rama **main**, carpeta **/ (root)**. Guarda.
3. En uno o dos minutos la página estará en `https://TU-USUARIO.github.io/migraciones-hacia-adentro/`.

Cada vez que guardes un cambio en GitHub, la página se actualiza sola en uno o dos minutos.

## 3. Editar

- **Desde el navegador:** abre cualquier archivo en GitHub y haz clic en el lápiz ✏️. Para editar varios archivos a la vez, presiona la tecla `.` estando en el repositorio: se abre un editor completo (github.dev).
- **Con Claude:** conecta tu cuenta de GitHub en la configuración de Claude y pídele cambios directamente sobre el repositorio.
- **En tu computador:** con [GitHub Desktop](https://desktop.github.com) clonas el repositorio, editas con cualquier editor (por ejemplo VS Code) y sincronizas.

### Agregar una imagen

1. Sube la imagen a `assets/img/` (por ejemplo `keratuma-territorio.jpg`).
2. En `index.html`, donde la quieras, escribe:
   `<img src="assets/img/keratuma-territorio.jpg" alt="Descripción de la imagen">`

Usa imágenes de menos de 500 KB (puedes comprimirlas en [squoosh.app](https://squoosh.app)).

### Agregar video

GitHub no es buen lugar para videos pesados. Súbelos a Vimeo o YouTube y pon el enlace en `contenido.js`, en `enlaces` de cada película:
`enlaces: [{ texto: 'Ver fragmento en Vimeo', url: 'https://vimeo.com/...' }]`

## 4. Activar el muro vivo

El muro usa **giscus**, que guarda las reflexiones como comentarios en las *Discussions* del mismo repositorio. Para escribir, las personas necesitan una cuenta de GitHub (gratuita).

1. En el repositorio: **Settings → General → Features**, activa **Discussions**.
2. En la pestaña **Discussions**, crea una categoría nueva llamada `Muro vivo` (tipo *Announcement*, para que solo giscus cree el hilo).
3. Instala la app de giscus en tu repositorio: [github.com/apps/giscus](https://github.com/apps/giscus).
4. Entra a [giscus.app/es](https://giscus.app/es), escribe `TU-USUARIO/migraciones-hacia-adentro`, elige la categoría `Muro vivo` y, más abajo, copia los valores de `data-repo`, `data-repo-id`, `data-category` y `data-category-id`.
5. Pégalos al final de `contenido.js`, en la sección `giscus`.

Si prefieres que cualquier persona pueda escribir sin cuenta, la alternativa es un muro de Padlet enlazado, o una base de datos como Supabase o Firebase (requiere más configuración).

## Créditos

Ensayo y curaduría: Laura Daniela Jiménez R.
El ensayo como la forma que piensa — Josep M. Catalá.
