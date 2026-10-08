/* =====================================================================
   CONTENIDO DEL ENSAYO
   Aquí se editan los textos que cambian con frecuencia, sin tocar el código.
   Reglas: cada texto va entre comillas '...'. Si un texto lleva un apóstrofo,
   usa comillas dobles "..." en su lugar. No borres las comas al final de cada línea.
   Los textos largos de cada sección (títulos, párrafos) están en index.html.
   ===================================================================== */

window.CONTENIDO = {

  /* Sonido de la pantalla inicial. Sube el archivo .mp3 a assets/audio/ y escribe
     su ruta aquí, por ejemplo: 'assets/audio/inicio.mp3'.
     Si lo dejas vacío, no aparece el botón de sonido. */
  sonidoInicio: '',

  /* Frases que van rotando en la pantalla inicial (fragmentos de voz) */
  frasesInicio: [
    '[voz · fragmento de la película de Keratuma]',
    '[voz · fragmento de la película de Luis]',
    '[sonido de territorio]'
  ],

  /* Fragmentos biográficos que aparecen al "entrar donde" cada cineasta */
  fragmentos: {
    a: [ // Keratuma · Mileidy Domicó
      '[Fragmento biográfico 1: el territorio de origen, intervenido con una imagen o una frase de su propia voz.]',
      '[Fragmento 2: la salida forzada. Qué se lleva, qué se queda.]',
      '[Fragmento 3: la llegada a Medellín.]'
    ],
    b: [ // Luis Tróchez Tunubalá
      '[Fragmento biográfico 1: el territorio de origen y la decisión de salir.]',
      '[Fragmento 2: imágenes de Cali. La ciudad como lugar de trabajo y estudio.]',
      '[Fragmento 3: lo que se mantiene del territorio en la ciudad.]'
    ]
  },

  /* Diagrama del YO: cada concepto, su nota y con qué otros se relaciona.
     Para agregar un concepto, copia una línea completa y cambia los textos.
     Los nombres en "con" deben escribirse igual que el nombre del concepto. */
  conceptos: [
    { nombre: 'Memoria',        nota: 'Lo que se recuerda y lo que se reconstruye con la cámara.',            con: ['Familia','Historia','Territorio','Afectos'] },
    { nombre: 'Familia',        nota: 'El primer círculo: madres, abuelas, hermanos frente a la cámara.',      con: ['Memoria','Generacional','Afectos','Lengua'] },
    { nombre: 'Generacional',   nota: 'Lo que se hereda y lo que se rompe entre generaciones.',               con: ['Familia','Historia','Comunidad'] },
    { nombre: 'Territorio',     nota: 'El lugar de origen, físico y simbólico.',                              con: ['Memoria','Comunidad','Desplazamiento','Pertenencia'] },
    { nombre: 'Comunidad',      nota: 'El sujeto colectivo que ahora se piensa en singular.',                 con: ['Territorio','Generacional','Lengua','Pertenencia'] },
    { nombre: 'Historia',       nota: 'La historia larga del pueblo y la historia corta de una vida.',        con: ['Memoria','Generacional','Desplazamiento'] },
    { nombre: 'Desplazamiento', nota: 'La salida, forzada o buscada.',                                         con: ['Territorio','Historia','Pertenencia','Género'] },
    { nombre: 'Género',         nota: 'Ser mujer o ser hombre indígena en el territorio y en la ciudad.',     con: ['Desplazamiento','Afectos','Comunidad'] },
    { nombre: 'Pertenencia',    nota: 'Desde dónde se habla cuando ya se está afuera.',                       con: ['Territorio','Comunidad','Desplazamiento','Lengua'] },
    { nombre: 'Lengua',         nota: 'La lengua propia como forma de estar en la imagen.',                   con: ['Familia','Comunidad','Pertenencia'] },
    { nombre: 'Afectos',        nota: 'Lo que se siente y cómo el cine lo deja aparecer.',                    con: ['Memoria','Familia','Género'] }
  ],
  notaVoz: 'El punto desde donde se enuncia. Todo lo demás pasa por aquí.',

  /* Hoja de contactos de la sección "Filmar" */
  cuadros: [
    { titulo: 'Diarios',              texto: 'La escritura íntima trasladada a la imagen.' },
    { titulo: 'Voz propia',           texto: 'Narración en primera persona, en lengua propia o en español.' },
    { titulo: 'Imágenes cotidianas',  texto: 'Lo aparentemente menor: la cocina, el camino, la espera.' },
    { titulo: 'Tiempo',               texto: 'Planos largos. Dejar que la duración diga.' },
    { titulo: 'Memoria',              texto: 'Archivo familiar, fotografías, recuerdos reconstruidos.' },
    { titulo: 'Desplazamiento',       texto: 'El movimiento como forma del relato.' },
    { titulo: 'Registro',             texto: 'El cine como registro de una experiencia.' },
    { titulo: '[Recurso]',            texto: '[Plano o recurso estético específico de una de las películas.]' }
  ],

  /* Las dos películas y sus tres puertas.
     video:    enlace de YouTube o Vimeo (se reproduce dentro de la pantalla al tocar «Ver»).
               ej. 'https://www.youtube.com/watch?v=XXXX' o 'https://vimeo.com/123456'
     imagenes: fotogramas en assets/img/, ej. ['assets/img/keratuma-1.jpg', 'assets/img/keratuma-2.jpg']
     audio:    voz del cineasta en assets/audio/, ej. 'assets/audio/keratuma-voz.mp3'
     enlaces:  otros recursos, ej. [{ texto: 'Entrevista completa', url: 'https://...' }] */
  peliculas: {
    a: {
      titulo: '[Título de la película]',
      linea: 'Keratuma · año',
      ver: '[Fragmentos de la película: 3 o 4 clips cortos o fotogramas.]',
      escuchar: '[La voz de la cineasta: entrevista, voz en off, fragmento de lengua propia.]',
      video: '',
      imagenes: [],
      audio: '',
      enlaces: [],
      viaje: ['Territorio', 'Medellín', 'Formación', 'Memoria', 'Película']
    },
    b: {
      titulo: '[Título de la película]',
      linea: 'Luis Tróchez Tunubalá · año',
      ver: '[Fragmentos de la película: 3 o 4 clips cortos o fotogramas.]',
      escuchar: '[La voz del cineasta: entrevista, voz en off, fragmento de lengua propia.]',
      video: '',
      imagenes: [],
      audio: '',
      enlaces: [],
      viaje: ['Territorio', 'Cali', 'Formación', 'Memoria', 'Película']
    }
  },

  /* Preguntas del muro vivo. Cada pregunta tiene su propio hilo de reflexiones
     (una discusión distinta en GitHub). Si cambias el texto de una pregunta que ya
     tiene respuestas, esas respuestas quedan en el hilo viejo: mejor agrega una nueva. */
  preguntasMuro: [
    '¿Qué lugar llevas contigo aunque ya no estés ahí?',
    '¿Qué aprendiste a mirar de otra manera?',
    '¿Qué filmarías de tu propia historia?',
    'Reflexión libre'
  ],

  /* Muro vivo con giscus (comentarios guardados en GitHub Discussions).
     Copia estos cuatro valores desde https://giscus.app (ver README).
     Mientras estén vacíos, el muro muestra un aviso. */
  giscus: {
    repo: '',          // ej. 'tu-usuario/migraciones-hacia-adentro'
    repoId: '',        // ej. 'R_kgDO...'
    category: '',      // ej. 'Muro vivo'
    categoryId: ''     // ej. 'DIC_kwDO...'
  }
};
