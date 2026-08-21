# Cambios

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

### Macro quedó afuera y es por diseño
Tiene 259 beneficios, pero **el listado no muestra el día**: hay que abrir cada uno por su link, y pagina de a 40. Es una fuente cara, necesita una pasada dedicada. Quedó anotada como tal en `fuentes.json` para que la corrida diaria no se cuelgue intentándola.

### Lo que queda pendiente
Comafi, Patagonia, Columbia, ICBC, BBVA, Ualá y TCI siguen con una o dos promos cada uno. De Supervielle faltan los otros rubros: combustible, farmacia, indumentaria y transporte.

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
