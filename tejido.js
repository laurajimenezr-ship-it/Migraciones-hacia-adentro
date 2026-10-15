// Tejido de la voz — boceto p5.js para «Migraciones hacia adentro»
// Desciende con la rueda del ratón, las flechas ↑ ↓ o arrastrando.

const PALETA = {
  noche:   '#0c0b10',
  paramo:  '#c9d1c8',
  ciudad:  '#8e98a3',
  aula:    '#2f4a4f',
  adentro: '#251c33',
  luz:     '#f0b44c',
  hiloA:   '#d9734e', // Keratuma
  hiloB:   '#86b8ad', // Luis
  tinta:   '#ece7df',
  tintaOscura: '#16151b'
};

const ESTACIONES = [
  { nombre: 'Territorio',   color: 'paramo',  en: 0.00 },
  { nombre: 'Ciudad',       color: 'ciudad',  en: 0.25 },
  { nombre: 'Formación',    color: 'aula',    en: 0.50 },
  { nombre: 'Yo · memoria', color: 'adentro', en: 0.75 },
  { nombre: 'Voz',          color: 'noche',   en: 1.00 }
];

const CONCEPTOS = [
  { nombre: 'Memoria',        nota: 'Lo que se recuerda y lo que se reconstruye con la cámara.',        con: ['Familia','Historia','Territorio','Afectos'] },
  { nombre: 'Familia',        nota: 'El primer círculo: madres, abuelas, hermanos frente a la cámara.', con: ['Memoria','Generacional','Afectos','Lengua'] },
  { nombre: 'Generacional',   nota: 'Lo que se hereda y lo que se rompe entre generaciones.',          con: ['Familia','Historia','Comunidad'] },
  { nombre: 'Territorio',     nota: 'El lugar de origen, físico y simbólico.',                         con: ['Memoria','Comunidad','Desplazamiento','Pertenencia'] },
  { nombre: 'Comunidad',      nota: 'El sujeto colectivo que ahora se piensa en singular.',            con: ['Territorio','Generacional','Lengua','Pertenencia'] },
  { nombre: 'Historia',       nota: 'La historia larga del pueblo y la historia corta de una vida.',   con: ['Memoria','Generacional','Desplazamiento'] },
  { nombre: 'Desplazamiento', nota: 'La salida, forzada o buscada.',                                    con: ['Territorio','Historia','Pertenencia','Género'] },
  { nombre: 'Género',         nota: 'Ser mujer o ser hombre indígena en el territorio y en la ciudad.',con: ['Desplazamiento','Afectos','Comunidad'] },
  { nombre: 'Pertenencia',    nota: 'Desde dónde se habla cuando ya se está afuera.',                  con: ['Territorio','Comunidad','Desplazamiento','Lengua'] },
  { nombre: 'Lengua',         nota: 'La lengua propia como forma de estar en la imagen.',              con: ['Familia','Comunidad','Pertenencia'] },
  { nombre: 'Afectos',        nota: 'Lo que se siente y cómo el cine lo deja aparecer.',               con: ['Memoria','Familia','Género'] }
];

let meta = 0;      // a dónde quiere ir el descenso (0 arriba, 1 fondo)
let prof = 0;      // dónde está ahora
let elegido = null;
let grano;

// ---------- Sonido de las uniones ----------
// Cada concepto tiene una nota (escala pentatónica, una por concepto, en el mismo orden de CONCEPTOS).
const ESCALA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
// Opcional: un archivo de audio propio para una unión. La clave son los dos nombres en orden alfabético, separados por |.
// Si una unión tiene archivo, suena el archivo; si no, suena su nota.
const SONIDOS = {
  // 'Memoria|Territorio': 'assets/audio/memoria-territorio.mp3',
};
const PAUSA = 0.35;      // segundos entre una unión y la siguiente
let audio = null;        // el motor de sonido del navegador; se crea con el primer clic
let encendidas = {};     // clave de la unión → momento (millis) en que se enciende

// ---------- La composición de la voz ----------
// Opcional: una composición propia en audio. Si dejas '', suena la composición generada.
const VOZ_AUDIO = '';    // por ejemplo 'assets/audio/voz.mp3'
const PAUSA_VOZ = 0.5;   // segundos entre una unión y la siguiente en la composición
let vozHasta = 0;        // millis en que termina la composición (0 = no suena)
let notasVivas = [];     // osciladores programados, para poder detenerlos
let vozArchivo = null;   // el reproductor del audio propio

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('"IBM Plex Mono", monospace');
  grano = crearGrano();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  prof = lerp(prof, meta, 0.08);

  background(colorDelDescenso(prof));

  const voz = { x: width / 2, y: height * 0.6 };
  dibujarHilo(PALETA.hiloA, 1, voz);
  dibujarHilo(PALETA.hiloB, -1, voz);

  const aparicion = constrain(map(prof, 0.8, 0.98, 0, 1), 0, 1);
  if (aparicion > 0) dibujarVoz(voz, aparicion);

  dibujarTimecode();
  dibujarGrano();
}

// ---------- El descenso ----------
function mouseWheel(event) {
  meta = constrain(meta + event.delta / 2500, 0, 1);
  return false;
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) meta = constrain(meta + 0.05, 0, 1);
  if (keyCode === UP_ARROW)   meta = constrain(meta - 0.05, 0, 1);
}

function mouseDragged() {
  meta = constrain(meta - (mouseY - pmouseY) / height, 0, 1);
  return false;
}

function colorDelDescenso(p) {
  for (let i = 0; i < ESTACIONES.length - 1; i++) {
    const a = ESTACIONES[i], b = ESTACIONES[i + 1];
    if (p <= b.en) {
      const t = map(p, a.en, b.en, 0, 1);
      return lerpColor(color(PALETA[a.color]), color(PALETA[b.color]), t);
    }
  }
  return color(PALETA.noche);
}

// ---------- Los hilos ----------
function dibujarHilo(tono, lado, voz) {
  const largo = prof * voz.y;
  noFill();
  stroke(tono);
  strokeWeight(2.2);
  beginShape();
  for (let y = 0; y <= largo; y += 4) {
    const t = y / voz.y;
    const abierto = (1 - t) * (1 - t);
    const tejido = sin(y * 0.012 + frameCount * 0.015) * width * 0.14 * lado;
    const temblor = (noise(lado * 50 + y * 0.006, frameCount * 0.004) - 0.5) * 90;
    vertex(voz.x + (tejido + temblor) * abierto, y);
  }
  endShape();
}

// ---------- La voz y los conceptos ----------
function posiciones(voz) {
  const R = min(width, height) * 0.3;
  return CONCEPTOS.map((c, i) => {
    const ang = -HALF_PI + TWO_PI * i / CONCEPTOS.length;
    return { ...c, x: voz.x + cos(ang) * R, y: voz.y + sin(ang) * R, ang };
  });
}

function dibujarVoz(voz, a) {
  const nodos = posiciones(voz);
  const encendidos = elegido ? [elegido, ...CONCEPTOS.find(c => c.nombre === elegido).con] : [];

  drawingContext.setLineDash([3, 5]);
  stroke(255, 40 * a);
  strokeWeight(1);
  for (const n of nodos) line(voz.x, voz.y, n.x, n.y);
  drawingContext.setLineDash([]);

  const vistas = new Set();
  for (const n of nodos) {
    for (const otro of n.con) {
      const clave = [n.nombre, otro].sort().join('|');
      if (vistas.has(clave)) continue;
      vistas.add(clave);
      const m = nodos.find(x => x.nombre === otro);
      if (!m) continue;
      const inicio = encendidas[clave];
      const on = (elegido || vozSuena()) && inicio !== undefined && millis() >= inicio;
      stroke(on ? color(240, 180, 76, 230 * a) : color(236, 231, 223, 55 * a));
      strokeWeight(on ? 1.8 : 1);
      line(n.x, n.y, m.x, m.y);

      // un punto de luz recorre la unión mientras suena
      const viaje = (millis() - inicio) / 600;
      if (on && viaje < 1) {
        const desde = n.nombre === elegido ? n : m;
        const hasta = desde === n ? m : n;
        noStroke();
        fill(240, 180, 76, 255 * a);
        circle(lerp(desde.x, hasta.x, viaje), lerp(desde.y, hasta.y, viaje), 7);
      }
    }
  }

  textSize(12);
  for (const n of nodos) {
    const on = encendidos.includes(n.nombre);
    const cerca = dist(mouseX, mouseY, n.x, n.y) < 16;
    noStroke();
    fill(on ? color(240, 180, 76, 255 * a) : color(236, 231, 223, 200 * a));
    circle(n.x, n.y, cerca ? 12 : 8);
    const cx = cos(n.ang), cy = sin(n.ang);
    textAlign(cx > 0.2 ? LEFT : cx < -0.2 ? RIGHT : CENTER, cy > 0.2 ? TOP : cy < -0.2 ? BOTTOM : CENTER);
    text(n.nombre, n.x + cx * 14, n.y + cy * 14);
  }

  fill(12, 11, 16, 255 * a);
  stroke(240, 180, 76, 255 * a);
  strokeWeight(1.5);
  const latido = vozSuena() ? 6 * sin(millis() * 0.008) : 0; // la voz late mientras suena
  circle(voz.x, voz.y, 64 + latido);
  noStroke();
  fill(240, 180, 76, 255 * a);
  textAlign(CENTER, CENTER);
  textSize(15);
  text('Voz', voz.x, voz.y);

  // instrucciones de sonido
  const respira = 0.75 + 0.25 * sin(millis() * 0.003); // el texto respira para llamar la atención
  const aviso = vozSuena() ? '■ toca para detener' : '♪ toca la voz para escucharla';
  noStroke();
  textSize(12);
  fill(12, 11, 16, 220 * a); // un fondo oscuro para que las líneas no lo tapen
  rectMode(CENTER);
  rect(voz.x, voz.y + 52, textWidth(aviso) + 16, 22, 4);
  rectMode(CORNER);
  textAlign(CENTER, CENTER);
  fill(240, 180, 76, 255 * a * respira);
  text(aviso, voz.x, voz.y + 52);
  if (!elegido && !vozSuena()) {
    fill(236, 231, 223, 160 * a);
    textAlign(CENTER, BOTTOM);
    text('o toca un concepto para oír sus uniones', width / 2, height - 24);
  }

  if (elegido) {
    const c = CONCEPTOS.find(c => c.nombre === elegido);
    fill(236, 231, 223, 230 * a);
    textAlign(LEFT, BOTTOM);
    textSize(13);
    text(c.nombre.toUpperCase() + '\n' + c.nota + '\nSe cruza con: ' + c.con.join(', '), 24, height - 24);
  }
}

// ---------- Interacción ----------
function mouseClicked() {
  if (prof < 0.9) return;
  const voz = { x: width / 2, y: height * 0.6 };

  if (dist(mouseX, mouseY, voz.x, voz.y) < 34) { // se tocó «Voz»
    if (vozSuena()) detenerVoz(); else componerVoz();
    return;
  }

  detenerVoz();
  const tocado = posiciones(voz).find(n => dist(mouseX, mouseY, n.x, n.y) < 16);
  elegido = tocado ? tocado.nombre : null;
  encendidas = {};
  if (tocado) tejerSonido(tocado);
}

// ---------- La composición de la voz ----------
function vozSuena() {
  return millis() < vozHasta;
}

function uniones() {
  // todas las relaciones del diagrama, cada par una sola vez, en el orden del círculo
  const lista = [];
  const vistas = new Set();
  for (const c of CONCEPTOS) {
    for (const otro of c.con) {
      const clave = [c.nombre, otro].sort().join('|');
      if (vistas.has(clave)) continue;
      vistas.add(clave);
      lista.push({ a: c.nombre, b: otro, clave });
    }
  }
  return lista;
}

function componerVoz() {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
  audio.resume();
  elegido = null;
  encendidas = {};

  const lista = uniones();
  lista.forEach((u, k) => {
    const retraso = PAUSA_VOZ * k;
    encendidas[u.clave] = millis() + retraso * 1000;
    if (!VOZ_AUDIO) {
      tocarNota(CONCEPTOS.findIndex(x => x.nombre === u.a), retraso, 'sine', 1);    // hilo de Keratuma
      tocarNota(CONCEPTOS.findIndex(x => x.nombre === u.b), retraso, 'triangle', 0.5); // hilo de Luis, una octava abajo
    }
  });

  let dura = PAUSA_VOZ * lista.length + 3;
  if (VOZ_AUDIO) {
    vozArchivo = new Audio(VOZ_AUDIO);
    vozArchivo.play().catch(() => {});
    vozArchivo.onloadedmetadata = () => { vozHasta = millis() + vozArchivo.duration * 1000; };
  } else {
    // cierre: una nota grave larga que reúne todo
    const fin = PAUSA_VOZ * lista.length;
    tocarNota(0, fin, 'sine', 0.25, 4);
    tocarNota(3, fin, 'sine', 0.5, 4);
  }
  vozHasta = millis() + dura * 1000;
}

function detenerVoz() {
  vozHasta = 0;
  if (vozArchivo) { vozArchivo.pause(); vozArchivo = null; }
  if (audio) for (const o of notasVivas) { try { o.stop(); } catch (e) {} }
  notasVivas = [];
}

// ---------- Sonido ----------
function tejerSonido(c) {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
  audio.resume();

  tocarNota(CONCEPTOS.findIndex(x => x.nombre === c.nombre), 0); // la nota del concepto tocado

  c.con.forEach((otro, j) => {
    const retraso = PAUSA * (j + 1);
    const clave = [c.nombre, otro].sort().join('|');
    encendidas[clave] = millis() + retraso * 1000;

    if (SONIDOS[clave]) {
      setTimeout(() => new Audio(SONIDOS[clave]).play().catch(() => {}), retraso * 1000);
    } else {
      tocarNota(CONCEPTOS.findIndex(x => x.nombre === otro), retraso);
    }
  });
}

function tocarNota(i, retraso, timbre = 'sine', octava = 1, largo = 1.6) {
  if (i < 0) return;
  const t = audio.currentTime + retraso;
  const frecuencia = 220 * octava * pow(2, ESCALA[i % ESCALA.length] / 12);

  const osc = audio.createOscillator();
  const vol = audio.createGain();
  osc.type = timbre;
  osc.frequency.value = frecuencia;
  vol.gain.setValueAtTime(0, t);
  vol.gain.linearRampToValueAtTime(0.12, t + 0.02);        // ataque corto, como una cuerda
  vol.gain.exponentialRampToValueAtTime(0.0001, t + largo); // y se apaga despacio
  osc.connect(vol).connect(audio.destination);
  osc.start(t);
  osc.stop(t + largo + 0.1);
  notasVivas.push(osc);
  osc.onended = () => { notasVivas = notasVivas.filter(o => o !== osc); };
}

// ---------- Timecode ----------
function dibujarTimecode() {
  const FPS = 24, DUR = 47 * 60 * FPS;
  const f = round(prof * DUR);
  const hh = floor(f / (FPS * 3600));
  const mm = floor(f / (FPS * 60)) % 60;
  const ss = floor(f / FPS) % 60;
  const ff = f % FPS;
  const tc = [hh, mm, ss, ff].map(n => nf(n, 2)).join(':');

  const estacion = ESTACIONES.filter(e => e.en <= prof + 0.001).pop();
  const claro = brightness(colorDelDescenso(prof)) > 55;
  noStroke();
  fill(claro ? PALETA.tintaOscura : PALETA.tinta);
  textAlign(RIGHT, TOP);
  textSize(16);
  text(tc, width - 24, 22);
  textSize(10);
  text(estacion.nombre.toUpperCase(), width - 24, 44);

  if (prof < 0.03) {
    textAlign(CENTER, CENTER);
    textSize(12);
    text('Desciende ↓  (rueda del ratón, flechas o arrastrando)', width / 2, height - 40);
  }
}

// ---------- Grano de película ----------
function crearGrano() {
  const g = createGraphics(200, 200);
  g.pixelDensity(1);
  g.loadPixels();
  for (let i = 0; i < g.pixels.length; i += 4) {
    const v = random(255);
    g.pixels[i] = v; g.pixels[i + 1] = v; g.pixels[i + 2] = v;
    g.pixels[i + 3] = 22;
  }
  g.updatePixels();
  return g;
}

function dibujarGrano() {
  const dx = random(-200, 0), dy = random(-200, 0);
  for (let x = dx; x < width; x += 200) {
    for (let y = dy; y < height; y += 200) image(grano, x, y);
  }
}
