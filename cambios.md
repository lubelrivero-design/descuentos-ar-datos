# Cambios

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
