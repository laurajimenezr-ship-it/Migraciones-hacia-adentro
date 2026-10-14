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
      const on = elegido && (n.nombre === elegido || otro === elegido);
      stroke(on ? color(240, 180, 76, 230 * a) : color(236, 231, 223, 55 * a));
      strokeWeight(on ? 1.8 : 1);
      line(n.x, n.y, m.x, m.y);
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
  circle(voz.x, voz.y, 64);
  noStroke();
  fill(240, 180, 76, 255 * a);
  textAlign(CENTER, CENTER);
  textSize(15);
  text('Voz', voz.x, voz.y);

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
  const tocado = posiciones(voz).find(n => dist(mouseX, mouseY, n.x, n.y) < 16);
  elegido = tocado ? tocado.nombre : null;
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
