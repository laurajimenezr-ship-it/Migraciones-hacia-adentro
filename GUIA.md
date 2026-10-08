# Guía de edición

Cómo editar en GitHub: abre el archivo, haz clic en el lápiz ✏️, cambia lo que necesites y guarda con **Commit changes**. La página publicada se actualiza en uno o dos minutos (recarga con Cmd+Shift+R en Mac o Ctrl+F5 en Windows para ver el cambio).

---

## 1. Tipografía

La página usa tres familias:

| Papel | Fuente actual | Dónde se ve |
|---|---|---|
| `--display` | Gloock | Títulos grandes |
| `--body` | Source Serif 4 | Texto corrido |
| `--mono` | IBM Plex Mono | Etiquetas, timecode |

**Para cambiar una fuente:**

1. Busca la fuente en [fonts.google.com](https://fonts.google.com) y abre su página (por ejemplo *Cormorant Garamond*).
2. Haz clic en **Get font → Get embed code**. Copia solo la línea que empieza con `<link href="https://fonts.googleapis.com/css2?...`.
3. En `index.html`, busca la línea que empieza con `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gloock` y reemplázala por la nueva. Si quieres conservar las otras dos fuentes, pide en Google Fonts las tres a la vez (agrégalas todas antes de copiar el código).
4. En `estilos.css`, al principio, cambia el nombre en la variable correspondiente. Ejemplo:
   `--display:"Cormorant Garamond", Georgia, serif;`
   El nombre entre comillas debe ser exactamente el de Google Fonts.

**Para cambiar el tamaño del texto corrido:** en `estilos.css`, en la regla `body{...}`, cambia `font-size:1.08rem`. Por ejemplo `1.15rem` lo agranda un poco.

## 2. Colores

Todos los colores están al principio de `estilos.css`, dentro de `:root{ ... }`. Cambias el código del color y se actualiza en toda la página.

| Variable | Color actual | Para qué sirve |
|---|---|---|
| `--noche` | `#0c0b10` | Pantalla inicial, sala de cine y muro |
| `--paramo` | `#c9d1c8` | Fondo del territorio (inicio del descenso) |
| `--ciudad` | `#8e98a3` | Fondo de la sección ciudad |
| `--aula` | `#2f4a4f` | Fondo de la formación/universidad |
| `--adentro` | `#251c33` | Fondo del fuero interno (diagrama YO) |
| `--luz` | `#f0b44c` | Acento: luz del proyector, botones, resaltados |
| `--hiloA` | `#d9734e` | Hilo y detalles de Keratuma |
| `--hiloB` | `#86b8ad` | Hilo y detalles de Luis |
| `--ink-light` | `#16151b` | Texto sobre fondos claros |
| `--ink-dark` | `#ece7df` | Texto sobre fondos oscuros |

Para elegir colores: [coolors.co](https://coolors.co) o el selector de color de Google (busca "color picker"). Copia el código que empieza con `#`.

Si aclaras mucho `--ciudad` o `--aula`, revisa que el texto se siga leyendo bien.

## 3. Imágenes

1. En GitHub entra a la carpeta `assets/img/` y usa **Add file → Upload files**.
2. Nombres sin espacios ni tildes: `keratuma-territorio.jpg`, no `Keratuma Territorio.jpg`.
3. Peso recomendado: menos de 500 KB (comprímelas en [squoosh.app](https://squoosh.app)).

Para usarlas:

- **Fotogramas de una película:** en `contenido.js`, dentro de la película:
  `imagenes: ['assets/img/keratuma-1.jpg', 'assets/img/keratuma-2.jpg'],`
  Aparecen en la puerta «Ver».
- **En cualquier parte del texto:** en `index.html`, donde la quieras:
  `<img src="assets/img/keratuma-territorio.jpg" alt="Descripción breve de la imagen">`

## 4. Video

GitHub no sirve para videos pesados. Súbelos a **Vimeo** (mejor para cine: sin publicidad y con opción de video privado con enlace) o a **YouTube** (puede ser "No listado").

En `contenido.js`, dentro de cada película, pega el enlace en `video`:

```js
video: 'https://vimeo.com/123456789',
```

o

```js
video: 'https://www.youtube.com/watch?v=XXXXXXXX',
```

En la puerta «Ver» aparece el botón **▶ Reproducir fragmento** y el video se reproduce dentro de la pantalla de la película. Si dejas `video: ''`, el botón no aparece.

> Para Vimeo: en la configuración del video, en **Privacidad → Dónde se puede insertar**, deja "En cualquier lugar" o agrega `laurajimenezr-ship-it.github.io`.

## 5. Sonido

Formato recomendado: **.mp3**, de menos de 5 MB (un minuto de voz pesa alrededor de 1 MB). Súbelo a `assets/audio/`.

- **Voz del cineasta (puerta «Escuchar»):** en `contenido.js`, dentro de la película:
  `audio: 'assets/audio/keratuma-voz.mp3',`
  Aparece un reproductor.
- **Sonido de la pantalla inicial:** en `contenido.js`, arriba:
  `sonidoInicio: 'assets/audio/inicio.mp3',`
  Aparece el botón **♪ Activar sonido** junto a «Ingresar». El sonido se repite en bucle. Los navegadores no permiten que el sonido arranque solo: siempre hace falta que la persona toque el botón.

Para recortar o convertir audios: [Audacity](https://www.audacityteam.org) (gratis).

## 6. El muro vivo

### Activarlo (una sola vez)

1. **Settings → General → Features**: activa **Discussions**.
2. Pestaña **Discussions** → ícono de lápiz junto a *Categories* → **New category**. Nombre: `Muro vivo`. Formato: **Announcement** (así solo tú y giscus pueden abrir hilos; el público solo comenta).
3. Instala giscus en el repositorio: [github.com/apps/giscus](https://github.com/apps/giscus) → **Install** → *Only select repositories* → `Migraciones-hacia-adentro`.
4. Entra a [giscus.app/es](https://giscus.app/es). En *Repositorio* escribe `laurajimenezr-ship-it/Migraciones-hacia-adentro`. En *Categoría de discusión* elige `Muro vivo`.
5. Más abajo, en *Habilitar giscus*, aparece un bloque de código. Copia de ahí cuatro valores y pégalos al final de `contenido.js`:

```js
giscus: {
  repo: 'laurajimenezr-ship-it/Migraciones-hacia-adentro',
  repoId: 'R_kgDO...',        // valor de data-repo-id
  category: 'Muro vivo',
  categoryId: 'DIC_kwDO...'   // valor de data-category-id
}
```

### Cómo está organizado

- Cada pregunta del muro es una **pestaña** y tiene su **propio hilo** de reflexiones.
- El hilo se crea solo cuando alguien deja la primera reflexión en esa pregunta. En la pestaña Discussions aparece como `Muro · ¿Qué lugar llevas contigo...?`.
- Las preguntas se editan en `contenido.js`, en `preguntasMuro`. Para agregar una, copia una línea y cambia el texto. Si cambias el texto de una pregunta que ya tiene respuestas, esas respuestas quedan en el hilo viejo, así que es mejor agregar una pregunta nueva.
- La gente puede responder a otras reflexiones y reaccionar con emojis.

### Moderar

Todo se hace en la pestaña **Discussions** del repositorio:

- **Borrar u ocultar un comentario:** en el comentario, menú `···` → *Delete* u *Hide* (al ocultarlo puedes elegir el motivo, por ejemplo *Spam* u *Off-topic*).
- **Cerrar una pregunta para que no reciba más reflexiones:** abre la discusión → *Lock conversation* (barra lateral derecha).
- **Destacar una reflexión:** en el comentario, `···` → *Pin*… (o marca la discusión entera con *Pin discussion*).
- **Bloquear a alguien:** en su perfil → *Block or report*.
- **Recibir avisos de comentarios nuevos:** en la página principal del repositorio → **Watch** → *Custom* → *Discussions*.

Recuerda: para escribir en el muro, las personas necesitan una cuenta de GitHub.

---

## Si algo se rompe

- **La página sale en blanco o sin diseño:** casi siempre es una coma o una comilla que falta en `contenido.js`. En GitHub, ve a **History** (arriba a la derecha del archivo), abre el cambio anterior y compáralo, o restaura la versión anterior.
- **Una imagen o un audio no aparece:** revisa que la ruta en `contenido.js` sea idéntica al nombre del archivo, incluyendo mayúsculas y la extensión (`.jpg` no es lo mismo que `.JPG`).
- **El cambio no se ve:** espera dos minutos y recarga forzando (Cmd+Shift+R / Ctrl+F5).
