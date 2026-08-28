# Cambios

## 2026-08-28 — El workflow creció a 41 fuentes, tres de las "muy buenas" se cayeron justo hoy, y aparece Cencopay como medio nuevo

**364 promos (era 323): 41 altas, 1 corrección de tope, 37 confirmaciones con fuente fresca.**

### El cron de las 7 no disparó, lo tuve que activar a mano
`www/js` — el workflow `.github/workflows/recolectar.yml` tiene el cron en `0 10 * * *` UTC (07:00 ARG) para dejar el `crudo/` listo media hora antes de esta corrida. Hoy no disparó solo (a las 10:38 UTC seguía sin correr desde ayer a la noche). Lo activé a mano desde la API de GitHub Actions (`workflow_dispatch`, que es un disparador legítimo del propio workflow, no el recolector local prohibido). Tardó ~4 minutos en vez de los ~2 de siempre porque el workflow creció: ya no son las 8 fuentes originales, son **41** (`tools/fuentes-recetas.js`, commit de ayer "Recolector con dos ejes: 23 comercios + 18 bancos, 40 andan"). **`www/datos/fuentes.json` quedó desactualizado**: sigue listando solo las 25 fuentes viejas y no menciona ninguna de las nuevas (Jumbo, Disco, Vea, Diarco, Maxiconsumo, Sodimac, Farmacity, Farmarket, La Anónima, Axion, Shell, YPF, ICBC, BNA, Comafi, Hipotecario, Burger King, Patagonia, McDonald's, Musimundo, Dr. Ahorro, Easy, Yaguar, Vital). Vale la pena que alguien lo ponga al día.

### Fuentes que se cayeron justo hoy (no se tocaron sus promos)
Tres fuentes "muy buena" que ayer funcionaban perfecto hoy devolvieron `(no se pudo leer nada)`: **Carrefour, ChangoMás y Día**. También cayeron **La Anónima** (403 Forbidden), **Santander** (timeout, como ya viene pasando), **YPF** ("página no disponible"), **Comafi** (verificación anti-bot de Cloudflare) y **Frávega** (403 de CloudFront). Puede ser goteo de la reescritura grande del recolector de ayer, o bloqueo temporal — no se pudo determinar la causa desde acá. Sus promos existentes quedaron sin tocar.

### Tres fuentes perdieron el día activo de cada tarjeta (dato degradado, no se cargó)
**Banco Ciudad, Supervielle y Credicoop** — las tres más grandes del proyecto — hoy trajeron el texto correcto pero **sin la marca de qué día está resaltado** en cada tarjeta (la clase CSS `active` no sobrevive a esta lectura). Las 107 tarjetas de Ciudad, las 49 de Supervielle y las 68 de Credicoop vinieron con los 7 días idénticos en cada una, así que sería inventar el día real. **No se cargó ninguna promo nueva de estas tres fuentes** ni se tocaron los días que ya teníamos (que sí vienen de una lectura anterior con el DOM real). Habría que volver a la receta de recolección y revisar por qué se perdió esa marca — antes andaba bien.

**Coto** tampoco sirvió de nuevo: el `crudo/coto.txt` de hoy solo trae cuotas sin interés por marca de tarjeta (Visa/Mastercard/Amex/Cabal), sin ningún % de descuento bancario y sin poder saber el día activo. Mismo problema que la corrida anterior.

### Altas (41)
- **Cencopay** (la cuenta/tarjeta propia de Cencosud) aparece como medio nuevo, confirmado igual en Jumbo, Disco y Vea: 25% los lunes con Cencopay Cuenta (tope $15.000) y 20% + 3 cuotas los miércoles online con la tarjeta.
- **Tarjeta Clarín 365 + Cencopay** en Jumbo y Disco: 20% lunes y jueves (15% por la tarjeta + 5% por Cencopay).
- **Banco Patagonia** en Jumbo/Disco/Vea: 30% los sábados, tope $20.000 mensual (con Visa crédito).
- **Cuenta DNI en Mostaza**: 25% pagando con dinero en cuenta (tope $8.000 semanal) y 30% pagando con NFC (tope $15.000 semanal), jueves y viernes, hasta el 11/12.
- **Banco Hipotecario en Optilook SB**: 25% los lunes, tope $10.000 — confirma que el tope real es $10.000 y no los $30.000 que fueron un error histórico del proyecto.
- **Naranja X**: 20%+14 cuotas en Viajes Naranja X y 20%+9 cuotas en Aerolíneas Argentinas, ambas del 24 al 30/08.
- **Banco Macro**: 20% en McDonald's pagando sin contacto (NFC/Google Pay/Apple Pay), 50% en pases mensuales de transporte, 30% los sábados en "movilidad urbana" (la fuente no dice con qué app, confianza media hasta confirmar), y hasta 35% en PedidosYa Plus (lunes/martes/viernes).
- **Diarco**: 20% con MODO los viernes (tope $20.000 semanal, solo sucursales seleccionadas), 20% con Banco Comafi de lunes a viernes (tope $15.000 semanal, exclusivo clientes con cuenta), y 20% con Credicuotas en la primera compra (tope $8.000).
- **Brubank**: se agregaron los planes **Plus y One** que faltaban (22 reintegros nuevos) más 4 reintegros del plan Ultra que no estaban (Rapanui, Cerini, Le Pain Quotidien, Simplicity). Antes solo teníamos 7 del plan Ultra.

### Correcciones
- **Personal Pay en Diarco (jueves/viernes, 20%)**: no tenía tope cargado, hoy el legal de Diarco lo confirmó en $7.000 semanal.

### Confirmadas con fuente de hoy (sin cambios de datos)
Cuenta DNI (11 promos: cercanía, librerías, farmacias, YPF Full, gastronomía, garrafas, marcas destacadas, ferias, Sodimac, cuotas), Banco Santa Fe (10 de las 11 que ya teníamos — el archivo de Petersen solo trajo la página 1 de 21 resultados, faltó Coto), Galicia (7: Starbucks, Mimo & Co, Jumbo, Bridgestone, Rex, CCKonex, combustible), Brubank (los 7 del plan Ultra que ya estaban), Hipotecario en Jumbo/Disco/Vea.

**Ojo con `cuenta-dni-universidades`**: la fuente de hoy dice tope $6.000 y nosotros tenemos $4.000 cargado desde antes. Mismo nivel de fuente (Cuenta DNI oficial contra sí misma en otro día) → gana el menor, así que se dejó $4.000 y quedó marcada para reconfirmar.

### Auditoría
`node tools/validar.js --arreglar`: 0 sin fuente, 0 sin verificar hace más de 10 días. Quedan 13 promos visibles con una sola fuente de prensa (la mayoría ya venían de antes: varias de Macro, Mercado Pago y MODO) y 1 de riesgo sin cruzar (`santander-transporte`, 30%+). Cola de trabajo para los próximos días.

### Nota aparte
El symlink `www/datos` (paso 0 del instructivo) queda sin trackear en `descuentos-ar` porque el `.gitignore` tiene `www/datos/` con barra final, que solo matchea directorios y no symlinks — no se commiteó, es solo un artefacto de este entorno. Se lo dejo anotado por si alguna vez conviene arreglar el patrón del `.gitignore`.

## 2026-08-27 (noche) — Primera corrida con el texto de GitHub Actions, y confirma que la corrida de la mañana ya había dejado casi todo al día

**323 promos, 2 altas, 4 correcciones.** Esta es la primera vez que corre el workflow nuevo (`.github/workflows/recolectar.yml`): abre las ocho fuentes principales con un navegador de verdad media hora antes y deja el texto en `crudo/`, porque desde acá la red de la nube sigue bloqueando salida a bancos y comercios (lo mismo que ayer). Las ocho fuentes se leyeron bien (`leido: 2026-08-27` en las ocho, ninguna con `ERROR:`).

Al comparar contra `promos.json` se vio que la corrida manual de esta mañana (la que recuperó cuatro días caídos) ya había usado Carrefour, ChangoMás, Día y Cuenta DNI a fondo, así que la mayoría de lo que trajo el `crudo/` de esta noche fue **confirmar** esos mismos datos con una lectura fresca (mismo día, mejor: cruce en el tiempo). Igual aparecieron cosas nuevas:

### Altas
- **Banco Columbia en ChangoMás, 20% los martes y sábados, tope $10.000.** Es el código `(BC)` del legal de ChangoMás que `fuentes.json` tenía anotado como "no identificado" desde hace rato — hoy el legal completo lo confirmó: es Banco Columbia, con tarjeta de crédito Visa o Mastercard.
- **Carrefour, 15% los lunes con Club LA NACIÓN en tienda** (no en Carrefour Maxi, no online, sin tope). Ya teníamos el 10% de Club LA NACIÓN de martes a domingo (ese es solo online); este es un cupón distinto que se presenta en caja y no estaba cargado.

### Correcciones
- **Credicoop en Día, miércoles: era 20%, es 25%.** El legal de Día no dice el porcentaje en texto plano, pero da el ejemplo "compra de $60.000 → reintegro de $15.000 (tope máximo)": eso es 25%, no 20%. El tope semanal de $15.000 ya estaba bien.
- **Carrefour, el 10% online: era todos los días, es solo los jueves.** Esto ya había quedado anotado como pendiente ayer ("la tarjeta dice 'válido en el mes de agosto' pero el cartel de arriba dice 'Especial Jueves'"). Hoy el legal completo lo resolvió: "VÁLIDO TODOS LOS JUEVES DE AGOSTO 2026, EXCLUSIVO ONLINE". Se corrigió a jueves solamente.
- **Cuatro cuotas de Naranja X que no coincidían con su propio id.** `cuotas-naranja_x-on-city-12`, `-cetrogar-12`, `-fr-vega-12` y `-musimundo-12` tenían guardado 14 o 15 cuotas en vez de las 12 que dice su propio id (y que confirma el listado de hoy). Se corrigieron a 12.
- Se sacó un `tope_publicado: true` que había quedado mal puesto en `club-lanacion-carrefour-10`: la promo es "sin tope" y ese campo se usa solo cuando SÍ hay tope pero no se sabe el monto. Contradecía el propio texto de `requisitos`.

### Fuentes que no sirvieron esta vez (no se tocaron sus promos)
- **Coto**: el `crudo/coto.txt` de hoy solo trajo el carrusel de "cuotas sin interés" genéricas (American Express, Visa/Mastercard), no las tarjetas de descuento bancario por día que describe `fuentes.json` (`.promo-card` con banco, día y %). Puede ser que el receta de recolección no haya alcanzado a clickear los días de la semana. Las ~35 promos de Coto (Banco Ciudad, ICBC, Credicoop, Supervielle, etc.) quedaron sin verificar hoy — llevan 6 días, todavía lejos del límite de 10.
- **Credicoop** (su propio sitio, `bancocredicoop.coop/beneficios`): el texto que trajo el navegador perdió justo lo que hace falta — qué día está "activo" (la clase CSS `active` no sobrevive a una lectura de solo texto) y el nombre del comercio (que sale del `alt` de la imagen, no del texto visible). Quedó una lista de "Supermercados 20% de ahorro" repetida 15 veces sin poder saber cuál es cuál. No se tocaron las 16 promos de Credicoop.
- **MODO**: el listado sigue mostrando solo el título de cada promo ("30% de reintegro en ChangoMás", "25% de reintegro en Jumbo, Disco y Vea", etc.), sin abrir cada una. Todas las que se alcanzan a identificar por nombre ya están cargadas por otro lado. Sigue pendiente automatizar la apertura de cada promo si se quiere aprovechar esta fuente a fondo.
- **Naranja X**: el listado que trajo hoy el navegador estaba en la pestaña de "viajes / electro / hogar", no en "supermercados" — no sirvió para reverificar los días de Coto/ChangoMás/Dia/Jumbo con Naranja X (que siguen dependiendo de que alguien entre a la ficha de cada comercio, como ya está anotado en `fuentes.json`). Sí sirvió para las cuotas de electro (arriba).

### Auditoría
`node tools/validar.js --arreglar`: 0 sin fuente, 0 sin verificar hace más de 10 días, confianzas alineadas con sus fuentes. Sigue el mismo pendiente de ayer: 15 promos visibles con una sola nota de prensa y 1 de riesgo sin cruzar (`santander-transporte`) — ninguna se pudo respaldar hoy porque son de bancos que no están entre las ocho fuentes que trae el workflow (Macro, Hipotecario, Mercado Pago, Santander, Cuenta DNI ferias/buffet).

## 2026-08-28 — Corrida sin datos: la red de la nube bloquea las ocho fuentes

**321 promos, sin cambios.** No se pudo leer ninguna fuente. No es el problema de siempre (una herramienta sin habilitar que cuelga la corrida en silencio) — esta vez `npm run recolectar` corrió entera, sin colgarse, y las ocho páginas dieron el mismo error: `net::ERR_TUNNEL_CONNECTION_FAILED`.

Antes de tocar nada se investigó la causa. El proxy de salida de este entorno en la nube (`http://127.0.0.1:37877`) contesta **403 "policy denial"** para cualquier sitio que no sea GitHub, el registro de npm o algún otro dominio de la lista blanca — se confirmó con `curl` directo a `coto.com.ar` (403) y también probando `WebFetch` contra la misma URL, que devolvió `EGRESS_BLOCKED`. O sea: no es Playwright, no es Chromium, no es una receta rota — **la política de red de este entorno no deja salir a ningún sitio de banco, billetera o super.** Ni ChangoMás, ni Día, ni Carrefour, ni Cuenta DNI, ni Naranja X, ni Credicoop, ni MODO, ni Coto.

Esto es distinto de lo que rompió las corridas del 6, 7, 9 y 24 al 26 de agosto (permisos de herramienta sin habilitar) y hace falta un arreglo distinto: **Lucía tiene que revisar la política de red saliente (network egress policy) del entorno en la nube donde corre esta tarea programada**, en la configuración del entorno en claude.ai/code, y permitir salida HTTPS a los ocho dominios de `tools/recolectar.js` (o abrir la red entera si no hay forma de listarlos uno por uno). Mientras tanto, cada corrida programada va a repetir este mismo bloqueo.

Se hizo el resto de lo que no depende de la red:
- Se movió el checkout de `descuentos-ar-datos` a `www/datos` (había quedado como carpeta hermana).
- `npm ci` — sin problemas.
- Se ajustó `tools/recolectar.js` para que use el Chromium que ya viene instalado en este entorno (`/opt/pw-browsers/chromium`) en vez de bajar uno nuevo, porque la versión que pide Playwright por default no está y bajarla también está bloqueado por la misma política de red. Sin este cambio, cada receta se hubiera colgado en la etapa de descarga del navegador en lugar de fallar rápido y con el error de red — así que el diagnóstico de arriba no hubiera sido tan claro.
- `node tools/validar.js --arreglar`: no encontró nada para corregir (0 sin fuente, 0 fuera de fecha por más de 10 días, confianzas ya alineadas). Sigue habiendo 15 promos visibles con una sola nota de prensa y 1 de riesgo sin cruzar (`santander-transporte`), igual que ayer — no se les pudo salir a buscar respaldo porque justamente eso requiere red.
- No se tocó `promos.json`: sin poder leer ninguna fuente, no hay con qué comparar, y una fuente no legible nunca borra sus promos.
- `git push` en `www/datos`: no hizo falta, no hay commit porque no hay cambios de datos que publicar.

## 2026-08-27 — Se recupera la corrida después de cuatro días caída

**321 promos, 294 visibles.** Corrida hecha a mano, para tapar el agujero.

### Primero: por qué no había datos desde el 23
`ultima-corrida.txt` había quedado en `inicio 2026-08-22 09:34` y nunca llegó a `fin OK`. Mirando la corrida del 24 se ve el patrón: arranca, lee el instructivo, hace dos llamadas a la consola y se muere ahí. **La tarea pedía un permiso que no estaba habilitado y, como no hay nadie del otro lado para darlo, se colgaba en silencio.** Es lo mismo que pasó el 6, el 7 y el 9 de agosto: entonces se habilitaron git y el navegador, pero no `node` (que hace falta para el auditor) ni escribir archivos por consola.

Se habilitaron esos permisos y se agregó al `agente-diario.md` una sección **"Con qué herramientas trabajar"**, con la lista corta de lo que se puede usar y la instrucción de no inventar comandos nuevos: si hace falta uno, se anota acá en vez de intentarlo. También, que la corrida lea el `ultima-corrida.txt` **antes** de pisarlo, para dejar rastro cuando la anterior se murió.

### La corrección más cara: el tope del Hipotecario
Teníamos **25% los martes en ChangoMás con tope $30.000**, sacado de una nota de iProfesional. La página del propio banco dice otra cosa: el tope general es **$10.000**, y los $30.000 son solo para clientes Búho. Además no es "MODO con Visa o Mastercard": es **débito Visa** pagando por QR. Nivel 1 le gana a nivel 4 y listo — pero es exactamente el tipo de error que hace que alguien llene el changuito de más.

### ChangoMás, los siete días
`masonline.com.ar` publica cada promo con día, tope y legal completo. Se leyó día por día (el listado cambia al tocar cada letra) y salieron **9 altas**: el 15% de MásClub los miércoles y jueves sin tope, el **10% de ANSES todos los días** (tope $12.000 por compra y $50.000 al mes), el 10% de empleados públicos, Credicoop con Cabal 30% los jueves, ICBC 20%, YOY 20%, Tarjeta SOL 20%, y el 30% de Patagonia Singular los sábados.

Cinco correcciones, todas de letra chica que faltaba: el 20% de MODO los lunes **pide compra mínima de $75.000** (no lo teníamos y es la diferencia entre que sirva o no), Patagonia los sábados tiene tope $10.000 mensual, Comafi sube a $15.000 si es Único Black, el 30% de ICBC es solo para cuenta sueldo, y Cuenta DNI en ChangoMás vale en la provincia, CABA y Viedma.

### Día: los legales son la mejor fuente que hay
En `diaonline` el porcentaje está adentro de una imagen, pero cada tarjeta tiene un **"Ver Legales"** que se abre con el texto entero. Trece promos quedaron respaldadas con el comercio, entre ellas el **35% del Banco Ciudad los lunes** (que se paga con QR MODO desde App Ciudad **o desde Buepp**) y el 25% del Banco del Sol los martes.

Alta nueva: **Banco de Corrientes**, que no teníamos por ningún lado — 30% los miércoles y jueves pagando desde Más Banco, tope $20.000 mensual, hasta fin de año.

### Carrefour: tres altas
El **15% de Mercado Pago los jueves, sin tope**, pagando con dinero en cuenta y mínimo $15.000 (esta es de las mejores del mes y no la teníamos). El 15% para empleados públicos, que vale en seis provincias y siete ciudades sueltas. Y el 10% de Club LA NACIÓN, solo online.

### Lo que quedó sin cargar
- **Cuenta DNI tiene 4 promos nuevas que no se pueden leer.** El listado oficial muestra un 30% los jueves y otro 30% jueves y viernes pagando con NFC, un 15% de lunes a jueves en localidades especiales y un 40% todos los días. El "Conocé más" de cada tarjeta no abre desde afuera, así que no hay ni rubro ni tope. Sin eso no se cargan: quedan como el pendiente número uno.
- **MODO en Día, viernes y sábados**: el legal da el tope ($20.000 por banco por mes, compras de $35.000 o más) pero **no dice el porcentaje**, que está adentro de la imagen. Ya la teníamos con 20% de antes; se le sumó la fuente sin tocar el número.
- **Carrefour, el 10% online**: la tarjeta dice "válido en el mes de agosto" y el cartel de arriba dice "¡Especial Jueves!". Se dejó como todos los días, que es lo que dice la promo, pero conviene volver a mirarlo.

### Limpieza
Se sacaron dos duplicados: Cuenta DNI en Carrefour estaba cargada dos veces, y el plan Inicial de Naranja X que había agregado como fila aparte ya vivía adentro de los requisitos de la promo principal.

Auditoría: **0 promos sin fuente, 0 sin verificar hace más de 10 días.** Quedan 15 apoyadas en una sola nota de prensa (venían de 20) y una de riesgo sin cruzar (`santander-transporte`).

## 2026-08-22 — Primeros bancos provinciales: la app deja de ser porteña

**303 promos, 274 visibles.** Hasta hoy, de 276 promos **una sola** era de una provincia que no fuera Buenos Aires o CABA. Ahora hay 27 más, de tres provincias.

### El hallazgo: tres bancos, una sola receta
Santa Fe, San Juan y Santa Cruz son del **grupo Petersen** y usan la misma plantilla, la misma ruta (`/beneficios-supermercados`) y el mismo formato de texto. Se leen sin tocar el DOM: el día y la vigencia están en texto plano. Quedó anotada como una sola fuente en `fuentes.json`.

- **Santa Fe (11)**: Coto 30% los jueves, La Gallega 30% los viernes, Alvear 30% los viernes.
- **San Juan (7)**: Jumbo 20% martes y jueves, Avícola Myriam 30% los viernes.
- **Santa Cruz (9)**: Coto 30% los lunes, Market Sur y Autoservicio Cerca 30% los viernes.

Ninguno publica topes, así que van con `tope_publicado: false`.

### Dos que no salieron
- **Banco Entre Ríos**: era del mismo grupo, pero sus dominios (`bersa.com.ar` y `bancoentrerios.com.ar`) hoy redirigen a **otra empresa que no es el banco**. No usar.
- **Bancor (Córdoba)**: 131 páginas, sin días en el listado y con los comercios dentro de imágenes. El filtro por rubro no responde. Córdoba es la provincia grande que sigue faltando y necesita otra estrategia.

### Mendoza y San Luis: poco, pero verificado

**307 promos, 278 visibles.**

El plan era usar el filtro de provincia de Supervielle para rescatar las 9 cadenas regionales que habíamos dejado afuera. **No se pudo: el filtro no filtra.** Mendoza, Corrientes y Tierra del Fuego devuelven exactamente las mismas 48 promos. Quedó anotado en `fuentes.json` para que nadie vuelva a confiar en él.

Lo que sí sirvió: el sitio tiene **rubros que él mismo etiqueta por provincia**, "Carnicerías Mendoza" y "Carnicerías San Luis". De ahí salieron dos promos agrupadas: 20% los martes con tope $10.000, en 5 carnicerías mendocinas y 8 puntanas.

### 🚨 Por qué no alcanza con agrupar por cercanía en la lista

Átomo y Aiello aparecen **pegados** en el listado de supermercados de Supervielle, con la misma promo y el mismo tope. La tentación era cargarlos juntos como Mendoza. Se verificó cada uno en la cadena misma:

- **Átomo**: casa central en Guaymallén, **Mendoza**.
- **Aiello**: 10 sucursales en la ciudad de **San Luis** y alrededores.

Son de provincias distintas. Agruparlos habría mandado a los puntanos a un supermercado que no existe en su provincia. **Regla: la zona se verifica en la cadena, nunca se deduce de dónde aparece en el listado.**

Las otras 7 regionales (Altué, AG Piazze, Cereales El Diamante, La Yunta, SOGO, Mercado Municipal, Europa) siguen afuera: no hay fuente que diga su provincia.

### Córdoba: callejón sin salida, y conviene que quede escrito

Se intentó a fondo y **no se cargó ni una promo**. Los cinco caminos que se probaron:

1. **El listado de Bancor**: 131 páginas. El filtro por rubro sí funciona (`?rubro=super-e-hiper`), pero da 33 páginas de comercios chicos con cuotas, sin porcentajes.
2. **Los avisos con %**: no dicen el día, y el comercio está dentro de la imagen.
3. **La página de campaña** `/oferton-4-super-y-farmacias`: tenía 30%, pero **venció el 27 de julio**.
4. **El buscador por comercio**: no es alcanzable por script, vive dentro del panel de Filtros colapsado.
5. **clubbancor.com.ar**: el dominio no resuelve.

Y el sexto, que es el que vale la pena contar: la nota que Google pone **primera** cuando buscás descuentos de Bancor es de `prensa.cba.gov.ar` y describe 5% con Cordobesa en Buenos Días, Cordiez y Almacor, con todo el detalle. **Es del 28 de diciembre de 2014.** Doce años. Sin la regla del año habría entrado como si fuera de este mes.

Córdoba solo se va a poder cubrir con **la app Bezza** —que es app-only, igual que Mercado Pago— o con capturas de alguien que viva ahí. Quedó documentado en `fuentes.json` para no repetir el intento.

### Tucumán y el NOA: tampoco, y el patrón ya es claro

Sin promos cargadas. Se probaron tres:

- **Banco del Tucumán**: el dominio **no resuelve** (timeout de DNS). Y es del grupo Macro, cuyas promos ya cubrimos por MODO.
- **Tarjeta Sucrédito**: es **la mejor candidata de todo el norte** — cubre Jujuy, Salta, Santiago del Estero y Tucumán, y **etiqueta cada promo con su provincia**. Pero el listado solo muestra provincia y rubro: el comercio y el día están dentro de las imágenes, y los `<img>` no tienen texto alternativo. Si algún día se pueden leer imágenes, esta fuente abre cuatro provincias de una sola vez.
- **La Tarjeta de la Caja** (Caja Popular de Ahorros de Tucumán): las vigencias dicen "01/11 al 18/12". La página está desactualizada.

**El patrón que se repite**: las provincias que faltan no es que no tengan promos, es que sus emisores las publican como imágenes o solo dentro de su app. Córdoba (Bezza), Tucumán (Sucrédito) y Mercado Pago tienen el mismo problema. Por eso el botón de "mandar una promo" que se agregó hoy no es un extra: **es la única vía realista para esas provincias**, y justamente sus usuarios son los más motivados a usarlo.

### Cambios en la app
- **El onboarding ahora arranca por la provincia** y recién después muestra los medios de pago que existen ahí. Sin esto, sumar bancos provinciales dejaba una lista de 40 chips con bancos de otras puntas del país.
- **Cuenta DNI ahora se muestra también en CABA.** La tiene cualquiera y los comercios adheridos están cruzando la General Paz; la tarjeta igual aclara "solo en Provincia de Buenos Aires". Al revés no: las promos de CABA no se muestran en provincia.

## 2026-08-21 (tarde) — Segunda corrida: se abrieron cuatro fuentes nuevas

**276 promos, 247 visibles** (venían 249 y 218). **Ninguna fuente falló.**

Hoy a la mañana ya había corrido el agente, así que en vez de releer lo mismo me fui a las fuentes que figuraban como "sin revisar" desde que arrancó el proyecto. Rindió mucho: **+34 promos nuevas** y un montón de topes que faltaban.

### 🚨 Para mirar: Coto tenía una pestaña entera sin leer

La página de descuentos de Coto tiene dos solapas, **Digital** y **Sucursales**, y hasta hoy solo se leía Digital. Sucursales tiene **15 promos presenciales que no estaban en ningún lado**:

- **ICBC 25% los jueves sin tope** (Plan Sueldo) y 20% con débito Visa.
- **Jubilados y pensionados 15% los jueves**, con cualquier medio, presentando DNI.
- **Ciudadanía Porteña 15% martes y jueves** y **ANSES 10% de lunes a jueves**.
- **15% los viernes con cualquier tarjeta de crédito**, sin tope.
- Mercado Pago **25% los viernes** y **20% sábados y domingos** (el domingo 23 hay 5% extra pagando con QR con la crédito MP Mastercard).

Y de paso confirmó dos cosas que veníamos arrastrando: el **30% de los jueves con Visa débito NFC** es de Coto y está en su propia web (era el que teníamos por MODO), y las dos promos de Mercado Pago que estaban en confianza media **pasaron a alta**.

**Ojo con Comunidad Coto**: la teníamos en 20% los miércoles y la web oficial dice **15%**. Le bajé el número. Además figura solo en Sucursales, no en Digital.

### 🚨 Para mirar: Banco Ciudad da 35% los lunes en Día

Es la promo más fuerte que apareció hoy. **35% en Día todos los lunes**, pagando con QR MODO desde la app Ciudad o Buepp con crédito Mastercard del Ciudad, **tope $20.000 por mes**. Vale hasta el 31/08.

### Día: la fuente que parecía imposible resultó de las mejores

Las tarjetas de Día son imágenes (el % está dentro del JPG), pero cada una tiene un **"Ver Legales"** que despliega el texto legal completo con día, porcentaje, tope y vigencia. Ya quedó anotada la receta en `fuentes.json`.

Nuevas de ahí: **Banco del Sol 25% los martes** (tope $10.000/mes), **Columbia 20% lunes y viernes** (tope $10.000 por transacción, va hasta el 30/09), **Ciudadanía Porteña 15% lunes y jueves** en CABA, **Sidecreer 25% los domingos** en Entre Ríos y **3 cuotas sin interés los sábados** con cualquier tarjeta.

Correcciones que salieron de los legales oficiales:

- **Naranja X en Día es los MARTES, no los lunes.** Lo teníamos mal (venía de una nota de prensa). Lo dicen tanto el legal de Día como la web de Naranja X. Borré `naranja-dia-lunes-epico` y la cargué de nuevo con el día bueno.
- El **tope del 25% de Naranja X** en supermercados es **$9.500 por semana** (Plan Turbo). Estaba sin tope.
- **MODO 20% viernes y sábados en Día pide compra mínima de $35.000.** No lo teníamos y es un dato que cambia la decisión en la caja.
- **Personal Pay 15% los jueves en Día es sin tope y sin mínimo**, una compra por jueves. Antes figuraba con el tope sin publicar.
- **Credicoop los miércoles en Día**: ahora sabemos el tope, **$15.000 por miércoles**, y que va hasta el 30/09. **Sigue en confianza media por el porcentaje**: la web del banco muestra 25% en la tarjeta y 20% en su etiqueta interna, y el ejemplo del legal de Día ($60.000 → $15.000) también da 25%. Cargué el menor, 20%, como manda la regla. Vale la pena mirarlo en la app del banco y cerrarlo.

### Carrefour: 31 promos en texto plano y apareció Carrefour Banco

Otra que nunca se había leído. Ojo con la URL: `/promociones-bancarias` redirige a `/descuentos-bancarios`. Está todo en texto, con el legal completo al lado.

Entró **Carrefour Banco** como medio nuevo, con 6 promos: 20% los martes sin tope, 20% los jueves (solo online, tope $10.000/semana), 15% los viernes sin tope, 15% lunes y martes, 10% sábados y domingos, y 3 cuotas sin interés el fin de semana. También **10% para socios de Mi Carrefour que cobran ANSES o son mayores de 60** (lunes a miércoles, tope $35.000) y **10% online con cualquier medio** (tope $8.000/semana).

Correcciones:

- **La promo de Mercado Pago + ANSES es sábados y domingos**, no todos los días como decía la nota de prensa.
- Estaban **cargadas dos veces**: `mp-carrefour-finde` y `mp-carrefour-anses` eran la misma. Borré la duplicada.
- **Banco Patagonia ya tiene topes**: 15% clásica tope $10.000, Plus 20% tope $15.000, Singular 30% tope $20.000. Antes figuraba "tope no publicado".

### Brubank y Ualá

**Brubank** (`/descuentos` da 404, es `/beneficios`) tiene 46 reintegros, pero repartidos en tres planes (One, Plus, Ultra) que el sitio muestra todos juntos en el HTML. Cargué **7**, las de rubros que sirven: Axion 30%, YPF 10% los lunes, Farmacity 30%, Cabify 40%, Taxi Premium 40%, Burger King 30% y Freddo 40%, todas con tope $6.000 y aclarando en la tarjeta qué da cada plan. No tiene supermercados.

**Ualá**: el 50% en colectivos dejó de ser un dato flojo. La ficha oficial dice todo: **tope $15.000 por mes por tarjeta, del 17/08 al 30/09**, con Mastercard por NFC desde la billetera, en Dota, Sistema Independencia y SUBE Viajes. Pasó de baja a **alta**. Es la misma campaña de Mastercard que el 50% de Galicia.

### Limpieza: 36 tarjetas mostraban notas internas al usuario

36 promos de Banco Ciudad tenían en `requisitos` la frase *"La web no muestra el tope en el listado; hay que abrir la promo"*. Eso lo lee el usuario en la tarjeta de la app y no le sirve de nada. Lo saqué y le puse `tope_publicado: false`, que es la forma correcta de decir lo mismo.

### Lo que quedó afuera a propósito

- El **10% de ANSES en Día** y el **% de Credicoop**: el legal no los dice, están solo dentro de la imagen, y hoy no se pudieron leer imágenes.
- Los **15% para empleados públicos de Carrefour** (miércoles y jueves): no aclaran con qué medio de pago se paga, así que no sirven.
- **Banco de Corrientes** en Día (5% mié/jue y 30% con Más Banco): es regional y quedó para la próxima.
- El **selector de día de Coto** y las **fichas por comercio de Ualá** todavía no se explotaron.

### Sin cambios

Las 27 promos que siguen con fecha vieja son las mismas de siempre: las que ninguna fuente confirma (Santander por prensa, las de Mercado Pago sin fuente propia, Ualá ChangoMás). **Todas ya estaban en confianza baja, así que la app no las muestra.** No se borró ninguna.

También agregué al código de la app los colores de los cuatro medios nuevos (Carrefour Banco, Brubank, Banco del Sol y Sidecreer), que si no salían todos grises.

---

## 2026-08-21 — Corrida diaria (arrancó el 20 a la noche y cruzó la medianoche)

**249 promos, 218 visibles.** Se leyeron enteras Naranja X, Coto, Banco Ciudad, Personal Pay, la tabla oficial de Cuenta DNI en La Nación, Galicia y MODO, más las dos notas de iProfesional. **Ninguna fuente falló.**

Venían 11 días sin corrida (la última fue el 10/08), así que casi todo estaba por vencer.

### 🚨 Para mirar: hubo otro agente tocando estos mismos datos anoche

Mientras esta corrida estaba en la mitad, otra sesión commiteó cinco veces en este repo (20:43, 23:20, 23:26 y 00:06) y agregó 43 promos: Supervielle, Credicoop, Patagonia, Buepp y cuotas de Macro. **No se perdió nada** —esta corrida arrancó desde ese trabajo, no lo pisó—, pero conviene no largar dos agentes juntos sobre la misma carpeta.

Esas 43 promos venían selladas con fecha 10/08 aunque se habían leído anoche. **Les corregí la fecha al 21/08**, porque si no hoy figuraban vencidas y la próxima corrida las bajaba a confianza baja sin motivo.

Y me equivoqué en el camino: borré `supervielle-coto-nfc-jueves` porque no figura en la web de Coto, sin darme cuenta de que el otro agente la había sacado de la web del propio Supervielle. **Está restaurada**, y encima quedó confirmada por MODO (ver abajo).

### 🚨 Para mirar: Coto tiene 30% los jueves sin tope, y es de MODO

La ficha oficial de MODO lo dice completo: **30% de descuento en Coto los jueves, sin tope de reintegro**, pagando sin contacto (NFC) con tarjeta de débito Visa de cualquiera de los bancos adheridos. Vigente hasta el 27/08. Esto explica tres cosas sueltas que veníamos arrastrando: el 30% de los jueves que anuncia Naranja X, el de Supervielle y el que no aparecía en la web de Coto. Es todo la misma campaña.

### Naranja X volvió a publicar los días

Hace un mes había dejado todo en "días seleccionados" y no se podía usar. Ahora la ficha de cada comercio sí los dice: **25% los martes en Coto, ChangoMás, Jumbo, Disco, Vea y Día**, con Plan Turbo (en Coto el tope es $9.500 por semana). Con eso se resolvió `naranja-cadenas-dias-selec`, que estaba oculta hace días esperando justamente ese dato.

Lo mismo con la deportiva: **Dexter, Stock Center, Moov y Adidas son 20% los lunes y martes**, con 6 cuotas. Estaba oculta desde el 09/08.

Cuotas que se movieron: Musimundo 14 → 15, Frávega 12 → 14, On City 14 → 15. Volvió Whirlpool y se sumaron Carrefour (4 cuotas), Suavestar, Cannon, Rosen y Lacoste. Se cayeron Casa del Audio, La Cardeuse Solar, Essen y Piero.

El 25% + 5 cuotas de indumentaria venció el 16/08: **borrada**. Y el 50% en transporte con NFC ya no figura en la web, así que quedó oculta.

### Coto: topes nuevos y volvió Comunidad Coto

Aparecieron tres que no teníamos: **ICBC 30% los lunes** (solo Plan Sueldo, tope $20.000), **Supervielle Identité 25% los martes** sin tope, y el 30% de MODO de los jueves.

**Comunidad Coto volvió**, pero cambiada: era 15% todos los días y ahora es **20% los miércoles**, con cualquier medio de pago y sin límite de reintegro. Estaba oculta desde el 09/08.

Ojo con Credicoop: el 30% de los lunes vale **solo los lunes 3, 10, 24 y 31 de agosto**. El 17 no valía y el 24 sí. Lo dice la letra chica y ahora está en la tarjeta.

### Banco Ciudad pasó de 124 a 231 tarjetas, y cambió cómo marca los días

**Trampa nueva**: el sitio ahora arma la lista con dos componentes distintos y el día activo puede venir con la clase `active` o con `dia-beneficio fw-bold`. Con la receta vieja de `fuentes.json` salían todas sin días. Ya está anotado en las fuentes.

Se sumaron 19 promos, entre ellas **Coto 20% los martes sin tope**, MásGO 20% los domingos, Casa del Audio 20% jueves y viernes, JetSMART 20% de lunes a jueves, Under Armour y Champion 20% los miércoles, y dos paquetes agrupados: deportivas 15% los martes (Dexter, Stock Center, Moov, Montagne, Ruiz y Roca) y **librerías y jugueterías 20% los viernes**, que son más de 30 comercios.

Se cayó **Easy 20% los miércoles**: borrada. Y **Wico Combustible** desapareció de Ciudad pero MODO la sigue listando, así que quedó en confianza media.

### Cuenta DNI: sin un solo cambio

La tabla oficial del Banco Provincia está idéntica a la del 10/08, las 17 filas. Se refrescó la fecha y listo. Universidades 40% pasó a baja: no figura en la tabla y ya son 12 días sin que aparezca en ninguna fuente.

### Galicia: aparecieron los topes

El **50% en colectivo** dejó de ser un dato de prensa: está en la web oficial con la letra chica. Tope **$15.000 por mes por tarjeta**, del 17/08 al 30/09, con crédito Mastercard por NFC desde Apple Pay o Google Pay. Pasó de media a alta.

Nuevas: **Cabify 35% los domingos** y **Uber 35% los miércoles**.

El combustible de los días 10 quedó reprogramado al 10/09, pero **en confianza media**: el aviso dice "todos los días 10 de cada mes" y la letra chica sigue diciendo "válida únicamente para el día 10/08/2026". Hay que volver a mirarla antes del 10/09.

### Santander: el tope de transporte era la mitad

Teníamos $16.000 al mes, de una nota de Canal 26. La ficha oficial de MODO dice **$8.000 por usuario por mes**. Gana la oficial. Se cayó `modo-transporte`, que era esta misma promo cargada dos veces.

### Lo que quedó oculto por no poder confirmarse

31 promos. Las que estaban al borde de los 10 días y no se pudieron releer:

- **Mercado Pago**: transporte 70%, combustible 30% y farmacias 10% (datos del 05/08, y MP no tiene web usable).
- **Santander**: Día, Carrefour y ChangoMás 25% (nota de Cronista del 05/08). Sobrevive solo transporte.
- **BBVA Black+ Save**, **Ualá ChangoMás**, **BNA+ Jumbo, Maxiconsumo y Niní**, y cinco de cuotas de MODO que hoy no aparecieron en el listado.
- **Mercado Pago en Día los miércoles** y **en Carrefour el fin de semana**: las dos notas de iProfesional se contradicen entre sí. Una da el de Día todos los miércoles y la otra solo el 5 y el 12 (o sea, ya vencido); una da el de Carrefour sábado y domingo y la otra los jueves. Mejor ocultas que mandando a alguien un día equivocado.

## 2026-08-10 — Buepp y Supervielle (a pedido, probando la app)

**201 promos, 188 visibles.**

Lucía notó que casi todo lo que veía era de Banco Ciudad. El diagnóstico: no faltaban bancos en la lista, faltaban **sus promos**. Banco Ciudad tenía 41 porque habíamos leído su web; Supervielle, Credicoop, Comafi, Patagonia, Columbia y TCI tenían **una sola cada uno**, la que Coto publica en su página. Sus sitios propios nunca se habían abierto.

### Buepp (12 beneficios)
La billetera del Banco Ciudad tiene solapa propia en su web. Se cargaron agrupadas: **30% en 8 comercios de barrio** (RES, Carnicería y Granja, Verdulería La Esquina, Churros El Topo, La Tablita, Las Medialunas del Abuelo, Mis Mascotas, Punto Sano Dietética) y **24 cuotas en 3 bicicleterías**. Zona **CABA**, que es donde están esos comercios. Cúspide quedó oculta: su tarjeta no marca ningún día.

### Supervielle: de 1 promo a 17
Su buscador de beneficios resultó **de los mejores del proyecto**: publica comercio, día, tope y tipo de tarjeta. De ahí salieron 16 promos nuevas. Las más fuertes: **30% en Coto los jueves** pagando con débito Visa por NFC, **30% en Toledo los miércoles** (tope $12.000) y 20% en Jumbo, Disco, Vea, ChangoMás, Día y La Anónima.

Tres cosas que hubo que resolver:
- El sitio mezcla **escalones de cliente** (Clásico, Plan Sueldo, Identité) como tarjetas separadas. Se cargó el escalón base y los otros van en la letra chica, para no prometerle a alguien un porcentaje que no le toca.
- Las promos de **jubilados** se agruparon en una sola entrada.
- **No se cargaron 9 cadenas regionales** de Mendoza y San Luis (Aiello, Átomo, Altué, AG Piazze, La Yunta, SOGO, Mercado Municipal, Europa, Cereales El Diamante) porque el listado sin filtrar no dice la provincia. Hay que usar el filtro de provincia del sitio antes de sumarlas.

### Credicoop: de 1 promo a 15
Su sitio de beneficios (subdominio propio) trae 158 tarjetas con comercio, día y porcentaje. Se cargaron las 14 cadenas nacionales: **30% en Coto los lunes** —la más alta del banco—, Coto Digital 30%, Jumbo 20% martes y jueves, Día 20% viernes y sábados, Disco, Vea, Makro, Niní, Toledo y los tres Diarco.

**Una la cargamos a la baja a propósito**: la de Día los miércoles. La tarjeta muestra 25% pero la etiqueta interna del propio sitio dice 20%. Cuando la fuente se contradice consigo misma, va el número menor y confianza media, con el aviso en la letra chica.

Credicoop tampoco publica topes en el listado, así que las 15 van con `tope_publicado: false`.

### Macro: se revisó a fondo y rinde poco
Se hizo la pasada dedicada. El resultado, para no repetirla: **en cadenas nacionales Macro solo ofrece cuotas**, no descuentos. Se buscó comercio por comercio en su propio buscador:

| Buscado | Qué tiene Macro |
|---|---|
| Coto | 12 cuotas sin interés |
| ChangoMás | 12 cuotas sin interés |
| Diarco | 6 y 3 cuotas |
| **Jumbo, Disco, Vea, Carrefour** | **nada** |

Sus 259 beneficios son casi todos carnicerías y verdulerías del interior, sin provincia declarada, así que no se pueden mostrar sin mentirle a alguien sobre dónde valen. Y los descuentos fuertes que sí tiene (Jumbo 20% martes y jueves, ChangoMás 20% lunes, Día 20% viernes y sábados) **van por MODO** y ya los teníamos por prensa y por la web de Coto.

Se cargaron las 3 de cuotas. La fuente quedó marcada como **calidad baja** con el detalle de por qué, para que no se gaste tiempo ahí de nuevo.

Dato técnico por si alguna vez se vuelve: el sitio tiene filtro `dia-semana`, que es el atajo para sacar los días sin abrir cada detalle (los detalles son cáscaras que llena JavaScript y no sirven para leer).

### Supervielle: otros rubros (21 promos en total)
Se leyeron combustible y farmacia. Lo mejor que apareció es **el descuento más alto de toda la app: 50% en todas las farmacias los martes** para jubilados que cobran en el banco, tope $6.000. También Farmacity online 20% los martes (tope $16.000), Farmaonline 6 cuotas y Shell 10% los domingos.

Su listado de farmacias tiene 134 entradas, pero **87 son farmacias sueltas de Mendoza** con la misma promo (20% martes y miércoles). No se cargaron: sin provincia declarada no se pueden mostrar. Las tres genéricas cubren lo que sirve a nivel nacional.

### Banco Patagonia: de 1 a 4
Su portal `ahorrosybeneficios` publica día y vigencia, pero **los comercios están en imágenes** (se sacan del texto alternativo) y **el porcentaje cambia según el nivel de tarjeta** (Clásica, Plus, Singular). Se cargó el nivel base y los otros van aclarados.

Entraron Carrefour 15% los miércoles, ChangoMás 15% los sábados y Coto Digital 20% los jueves. **Se dejaron afuera La Anónima y Cooperativa Obrera**: en el listado hay dos bloques del mismo día y vigencia, uno general y otro "EXCLUSIVO RÍO NEGRO", y no hay forma de saber cuál corresponde a cuál sin adivinar.

### ICBC no tiene web usable
`icbc.com.ar/beneficios` da 404, igual que BBVA. Sus promos siguen viniendo de Coto y de prensa.

### Lo que queda pendiente
Comafi, Columbia, TCI, Ualá y BBVA siguen con una sola promo cada uno. De Supervielle faltan indumentaria, hogar, mascotas y turismo, que son rubros de menor uso diario.

---

## 2026-08-10 — Corrida diaria

**182 promos, 170 visibles.** Ayer eran 151 y 140. Se leyeron enteras las cinco fuentes buenas (Naranja X, Coto, Banco Ciudad, Personal Pay y la tabla oficial de Cuenta DNI en La Nación) más Galicia y MODO. Todas abrieron bien: **ninguna fuente falló hoy**.

### 🚨 Para mirar: las carnicerías de Cuenta DNI ya no son 35% los sábados

La Nación publicó hoy (10/08, 07:05, año verificado) una nota dedicada al tema y es terminante: **las carnicerías dejaron de tener promo propia los sábados y pasaron adentro de "comercios de cercanía"**. Ahora son **20% de lunes a viernes**, con el mismo tope de $6.000 por semana — y ese tope es uno solo para todo el rubro, no se acumula con el resto de los comercios de cercanía.

Teníamos cargado "carnicerías 35% los sábados" (venía del epígrafe de una foto, en confianza media). **Se borró**, y las carnicerías quedaron sumadas a la promo de cercanía. Era el dato con más chance de hacer que alguien fuera un sábado a comprar carne esperando un 35% que no existe.

### 🚨 Para mirar: dos promos que se cayeron de su propia fuente

- **Banco Ciudad 20% en Coto los sábados y domingos** ya no figura en la web de Coto. El sábado y el domingo Coto solo le da a Ciudad 18 cuotas sin interés, ningún descuento. Quedó **oculta, no borrada**, por si vuelve.
- **Cuenta DNI 20% en ChangoMás los jueves** desapareció de la tabla oficial del Banco Provincia. La habíamos agregado ayer desde esa misma tabla, así que duró un día. También quedó **oculta**.

### Cuenta DNI: la tabla oficial se reeditó esta mañana

Además de lo de carnicerías, la tabla del Banco Provincia ahora publica topes que antes no aclaraba. Mayorista Niní pasó a decir **$20.000 por persona y por semana** (lo teníamos sin período). Café del buffet, Sodimac, La Anónima y Josimar subieron a confianza alta: estaban en media y ahora figuran explícitos en la tabla.

Lo demás de Cuenta DNI está igual que ayer: garrafas 40% con tope $18.000 al mes, supermercados 15% martes y miércoles, ferias 40%, marcas destacadas 30%, YPF Full y gastronomía 25% los fines de semana.

**Sigue sin confirmar**: pet shops 40% (oculta hace días, no aparece en ninguna tabla oficial) y universidades 40% (en media, las fuentes no coinciden en el tope).

### Personal Pay resultó tener mucho más de lo que teníamos

Filtrando por Supermercados aparecieron seis promos que no estaban, y una es fuerte: **30% en Coto los jueves**. También Diarco 20% jueves y viernes, Diarco 15% los fines de semana, ChangoMás 15% viernes a domingo, y BIOMAC y Chanchito Market 10% todos los días. Ninguna publica el tope en el listado (depende del Nivel del usuario), así que van con `tope_publicado: false`.

De paso se resolvió una contradicción vieja: teníamos oculta una de prensa que decía "Personal Pay 25% en ChangoMás y Día" sin aclarar los días. **La web oficial dice 15% viernes a domingo**, así que gana la oficial y la de prensa se borró.

### Banco Ciudad: 13 promos que se nos habían escapado

Sus 22 promos anteriores están idénticas, pero repasando las 124 tarjetas del sitio aparecieron supermercados de barrio que no teníamos: **El Túnel 25% los jueves, El Nene 25% lunes y jueves**, Supercoop 20% de viernes a domingo, La Ilusión 15% los lunes, DAR 15% los martes, Almacor 10% los martes y Josimar 20% los viernes. Más cuatro farmacias, Perfumerías MODO y Easy 20% los miércoles.

### Naranja X subió las cuotas por el Día de las Infancias

On City, Casa del Audio, Cetrogar y Musimundo pasaron a **14 cuotas sin interés** (tenían 12, 9, 12 y 12). Volvieron Samsung y Piero, que se habían caído la semana pasada, y se sumaron seis de hogar. Se cayeron Whirlpool y Dormipiero Lab.

Lo nuevo que vale la pena: **25% + 5 cuotas en indumentaria y calzado, del 14 al 16 de agosto, con tope de $20.000**. Y los micros de larga distancia (Flecha Bus, Chevallier, Plusmar, Andesmar y tres más) dan **10% todos los días + 6 cuotas**, que no lo teníamos cargado.

El 25% en súper de los martes con Plan Turbo sigue igual. La de indumentaria deportiva sigue diciendo "días seleccionados" sin aclarar cuáles, así que sigue oculta.

### Cuatro topes que estaban mal etiquetados en Coto

Los teníamos como topes mensuales y la letra chica de Coto dice otra cosa: **Ciudad $10.000 y Comafi $13.000 son por transacción**, no por mes (Comafi además da $18.000 a Segmento Único). ICBC $15.000 y Patagonia $25.000 no aclaran período. Los cuatro pasaron a `sin_aclarar`, que es lo que la fuente realmente dice.

Y **las 20 cuotas de Coto son del Banco Nación**, no de "cualquier Visa o Mastercard" como estaban cargadas: el logo de la tarjeta es el del Nación. Lo mismo con las 12 cuotas, que son de Macro, Galicia o BBVA. Alguien con una Visa de otro banco se iba a llevar una sorpresa en la caja.

### El combustible de Galicia es todos los 10, no solo hoy

`galicia-combustible-dia10` figuraba venciendo hoy. En realidad **el 15% en YPF, Puma, Shell y Axion vale los días 10 de cada mes**, pagando con MODO desde la App Galicia con Mastercard. Hoy es 10, así que se muestra. Mañana se cae sola porque la app no sabe expresar "el día 10 de cada mes" — **hay que volver a agregarla el 10 de septiembre**.

El resto de Galicia (Starbucks, Mimo & Co, Jumbo, Bridgestone, Rex, CCKonex) está idéntico.

### Lo que no se revisó

54 promos siguen con fecha del 5 o del 9 de agosto, todas de fuentes que no tienen web usable: **Mercado Pago** (su sitio está congelado desde mayo, va por prensa), **BNA+, Santander, BBVA, Macro, Hipotecario, ICBC, Ualá** y las de delivery. Los datos valen, pero no se volvieron a confirmar.

De **MODO** se confirmaron las seis de cuotas y el 20% en ChangoMás desde el listado; las de Jumbo y Día no se pueden confirmar sin abrir cada promo una por una, así que quedaron como estaban.

---

## 2026-08-09 — Segunda corrida del día (las fuentes que habían quedado afuera)

**151 promos, 140 visibles.** Antes eran 125 y 116. Esta pasada fue a buscar justo lo que la corrida de la tarde no había tocado: Cuenta DNI, Mercado Pago, BNA+, Galicia, Santander, MODO y delivery.

### 🚨 Para mirar: la garrafa de Cuenta DNI vuelve a $18.000

El 5 de agosto habíamos "corregido" el tope de garrafas de $18.000 a $4.500, y lo anotamos como el peor error encontrado hasta entonces. **Estaba al revés: el tope real es $18.000 por mes.** Lo confirman la tabla oficial del Banco Provincia que publica La Nación (actualizada hoy 16:53) y el detalle de Infobae del 1 de agosto. La fuente que decía $4.500 era una nota en prosa de iProfesional, no la tabla.

Queda en $18.000 con confianza alta. Pero el dato ya cambió dos veces, así que conviene que lo mire un humano.

### Cuenta DNI se rehízo entero otra vez: de 8 promos a 23

La Nación actualizó hoy la tabla oficial y **cambió casi toda la grilla del mes**. Lo que se movió:

| | Teníamos | Es |
|---|---|---|
| Garrafas | 40%, tope $4.500/mes | 40%, tope **$18.000/mes** |
| Gastronomía | 30%, tope $5.000 | **25%**, tope **$8.000** semanal |
| Supermercados | 25%, solo el 12 y 13 | **15%, todos los martes y miércoles**, tope $6.000 semanal |
| Comercios de cercanía | tope sin aclarar | $6.000 **por semana** |

Y aparecieron 14 promos que no teníamos: Día 10% los lunes sin tope, librerías 10% lunes y martes, Mayorista Niní 15% los martes, Toledo 15% los martes, marcas destacadas 30% todos los días (tope $15.000 mensual), el café del buffet 40% —acumulable con otras promos del mismo día—, YPF Full 25% los fines de semana, farmacias y perfumerías 10% miércoles y jueves, Sodimac 10% todo el mes, Carrefour 10% los miércoles, La Anónima y Josimar 10% los miércoles, ChangoMás 20% los jueves, y 3 cuotas sin interés todos los días en comercios adheridos.

**Dos que se cayeron de la tabla oficial y quedaron ocultas, no borradas:**
- **Pet shops y veterinarias 40%** —la que en agosto era "la promo estrella del mes"— no figura ni en la tabla oficial de hoy ni en el detalle de Infobae. La única fuente es iProfesional del 5. Pasó a confianza baja.
- **Carnicerías 35% los sábados** tampoco está en la tabla, pero el epígrafe de la foto de la misma nota de La Nación de hoy dice que el descuento de carnicerías se da los sábados. Quedó en confianza media, se sigue mostrando, marcada para reconfirmar.

Universidades quedó en media: Infobae le pone tope $6.000 semanales e iProfesional $4.000. Se cargó el más bajo, por las dudas.

### Mercado Pago: 9 promos nuevas

Salieron de leer entera la nota de billeteras de iProfesional (05/08, año verificado). La más fuerte: **35% en Mercado Libre Supermercado todos los días**, que pasa a ser el descuento más alto que tenemos. Y un **15% adicional acumulable en Carrefour** para quien cobra ANSES en Mercado Pago (tope $20.000 mensuales).

También: La Anónima 15% los lunes, Diarco 15% el finde, Makro 10% viernes y sábados, Carrefour Maxi 10% los viernes, Maxiconsumo 5% siempre, y las cuotas de Día (3) y Carrefour (6).

**Las dos notas de iProfesional del mismo día se contradicen entre sí** en Carrefour (finde vs. jueves) y en Día (todos los miércoles vs. solo el 5 y el 12). Se dejaron como estaban y bajaron a confianza media.

### El 35% de BNA+ en ChangoMás sigue vivo (por poco)

CalcularSueldo publicó una tabla que pone a ChangoMás como 20% los lunes, sin rastro del 35%. Pero iProfesional del 5 de agosto lo dice explícito: **Banco Nación, 35%, miércoles, tope $15.000 semanales, pagando por MODO**. Como la tabla de CalcularSueldo mezcla promos que iProfesional atribuye a MODO y a Macro, se le dio la razón a iProfesional y el 35% se queda.

Por lo mismo, las cuatro cadenas de fin de semana de BNA+ (La Anónima, Disco, Vea, Diarco) **siguen sin desglosar**: CalcularSueldo trae el detalle pero la atribución por banco no es confiable. Sigue oculta.

**BNA+ en Rappi pasó a oculta:** la web del Nación ya no lista esa promo. Hoy solo figura un 25% de primera compra en Rappi que venció el 19 de julio.

### Galicia y MODO, confirmados
Galicia confirmó desde su web sus 5 promos y sumó 4 de cuotas (Bridgestone 12, Rex 6, y 3 cuotas en Jumbo/Disco/Vea y ChangoMás de jueves a domingo). MODO confirmó sus 24 cuotas. También quedó anotado que **el listado real de Galicia no está en galicia.ar sino en el iframe `beneficios.galicia.ar`** — ahí hay 25 comercios de supermercados, pero sin porcentaje en el listado.

### Fuentes que fallaron
- **Semana Nación** (el sitio oficial de BNA+) devuelve "Error interno". Sus promos se dejaron como estaban.
- **Cuenta DNI oficial**: sigue con el certificado SSL vencido, ni carga.
- **Infobae** no abre en el navegador; se leyó la nota completa por fetch directo (no resumen de buscador).

### Lo que quedó sin revisar
19 promos siguen con fecha del 5 de agosto: Santander (su web no publica los %), BBVA (404), las de Rappi, las cuotas de Coto y tres de Mercado Pago que salían de El Destape. Los datos valen, pero no se volvieron a confirmar.

---

## 2026-08-09 — Corrida a mano (la automática no había llegado a correr)

**125 promos, 116 visibles.** Cuatro días sin actualizar y sí hubo movimiento: la corrida diaria importa.

### Coto resultó una fuente mucho mejor de lo que creíamos
Sus tarjetas de promoción traen **el banco (en el nombre del archivo del logo), el día (clase `active`), el porcentaje y el tope**, todo en el HTML. De ahí salieron **10 promos nuevas** y seis bancos que no teníamos: Credicoop, Supervielle, Columbia, Comafi, Patagonia y TCI.

Lo más fuerte de la semana en Coto: **30% los lunes con Credicoop** (tope $15.000 semanales, solo los lunes 10, 24 y 31) y **30% los jueves con Columbia, sin tope**.

### Dos promos se cayeron
- **Comunidad Coto 15%**: ya no figura en la web de Coto. Era la pata de los combos —el famoso 25% + 15% de los viernes— así que **el combo de Coto deja de mostrarse**. Quedó oculta, no borrada, por si vuelve.
- **Naranja X en indumentaria deportiva**: la web pasó de decir "de lunes a miércoles" a "días seleccionados", sin aclarar cuáles. Sin días no se puede mostrar.

También se cayeron tres promos de cuotas de Naranja X (Samsung, Cannon y Piero) y se sumaron tres nuevas (Frávega 12, Dormipiero Lab 14, Simmons 12). Y se sacó la de Santander en Coto online, que vencía el 5.

### Sin cambios
Banco Ciudad y Personal Pay están idénticos al 5 de agosto. Se les actualizó la fecha de verificación (47 promos).

### Lo que NO se revisó en esta corrida
Mercado Pago, BNA+, Cuenta DNI, Galicia, Santander, BBVA, MODO y las de delivery. Siguen con fecha del 5 de agosto: los datos valen, pero no se volvieron a confirmar.

---

## 2026-08-05 — Quinta pasada (cuotas sin interés)

Total: **116 promos**, 109 se muestran. Se sumaron **28 de solo financiación** y se les agregaron las cuotas a **5** que ya teníamos y además las daban.

De dónde salieron, todas de fuentes propias: Banco Ciudad (Frávega, Casa del Audio y Samsung en 18), Naranja X (Megatone, Naldo y Samsung en 14; Cannon y Piero en 14 para colchones), MODO (tiendaMacro, Megatone, Naldo, On City y Cetrogar en **24**, las más largas del mercado) y Coto (hasta 20 cuotas en electro y automotor con Visa).

Las de solo cuotas van con `descuento_pct: 0` y `cuotas: N`. La app las muestra en una sección aparte y **no entran en el "Hoy te conviene"**: las cuotas no te ahorran plata, te la parten. Las que dan las dos cosas quedan entre los descuentos con las cuotas como dato al costado.

La garrafa de Cuenta DNI pasó de rubro `hogar` a `garrafas`, porque buscando "colchón" aparecía entre los resultados.

---

## 2026-08-05 — Cuarta pasada (bancos grandes)

Total: **88 promos**, 81 se muestran. Antes eran 66 y 59.

| Banco | Promos | De dónde |
|---|---|---|
| Banco Ciudad | 22 | su propia web |
| Banco Galicia | 6 | su propia web |
| Santander | 6 | prensa (su web no publica los %) |
| BBVA | 1 | prensa (su web da 404) |

**Banco Ciudad es la mejor fuente propia de todo el proyecto.** Más de 100 beneficios con comercio, porcentaje y días. El truco: los días salen como letras D L M M J V S y el que aplica tiene la clase `active` en el HTML. Sacando solo el texto se pierden. Quedó anotado el selector exacto en `fuentes.json` para que el agente no tenga que redescubrirlo.

### Casi cargo datos de hace un año
Buscando Banco Ciudad apareció una nota de Cronista que parecía perfecta: 25% en Coto los lunes, tope $10.000 semanales, con detalle de Credicoop y Ualá. Decía **"Actualizado el 4 de Agosto de 2025"**. Un año vieja. Las notas de descuentos se repiten calcadas cada año y el buscador las mezcla sin distinguir.

Se sumó una regla al instructivo: **chequear EL AÑO de la nota**. El día y el mes coincidían perfecto —"4 de agosto"— y por eso pasaba desapercibido; lo que estaba mal era el año. Antes de cargar cualquier dato de prensa hay que confirmar que el año de publicación sea el año en curso.

### El desfasaje de días se repite
Ya van tres fuentes distintas que ponen mal el día de la semana: "lunes 12 y martes 13" (caen miércoles y jueves) y "martes 5" (cae miércoles). **En agosto de 2026 la prensa viene equivocando los nombres de los días.** Todo lo que tiene fecha puntual se carga por fecha, nunca por nombre de día.

---

## 2026-08-05 — Tercera pasada (delivery + tabla oficial de Cuenta DNI)

Total: **55 promos**, 48 se muestran.

### Cuenta DNI se rehízo entero
La Nación publica **la tabla oficial del Banco Provincia** completa (rubro, %, días y tope). Se tiraron abajo las 5 entradas armadas con prensa suelta y se cargaron las 8 oficiales. Lo que estaba mal:

| | Teníamos | Es |
|---|---|---|
| Garrafas | 40%, tope $18.000 | 40%, tope **$4.500** |
| Gastronomía | 25%, tope $8.000 | **30%**, tope **$5.000** |
| Supermercados | sin días, confianza baja | 25%, **solo el 12 y 13 de agosto** |

El tope de garrafas estaba **cuatro veces más alto** de lo real. Es el peor tipo de error posible: la app te habría dicho que gastes $45.000 para recuperar $18.000 cuando el techo real son $4.500.

Nuevas que no teníamos: pet shops y veterinarias (40%, la promo estrella del mes), universidades (40%) y comercios de cercanía (20%).

**Ojo con la del 12 y 13:** la fuente los llama "lunes 12 y martes 13" pero en agosto de 2026 esos días caen miércoles y jueves. Quedó cargada por fecha, no por nombre de día, y marcada para reconfirmar antes del 12.

### Delivery (rubro nuevo)
Se pudieron confirmar dos: **BNA+ en Rappi** (30%, lunes a viernes, tope $20.000 mensual, solo Visa del Nación) y **Santander en PedidosYa Market** (30% los miércoles con American Express).

Quedaron en confianza baja, sin mostrar, las de Cuenta DNI, Galicia y Ualá en Rappi: Rappi confirma que existen y hasta cuándo valen, pero no publica el porcentaje ni los días sin abrir los términos de cada una.

**PedidosYa tiene anti-bot.** `/promociones/medios-de-pago` responde "Acceso denegado", y desde el Chrome de Lucía el dominio tampoco está permitido. Es la única fuente del proyecto sin acceso automático: va a mano o por captura.

---

## 2026-08-05 — Segunda pasada (billeteras que faltaban)

Total: **47 promos**. Se sumaron Personal Pay (8), MODO (4), Macro (3), Hipotecario (2), ICBC (1) y Ualá (1).

- **Personal Pay** resultó de las mejores fuentes propias: lista comercio, porcentaje y día juntos, en 9 páginas. Lo que no muestra es el tope, porque depende del Nivel del usuario.
- **IUDÚ (Supervielle)**: todavía sin revisar.

### Dos datos que estaban MAL y se corrigieron
Salieron de leer la nota completa de iProfesional del 05/08 en vez del resumen del buscador:
- **Mercado Pago en Carrefour**: era 15% **sábados y domingos**, no los jueves.
- **Mercado Pago en Día**: es 10% **todos los miércoles y sin tope**, no solo el 5 y el 12.

Moraleja para el agente diario: **leer la fuente, nunca el resumen del buscador.**

### El mejor descuento del mes
BNA+ da **35% en ChangoMás los miércoles** (tope $15.000 semanales, pagando por MODO con Visa o Mastercard del Nación). Es el número más alto de agosto.

---

## 2026-08-05 — Primera carga

**27 promos** cargadas: Cuenta DNI (5), Mercado Pago (8), BNA+ (7), Naranja X (4), Coto (1), Galicia (1), MODO (1).

### Revisión de las páginas propias de cada billetera

Se abrió una por una en el navegador. El resultado es desparejo:

| Billetera | Sirve | Por qué |
|---|---|---|
| **Naranja X** | Sí, muy bien | Dice día, comercio, porcentaje y si es crédito o débito. Solo le falta el tope. |
| **MODO** | Sí, pero caro | Muchísimas promos de todos los bancos, pero el listado es solo el título. Hay que abrir cada promo para el día y el tope. |
| **Ualá** | Poco | Solo partners (Rappi, gimnasios, cursos). Nada de supermercados ni días. |
| **Mercado Pago** | **No** | La página está congelada en mayo (promos "válidas del 11 al 17 de mayo", pie de página de 2023). |
| **Cuenta DNI** | No se puede | Certificado SSL vencido. |

**Conclusión:** las páginas propias son la mejor fuente **donde están vivas**, pero solo 2 de 5 lo están. Justo las dos billeteras más usadas del país (Mercado Pago y Cuenta DNI) no publican sus promos en la web: viven adentro de la app. Para esas dos, la prensa no es un parche — es la única fuente que hay.

### Un dato que casi entra mal
Una búsqueda devolvió "Mercado Pago, gastronomía, sábados y domingos 25%, tope $8.000 semanal". Es **exactamente** la promo de Cuenta DNI que ya teníamos cargada: el buscador mezcló las dos billeteras. No se cargó. Este es el error típico de sacar datos de prensa y es la razón por la que cada promo guarda su fuente.

### Para mirar
- **Cuenta DNI supermercados**: dos fuentes se contradicen sobre el tope. Confianza baja, no se muestra.
- **BNA+ fin de semana**: cuatro cadenas en un solo registro, hay que separarlas.
- **Naranja X "días seleccionados"** en Coto, Disco, Vea y ChangoMás: la web no dice cuáles. No se muestra hasta saberlo.
- **MODO**: quedaron ~40 promos sin abrir. Es la próxima corrida.

### La joya del día
Coto da 15% de Comunidad todos los días, con cualquier medio de pago, sin tope, y es **acumulable**. El viernes en Coto con Mercado Pago son 25% + 15%. Ninguna de las apps que miramos te dice eso.
