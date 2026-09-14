/* La imagen del día, para publicar.
 *
 * Lee promos.json y arma, para hoy (o la fecha que le pases), una imagen
 * cuadrada para el feed y una vertical para historias / estado de WhatsApp,
 * más el texto para pegar como epígrafe. Sale en hoy/.
 *
 *   node herramientas/imagen-del-dia.js               hoy
 *   node herramientas/imagen-del-dia.js 2026-09-15    otro día
 *
 * Elige igual que el aviso de la mañana de la app: primero DÓNDE (el súper,
 * la farmacia, la nafta: lo que usa todo el mundo) y recién ahí el mejor
 * porcentaje. Un 50% en un bar puntual no entra. Solo promos nacionales:
 * el posteo lo ve gente de todo el país.
 *
 * Necesita playwright (npm i) con su Chromium (npx playwright install chromium).
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const SALIDA = path.join(RAIZ, 'hoy');
const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const DIAS_BONITOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
               'septiembre', 'octubre', 'noviembre', 'diciembre'];

const GRANDES = ['coto', 'carrefour', 'dia', 'día', 'jumbo', 'disco', 'vea', 'changomás', 'changomas',
  'hiper changomás', 'más online', 'la anónima', 'la anonima', 'diarco', 'makro', 'vital', 'maxiconsumo',
  'yaguar', 'masgo', 'másgo', 'farmacity', 'farmaonline', 'ypf', 'shell', 'axion', 'puma', 'easy',
  'sodimac', 'mercado libre', 'pedidosya', 'pedidos ya', 'rappi'];

const GRUPOS = [
  { titulo: 'Súper',    icono: '🛒', rubros: ['supermercados', 'mayoristas'] },
  { titulo: 'Farmacia', icono: '💊', rubros: ['farmacia'] },
  { titulo: 'Nafta',    icono: '⛽', rubros: ['combustible'] },
];

const LINK = 'https://play.google.com/store/apps/details?id=ar.com.descuentos.conquepago';

/* ---------- elegir ---------- */

const fecha = process.argv[2]
  ? new Date(process.argv[2] + 'T12:00:00')
  : new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
const iso = fecha.getFullYear() + '-' + String(fecha.getMonth() + 1).padStart(2, '0') + '-' + String(fecha.getDate()).padStart(2, '0');
const dia = DIAS[fecha.getDay()];

const datos = JSON.parse(fs.readFileSync(path.join(RAIZ, 'promos.json'), 'utf8'));
const vigentes = datos.promos.filter(p =>
  p.descuento_pct > 0 && p.confianza !== 'baja' &&
  (p.dias || []).includes(dia) &&
  p.vigencia_desde <= iso && iso <= p.vigencia_hasta &&
  (!p.zona || p.zona === 'Nacional')
);

/* Billeteras y bancos que tiene muchísima gente: el posteo les habla a ellos.
   Las tarjetas de un comercio (Cencopay, Carrefour Banco) o los planes pagos
   (Brubank Plan One) pueden tener el número más alto del día, pero le sirven
   a poca gente: van último. */
const MASIVOS = ['mercado_pago', 'cuenta_dni', 'modo', 'naranja_x', 'personal_pay', 'uala', 'galicia',
                 'santander', 'bbva', 'macro', 'bna_mas', 'ciudad', 'icbc', 'buepp'];
const RAROS = ['cencopay', 'clarin365_cencopay', 'carrefour_banco', 'tci', 'sol', 'credicuotas',
               'sidecreer', 'prex', 'brubank'];

const esGrande = p => {
  const nombre = ' ' + ((p.comercios || [])[0] || '').toLowerCase() + ' ';
  return GRANDES.some(g => nombre.includes(' ' + g + ' '));
};
const generico = p => /adherid|cercan|seleccionad|participantes/i.test((p.comercios || [])[0] || '');
const acumulable = p => !/no acumulable/i.test(p.requisitos || '');
const pesa = p => (esGrande(p) ? 1 : 0) - (generico(p) ? 1 : 0) +
                  (MASIVOS.includes(p.medio) ? 1 : 0) - (RAROS.includes(p.medio) ? 1 : 0);
/* "Cencopay (tarjeta de crédito Cencosud)" no entra en una tarjeta: solo el nombre. */
const nombreMedio = p => (p.medio_nombre || '').replace(/\s*\(.*\)\s*/, '').trim();

const topeTexto = p => p.tope_monto
  ? 'tope $' + p.tope_monto.toLocaleString('es-AR') +
    (p.tope_periodo === 'semanal' ? ' por semana' : p.tope_periodo === 'mensual' ? ' por mes' : '')
  : (p.tope_publicado === false ? 'tope no publicado' : 'sin tope');

/* Para cada grupo: la mejor. Si el comercio da algo con cualquier medio de
   pago (Comunidad Coto, Carrefour Maxi) y se suma, se muestra el total. */
function mejorDe(grupo) {
  const del = vigentes.filter(p => grupo.rubros.includes(p.rubro));
  if (!del.length) return null;

  const candidatos = [];
  del.forEach(p => {
    if (p.medio === 'cualquiera') return;
    const base = del.find(b => b.medio === 'cualquiera' && b !== p && acumulable(b) && acumulable(p) &&
                               b.comercios.some(c => p.comercios.includes(c)));
    if (base) {
      const comercio = base.comercios.find(c => p.comercios.includes(c));
      candidatos.push({ peso: pesa(p), pct: p.descuento_pct + base.descuento_pct, comercio,
        medio: nombreMedio(p), medio_id: p.medio,
        detalle: p.descuento_pct + '% ' + nombreMedio(p) + ' + ' + base.descuento_pct + '% del comercio' });
    }
    candidatos.push({ peso: pesa(p), pct: p.descuento_pct, comercio: p.comercios[0],
      medio: nombreMedio(p), medio_id: p.medio, detalle: topeTexto(p) });
  });
  del.filter(p => p.medio === 'cualquiera').forEach(p =>
    candidatos.push({ peso: pesa(p), pct: p.descuento_pct, comercio: p.comercios[0],
      medio: 'cualquier medio de pago', medio_id: 'cualquiera', detalle: topeTexto(p) }));

  candidatos.sort((a, b) => b.peso - a.peso || b.pct - a.pct);
  return candidatos[0] || null;
}

const elegidas = GRUPOS.map(g => ({ ...g, promo: mejorDe(g) })).filter(g => g.promo);
if (!elegidas.length) { console.error('No hay promos nacionales para el ' + iso); process.exit(1); }

/* ---------- textos ---------- */

const bonito = DIAS_BONITOS[fecha.getDay()] + ' ' + fecha.getDate() + ' de ' + MESES[fecha.getMonth()];

const epigrafe = [
  'Hoy ' + bonito + ' te conviene:',
  '',
  ...elegidas.map(g => g.icono + ' ' + g.promo.comercio + ': ' + g.promo.pct + '% con ' + g.promo.medio +
                       ' (' + g.promo.detalle + ')'),
  '',
  'Todos los descuentos de tus billeteras, día por día, en la app ¿Con qué pago? Gratis, para Android:',
  LINK,
  '',
  '#descuentos #promosbancarias #cuentadni #mercadopago #modo #ahorro #argentina'
].join('\n');

/* ---------- dibujar ---------- */

const COLORES = {
  mercado_pago: '#00a1ea', cuenta_dni: '#00926f', modo: '#ff4b26', naranja_x: '#ff6a00',
  personal_pay: '#6d3bd6', bna_mas: '#12457f', uala: '#e0405d', galicia: '#f07d00', macro: '#0071b9',
  hipotecario: '#c8102e', icbc: '#9b1c31', buepp: '#00a878', ciudad: '#0b6bcb', supervielle: '#d31f2a',
  santander: '#ec0000', bbva: '#004481', credicoop: '#0a7d3c', brubank: '#6f2dbd', patagonia: '#1b3f8b',
  comafi: '#00a0e1', cualquiera: '#3a3f47'
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function html(formato) {
  const alto = formato === 'historia' ? 1920 : 1350;
  const filas = elegidas.map(g => {
    const p = g.promo;
    const color = COLORES[p.medio_id] || '#0f7b4f';
    return `
      <div class="fila">
        <div class="rubro">${g.icono} ${esc(g.titulo)}</div>
        <div class="comercio">${esc(p.comercio)}</div>
        <div class="oferta"><span class="pct">${p.pct}%</span>
          <span class="con">con <b style="color:${color}">${esc(p.medio)}</b></span></div>
        <div class="detalle">${esc(p.detalle)}</div>
      </div>`;
  }).join('');

  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { width: 1080px; height: ${alto}px; background: #0f7b4f;
           background: linear-gradient(160deg, #0f7b4f 0%, #0a5c3b 100%);
           font-family: Inter, "Segoe UI", Roboto, sans-serif; color: #fff;
           display: flex; flex-direction: column; padding: ${formato === 'historia' ? '150px 70px 130px' : '80px 70px 70px'}; }
    .cabeza { margin-bottom: ${formato === 'historia' ? 70 : 44}px; }
    .hoy { font-size: 34px; font-weight: 500; opacity: .85; letter-spacing: .02em; text-transform: uppercase; }
    .titulo { font-size: 78px; font-weight: 900; letter-spacing: -.02em; line-height: 1.05; margin-top: 10px; }
    .filas { display: flex; flex-direction: column; gap: ${formato === 'historia' ? 34 : 24}px; flex: 1; min-height: 0; }
    .fila { background: #fff; color: #15181d; border-radius: 34px; padding: 26px 44px; flex: 1;
            display: flex; flex-direction: column; justify-content: center; min-height: 0; }
    .rubro { font-size: 27px; font-weight: 700; color: #5b6270; text-transform: uppercase; letter-spacing: .06em; }
    .comercio { font-size: 58px; font-weight: 900; letter-spacing: -.02em; line-height: 1.05; margin-top: 6px;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .oferta { margin-top: 10px; display: flex; align-items: baseline; gap: 16px; }
    .pct { font-size: 80px; font-weight: 900; color: #0f7b4f; letter-spacing: -.03em; line-height: 1; }
    .con { font-size: 36px; font-weight: 500; }
    .detalle { font-size: 27px; color: #5b6270; margin-top: 8px; }
    .pie { margin-top: ${formato === 'historia' ? 60 : 40}px; display: flex; align-items: center; gap: 22px; }
    .pie img { width: 96px; height: 96px; border-radius: 22px; }
    .pie .app { font-size: 40px; font-weight: 900; letter-spacing: -.02em; }
    .pie .sub { font-size: 28px; opacity: .85; margin-top: 2px; }
  </style></head><body>
    <div class="cabeza"><div class="hoy">${esc(bonito)}</div><div class="titulo">Hoy te conviene</div></div>
    <div class="filas">${filas}</div>
    <div class="pie"><img src="file:///${path.join(__dirname, 'icono.png').replace(/\\/g, '/')}" alt="">
      <div><div class="app">¿Con qué pago?</div><div class="sub">Todos tus descuentos, día por día · gratis en Google Play</div></div></div>
  </body></html>`;
}

(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); }
  catch (e) { console.error('Falta playwright: npm i && npx playwright install chromium'); process.exit(1); }

  fs.mkdirSync(SALIDA, { recursive: true });
  const navegador = await chromium.launch();
  for (const formato of ['feed', 'historia']) {
    const alto = formato === 'historia' ? 1920 : 1350;
    const pagina = await navegador.newPage({ viewport: { width: 1080, height: alto }, deviceScaleFactor: 1 });
    await pagina.setContent(html(formato), { waitUntil: 'networkidle' });
    await pagina.waitForTimeout(500);   // que termine de bajar la tipografía
    await pagina.screenshot({ path: path.join(SALIDA, (formato === 'feed' ? 'hoy' : 'historia') + '.png') });
    await pagina.close();
  }
  await navegador.close();

  fs.writeFileSync(path.join(SALIDA, 'texto.txt'), epigrafe + '\n');
  fs.writeFileSync(path.join(SALIDA, 'fecha.txt'), iso + '\n');
  console.log('hoy/hoy.png, hoy/historia.png y hoy/texto.txt para el ' + iso + ':');
  elegidas.forEach(g => console.log('  ' + g.icono + ' ' + g.promo.comercio + ' ' + g.promo.pct + '% con ' + g.promo.medio + ' (' + g.promo.detalle + ')'));
})();
