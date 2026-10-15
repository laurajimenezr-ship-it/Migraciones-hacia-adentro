// Canibalismo audiovisual — boceto p5.js para «Migraciones hacia adentro»
// El tejido de los dos hilos devora fragmentos del cine aprendido y los vuelve propios.
// Conceptos y citas: Alegría Vallejo (2021), «Migraciones hacia adentro: el canibalismo audiovisual
// desde la perspectiva de dos realizadores indígenas colombianos», Cuadernos de Música,
// Artes Visuales y Artes Escénicas 16 (2): 150-173.

// ---------- Paleta (la misma de estilos.css) ----------
const PALETA = {
  aula:  '#2f4a4f',   // la institución, donde se aprende el cine
  luz:   '#f0b44c',
  hiloA: '#d9734e',   // Mileidy
  hiloB: '#86b8ad',   // Luis
  tinta: '#ece7df'
};

// ---------- Lo ajeno y en qué se convierte ----------
// quien: 'Mileidy', 'Luis' o 'ambos' (define el color del hilo nuevo)
const FRAGMENTOS = [
  { ajeno: 'Documental de los años 60', propio: 'Primera persona', quien: 'ambos',
    nota: 'Sujetos colectivos que se piensan en singular.' },
  { ajeno: 'Autorretrato', propio: 'Cuerpo, cicatriz, testimonio', quien: 'Mileidy',
    nota: '«Esa posibilidad de hablar sirvió para empezar a sanar.»' },
  { ajeno: 'Cine etnográfico', propio: 'La mirada invertida', quien: 'Luis',
    nota: '«En la universidad entendí, me hice consciente de cómo nos retratan.»' },
  { ajeno: 'Wang Bing', propio: 'Observar lo cotidiano', quien: 'Luis',
    nota: 'De Wang Bing aprende a mirar la vida diaria.' },
  { ajeno: 'Godard · Rouch', propio: 'Pensarse a sí mismo', quien: 'Luis',
    nota: 'Na, misak es, en sus palabras, más una reflexión sobre él que sobre su pueblo.' },
  { ajeno: 'Equipo de rodaje', propio: 'Trabajo comunitario', quien: 'Mileidy',
    nota: '«Mis películas son el resultado de un trabajo comunitario.»' },
  { ajeno: 'Archivo de video', propio: 'Tradición oral', quien: 'Mileidy',
    nota: 'La cámara para guardar y volver a ver: el video continúa la memoria oral.' },
  { ajeno: 'Narración en español', propio: 'Namtrik y español', quien: 'Luis',
    nota: 'Na, misak junta la lengua propia y el español.' },
  { ajeno: 'Televisión', propio: 'Cabeza audiovisual', quien: 'Luis',
    nota: '«Esto formó mi cabeza audiovisual.»' },
  { ajeno: 'Sujeto etnográfico', propio: 'Joven, mujer, exiliada, emberá', quien: 'Mileidy',
    nota: 'Rechaza el lugar culturalista y nombra sus propias categorías.' }
];

// Tipografías del ensayo (se cargan en el .html desde Google Fonts)
const MONO = 'IBM Plex Mono';
const DISPLAY = 'Gloock';

const DIGESTION = 1.8;   // segundos que tarda en volverse propio un fragmento

let frags = [];          // fragmentos en pantalla
let hebras = [];         // hilos que forman el tejido; crece con cada fragmento devorado
let cuerpo = { x: 0, y: 0 };
let guiado = false;      // true cuando la persona mueve el cursor o el dedo
let ultimo = null, ultimoDesde = 0;
let fin = false, finDesde = 0;
let grano;

// ---------- Sonido ----------
const ESCALA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26]; // pentatónica: cualquier combinación suena bien
const BASE = 220;        // nota más grave (Hz); los parlantes del celular casi no suenan por debajo de 200
const VOLUMEN = 0.18;    // volumen general (0 a 1)
let audio = null;        // el motor de sonido del navegador; se crea con el primer toque
let desbloqueado = false;
let silencio = false;    // true si la persona apagó el sonido

function setup() {
  createCanvas(windowWidth, windowHeight);
  grano = crearGrano();
  iniciar();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function iniciar() {
  cuerpo.x = width / 2;
  cuerpo.y = height / 2;
  hebras = [nuevaHebra(PALETA.hiloA), nuevaHebra(PALETA.hiloB)];
  frags = shuffle(FRAGMENTOS.slice()).map((d, i, todos) => nuevoFragmento(d, i, todos.length));
  ultimo = null;
  fin = false;
}

function draw() {
  background(PALETA.aula);
  vineta();

  moverCuerpo();
  for (const f of frags) actualizarFragmento(f);

  for (const f of frags) if (f.estado === 'libre') dibujarMarco(f);
  dibujarCuerpo();
  for (const f of frags) if (f.estado === 'devorando') dibujarDigestion(f);

  dibujarTitulo();
  dibujarContador();
  dibujarFicha();
  dibujarFinal();
  dibujarGrano();
}

// ---------- El tejido que devora ----------
function nuevaHebra(c) {
  return { color: c, semilla: random(1000), fase: random(TWO_PI) };
}

function escala() {
  return constrain(min(width, height) / 700, 0.7, 1.2);
}

function radioCuerpo() {
  return (22 + hebras.length * 4) * escala();
}

function moverCuerpo() {
  let tx, ty, suave;
  if (fin) {
    tx = width / 2; ty = height * 0.45; suave = 0.03;
  } else if (guiado) {
    tx = mouseX; ty = mouseY; suave = 0.08;
  } else {
    // mientras nadie lo guía, deambula
    tx = width / 2 + (noise(frameCount * 0.003) - 0.5) * width * 0.6;
    ty = height / 2 + (noise(99 + frameCount * 0.003) - 0.5) * height * 0.5;
    suave = 0.02;
  }
  cuerpo.x = lerp(cuerpo.x, tx, suave);
  cuerpo.y = lerp(cuerpo.y, ty, suave);
}

function dibujarCuerpo() {
  const R = radioCuerpo();
  const n = hebras.length;
  noFill();
  hebras.forEach((h, k) => {
    stroke(h.color);
    strokeWeight(1.8);
    beginShape();
    for (let i = 0; i <= 90; i++) {
      const a = TWO_PI * i / 90;
      const trenza = sin(a * (3 + k % 3) + h.fase + frameCount * 0.02 * (k % 2 ? 1 : -1)) * R * 0.12;
      const latido = (noise(h.semilla + cos(a), h.semilla + sin(a), frameCount * 0.006) - 0.5) * R * 0.5;
      const r = R * (0.5 + 0.5 * k / max(1, n - 1)) + trenza + latido;
      vertex(cuerpo.x + cos(a) * r, cuerpo.y + sin(a) * r);
    }
    endShape();
  });
  noStroke();
  fill(PALETA.luz);
  circle(cuerpo.x, cuerpo.y, 6 + 2 * sin(frameCount * 0.1));
}

// ---------- Los fragmentos del cine aprendido ----------
function tam() {
  return constrain(width * 0.2, 96, 150);
}

function nuevoFragmento(d, i, n) {
  // repartidos en un anillo alrededor del centro, para que no se amontonen
  const arriba = 110, abajo = height - 190;
  const cx = width / 2, cy = (arriba + abajo) / 2;
  const ang = -HALF_PI + TWO_PI * (i + random(-0.2, 0.2)) / n;
  const rx = width * random(0.3, 0.38), ry = (abajo - arriba) / 2 * random(0.72, 0.9);
  return {
    d, x: cx + cos(ang) * rx, y: cy + sin(ang) * ry,
    vx: random(-0.3, 0.3), vy: random(-0.25, 0.25),
    ang: random(-0.15, 0.15), va: random(-0.002, 0.002),
    semilla: random(1000),
    estado: 'libre', t: 0
  };
}

function colorDe(d) {
  return d.quien === 'Mileidy' ? PALETA.hiloA : d.quien === 'Luis' ? PALETA.hiloB : PALETA.luz;
}

function actualizarFragmento(f) {
  const w = tam(), h = w * 9 / 16;
  if (f.estado === 'libre') {
    // los encuadres se apartan entre sí para no taparse
    for (const g of frags) {
      if (g === f || g.estado !== 'libre') continue;
      const dx = f.x - g.x, dy = f.y - g.y, d = sqrt(dx * dx + dy * dy), lejos = w * 0.95;
      if (d > 0 && d < lejos) {
        const fuerza = (lejos - d) / lejos * 0.04;
        f.vx += dx / d * fuerza;
        f.vy += dy / d * fuerza;
      }
    }
    const rapidez = sqrt(f.vx * f.vx + f.vy * f.vy);
    if (rapidez > 0.6) { f.vx *= 0.6 / rapidez; f.vy *= 0.6 / rapidez; }
    f.x += f.vx; f.y += f.vy; f.ang += f.va;
    const arriba = 110 + h / 2, abajo = height - 190 - h / 2;
    if (f.x < w / 2 || f.x > width - w / 2) f.vx *= -1;
    if (f.y < arriba || f.y > abajo) f.vy *= -1;
    f.x = constrain(f.x, w / 2, width - w / 2);
    f.y = constrain(f.y, min(arriba, abajo), max(arriba, abajo));

    const ocupado = frags.some(g => g.estado === 'devorando');
    if (guiado && !fin && !ocupado && dist(f.x, f.y, cuerpo.x, cuerpo.y) < radioCuerpo() + w * 0.3) {
      f.estado = 'devorando';
      f.t = 0;
      f.x0 = f.x; f.y0 = f.y; f.a0 = f.ang;
      f.nota = frags.filter(g => g.estado === 'digerido').length; // cada bocado, una nota más aguda
      if (sonidoListo()) { chasquido(); ablandar(f.nota); }
    }
  } else if (f.estado === 'devorando') {
    f.t = min(1, f.t + deltaTime / 1000 / DIGESTION);
    if (f.t >= 1) {
      f.estado = 'digerido';
      hebras.push(nuevaHebra(colorDe(f.d)));   // lo devorado ya es parte del tejido
      ultimo = f.d;
      ultimoDesde = millis();
      if (sonidoListo()) hilo(f.nota, f.d.quien);
      if (frags.every(g => g.estado === 'digerido')) {
        fin = true;
        finDesde = millis();
        if (sonidoListo()) acordeFinal();
      }
    }
  }
}

function dibujarMarco(f) {
  // un visor de cámara: rectángulo 16:9, esquinas y tercios
  const w = tam(), h = w * 9 / 16, k = w * 0.12;
  push();
  translate(f.x, f.y);
  rotate(f.ang);
  noFill();
  stroke(236, 231, 223, 120);
  strokeWeight(1);
  rect(-w / 2, -h / 2, w, h);
  stroke(236, 231, 223, 40);
  line(-w / 6, -h / 2, -w / 6, h / 2); line(w / 6, -h / 2, w / 6, h / 2);
  line(-w / 2, -h / 6, w / 2, -h / 6); line(-w / 2, h / 6, w / 2, h / 6);
  stroke(236, 231, 223, 235);
  strokeWeight(2);
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = sx * w / 2, cy = sy * h / 2;
    line(cx, cy, cx - sx * k, cy);
    line(cx, cy, cx, cy - sy * k);
  }
  noStroke();
  fill(PALETA.tinta);
  textFont(MONO);
  textSize(w < 120 ? 10 : 11);
  textAlign(CENTER, CENTER);
  text(f.d.ajeno.toUpperCase(), -w / 2 + 8, -h / 2, w - 16, h);
  pop();
}

function puntosDelMarco(w, h, n) {
  // n puntos repartidos por el borde del rectángulo, en el sentido del reloj
  const pts = [], per = 2 * (w + h);
  for (let i = 0; i < n; i++) {
    let d = per * i / n, x, y;
    if (d < w) { x = -w / 2 + d; y = -h / 2; }
    else if ((d -= w) < h) { x = w / 2; y = -h / 2 + d; }
    else if ((d -= h) < w) { x = w / 2 - d; y = h / 2; }
    else { d -= w; x = -w / 2; y = h / 2 - d; }
    pts.push([x, y]);
  }
  return pts;
}

function dibujarDigestion(f) {
  const e = f.t < 0.5 ? 2 * f.t * f.t : 1 - pow(-2 * f.t + 2, 2) / 2;  // suave al empezar y al terminar
  const w = tam(), h = w * 9 / 16, R = radioCuerpo();
  const px = lerp(f.x0, cuerpo.x, e), py = lerp(f.y0, cuerpo.y, e);
  const c = lerpColor(color(PALETA.tinta), color(colorDe(f.d)), e);

  // el rectángulo se ablanda hasta volverse un hilo más del tejido
  push();
  translate(px, py);
  rotate(f.a0 + e * HALF_PI);
  noFill();
  stroke(c);
  strokeWeight(1.5 + e * 0.5);
  beginShape();
  for (const [x, y] of puntosDelMarco(w, h, 80)) {
    const a = atan2(y, x);
    const r = R * 0.95 + (noise(f.semilla + cos(a), sin(a), frameCount * 0.01) - 0.5) * R * 0.4;
    vertex(lerp(x, cos(a) * r, e), lerp(y, sin(a) * r, e));
  }
  endShape(CLOSE);
  pop();

  // lo ajeno se tacha y lo propio aparece
  textFont(MONO);
  textSize(11);
  textAlign(CENTER, BOTTOM);
  const ajeno = f.d.ajeno.toUpperCase();
  const aAjeno = 255 * constrain(1.3 - e * 1.5, 0, 1);
  const yA = py - max(R, h * (1 - e) / 2) - 14;
  const tw = textWidth(ajeno);
  const xA = constrain(px, tw / 2 + 16, width - tw / 2 - 16);   // que no se salga por los bordes
  noStroke();
  fill(236, 231, 223, aAjeno);
  text(ajeno, xA, yA);
  stroke(240, 180, 76, aAjeno);
  strokeWeight(1.5);
  line(xA - tw / 2, yA - 7, xA - tw / 2 + tw * constrain(e * 2, 0, 1), yA - 7);

  noStroke();
  const cp = color(colorDe(f.d));
  cp.setAlpha(255 * constrain(e * 1.6 - 0.4, 0, 1));
  fill(cp);
  textFont(DISPLAY);
  textSize(20 * escala());
  textAlign(CENTER, TOP);
  const tp = textWidth(f.d.propio);
  text(f.d.propio, constrain(cuerpo.x, tp / 2 + 16, width - tp / 2 - 16), cuerpo.y + R + 18);
}

// ---------- Textos ----------
function dibujarTitulo() {
  const x = 24, y = 26, w = min(520, width - 150);
  noStroke();
  textAlign(LEFT, TOP);
  textFont(MONO);
  textSize(10);
  fill(240, 180, 76);
  text('CANIBALISMO AUDIOVISUAL', x, y);
  fill(PALETA.tinta);
  textFont(DISPLAY);
  textSize(width < 500 ? 19 : 24);
  text('«Solo me interesa lo que no es mío.»', x, y + 18, w, 70);
  fill(236, 231, 223, 150);
  textFont(MONO);
  textSize(10);
  text('Oswald de Andrade, Manifiesto antropófago, 1928', x, y + (width < 500 ? 70 : 52), w, 30);
}

function dibujarContador() {
  const comidos = frags.filter(f => f.estado === 'digerido').length;
  noStroke();
  fill(PALETA.tinta);
  textFont(MONO);
  textAlign(RIGHT, TOP);
  textSize(16);
  text(nf(comidos, 2) + ' / ' + nf(frags.length, 2), width - 24, 24);
  textSize(10);
  text('DEVORADOS', width - 24, 46);

  // estado del sonido
  const anchoAviso = width < 500 ? 130 : 300;
  const activo = audio && audio.state === 'running';
  fill(240, 180, 76, activo && !silencio ? 200 : 255 * (0.75 + 0.25 * sin(millis() * 0.004)));
  text(!activo ? '♪ TOCA PARA ACTIVAR EL SONIDO'
       : silencio ? '♪ SONIDO APAGADO · TOCA AQUÍ'
       : '♪ SONIDO · TOCA AQUÍ PARA APAGAR', width - 24 - anchoAviso, 66, anchoAviso, 40);
}

function dibujarFicha() {
  const x = 24, w = min(440, width - 48), y0 = height - 170;
  noStroke();
  textAlign(LEFT, TOP);

  if (!ultimo) {
    // instrucción antes del primer bocado
    const respira = 0.8 + 0.2 * sin(millis() * 0.003);
    fill(240, 180, 76, 255 * respira);
    textFont(MONO);
    textSize(13);
    const activo = audio && audio.state === 'running';
    text(!activo ? 'Toca la pantalla para activar el sonido. Luego mueve el cursor o el dedo: el tejido te sigue y devora los fragmentos del cine.'
         : guiado ? 'Lleva el tejido hasta un encuadre.'
         : 'Mueve el cursor o el dedo: el tejido te sigue y devora los fragmentos del cine.', x, y0 + 50, w, 70);
  } else {
    const a = 255 * constrain((millis() - ultimoDesde) / 600, 0, 1);
    const c = color(colorDe(ultimo));
    c.setAlpha(a);
    fill(c);
    textFont(MONO);
    textSize(10);
    text('DEVORADO · ' + (ultimo.quien === 'ambos' ? 'MILEIDY Y LUIS' : ultimo.quien.toUpperCase()), x, y0);
    fill(236, 231, 223, a * 0.6);
    text('ANTES: ' + ultimo.ajeno.toUpperCase(), x, y0 + 16, w, 20);
    fill(236, 231, 223, a);
    textFont(DISPLAY);
    textSize(24);
    text(ultimo.propio, x, y0 + 32, w, 34);
    textFont(MONO);
    textSize(12);
    fill(236, 231, 223, a * 0.85);
    text(ultimo.nota, x, y0 + 68, w, 64);
  }

  fill(236, 231, 223, 110);
  textFont(MONO);
  textSize(9);
  text(width < 600
    ? 'Fuente: Alegría Vallejo (2021), Cuadernos MAVAE 16 (2).'
    : 'Conceptos y citas: Alegría Vallejo (2021), «Migraciones hacia adentro: el canibalismo audiovisual…», Cuadernos de Música, Artes Visuales y Artes Escénicas 16 (2).',
    x, height - 24, width - 48, 20);
}

function dibujarFinal() {
  if (!fin) return;
  const a = 255 * constrain((millis() - finDesde - 600) / 1200, 0, 1);
  if (a <= 0) return;
  const R = radioCuerpo();
  noStroke();
  textAlign(CENTER, TOP);
  fill(236, 231, 223, a);
  textFont(DISPLAY);
  textSize(width < 500 ? 22 : 30);
  text('Un cine mestizo, en primera persona.', 24, cuerpo.y + R + 30, width - 48, 80);
  fill(240, 180, 76, a);
  textFont(MONO);
  textSize(11);
  text('Lo devorado ya es propio · toca para volver a empezar', 24, cuerpo.y + R + (width < 500 ? 90 : 76), width - 48, 40);
}

// ---------- Interacción ----------
function mouseMoved() { guiado = true; }

function mouseDragged() {
  guiado = true;
  prepararAudio();
  return false;   // en el celular, evita que la página se mueva
}

function mouseReleased() { prepararAudio(); }

function mousePressed() {
  const yaSonaba = audio && audio.state === 'running';
  prepararAudio();

  // tocar la esquina del sonido lo apaga o lo enciende
  if (yaSonaba && mouseX > width - 200 && mouseY < 90) {
    silencio = !silencio;
    return;
  }
  if (fin && millis() - finDesde > 1500) {
    iniciar();
    guiado = false;
  } else {
    guiado = true;
  }
}

// ---------- Sonido de cada bocado ----------
function sonidoListo() {
  return audio && audio.state === 'running' && !silencio;
}

function frec(nota, octava = 1) {
  return BASE * octava * pow(2, ESCALA[nota % ESCALA.length] / 12);
}

function chasquido() {
  // lo ajeno: un golpe seco y corto, como una claqueta
  const t = audio.currentTime, n = floor(audio.sampleRate * 0.06);
  const buf = audio.createBuffer(1, n, audio.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * pow(1 - i / n, 4);
  const src = audio.createBufferSource();
  src.buffer = buf;
  const filtro = audio.createBiquadFilter();
  filtro.type = 'bandpass'; filtro.frequency.value = 2200; filtro.Q.value = 0.8;
  const vol = audio.createGain();
  vol.gain.value = VOLUMEN * 2.5;
  src.connect(filtro).connect(vol).connect(audio.destination);
  src.start(t);
}

function ablandar(nota) {
  // mientras digiere: un tono áspero que se suaviza y baja hasta su nota
  const t = audio.currentTime, dur = DIGESTION, f = frec(nota);
  const osc = audio.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(f * 1.5, t);
  osc.frequency.exponentialRampToValueAtTime(f, t + dur * 0.8);
  const filtro = audio.createBiquadFilter();
  filtro.type = 'lowpass';
  filtro.frequency.setValueAtTime(3500, t);
  filtro.frequency.exponentialRampToValueAtTime(300, t + dur);
  const vol = audio.createGain();
  vol.gain.setValueAtTime(0, t);
  vol.gain.linearRampToValueAtTime(VOLUMEN * 0.45, t + 0.05);
  vol.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(filtro).connect(vol).connect(audio.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function hilo(nota, quien, retraso = 0, largo = 2.4) {
  // lo propio: una nota limpia que queda resonando, con el timbre de quien lo transformó
  if (quien === 'Mileidy' || quien === 'ambos') tono(frec(nota, 2), 'sine', retraso, largo);
  if (quien === 'Luis' || quien === 'ambos') tono(frec(nota, 1), 'triangle', retraso, largo);
}

function tono(f, timbre, retraso, largo) {
  const t = audio.currentTime + retraso;
  const osc = audio.createOscillator();
  osc.type = timbre;
  osc.frequency.value = f;
  const vol = audio.createGain();
  vol.gain.setValueAtTime(0, t);
  vol.gain.linearRampToValueAtTime(VOLUMEN, t + 0.02);
  vol.gain.exponentialRampToValueAtTime(0.0001, t + largo);
  osc.connect(vol).connect(audio.destination);
  osc.start(t);
  osc.stop(t + largo + 0.1);
}

function acordeFinal() {
  // todo lo devorado suena junto: las diez notas en arpegio y una nota grave que las sostiene
  frags.forEach((f, i) => hilo(f.nota, f.d.quien, 0.6 + i * 0.14, 4));
  tono(frec(0, 1), 'triangle', 0.6, 5);
}

function prepararAudio() {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
  if (audio.state !== 'running') audio.resume();
  if (desbloqueado) return;
  // En iPhone, el interruptor de silencio apaga el sonido de las páginas.
  // Un audio silencioso en bucle le indica al teléfono que esto es reproducción, como un video.
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  const mudo = new Audio(crearSilencio());
  mudo.loop = true;
  mudo.play().then(() => { desbloqueado = true; }).catch(() => {});
  const s = audio.createBufferSource();
  s.buffer = audio.createBuffer(1, 1, 22050);
  s.connect(audio.destination);
  s.start(0);
}

function crearSilencio() {
  // un archivo .wav de una décima de segundo en silencio, fabricado en el momento
  const n = 4410, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const w = (o, txt) => { for (let i = 0; i < txt.length; i++) v.setUint8(o + i, txt.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 44100, true); v.setUint32(28, 88200, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, n * 2, true);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}

// ---------- Atmósfera ----------
function vineta() {
  const g = drawingContext.createRadialGradient(
    width / 2, height / 2, min(width, height) * 0.2,
    width / 2, height / 2, max(width, height) * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(8,14,15,0.6)');
  drawingContext.fillStyle = g;
  drawingContext.fillRect(0, 0, width, height);
}

function crearGrano() {
  const g = createGraphics(200, 200);
  g.pixelDensity(1);
  g.loadPixels();
  for (let i = 0; i < g.pixels.length; i += 4) {
    const v = random(255);
    g.pixels[i] = v; g.pixels[i + 1] = v; g.pixels[i + 2] = v;
    g.pixels[i + 3] = 20;
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
