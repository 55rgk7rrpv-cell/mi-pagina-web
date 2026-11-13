// Busca la tasa oficial BCV (bolívares por dólar) y la guarda en tasa.json, junto a la página publicada.
// La tienda lee ese archivo al abrir el pago; así la tasa se actualiza sin volver a compilar la página.
//
// Uso:  node scripts/tasa-bcv.mjs [ruta-de-salida]     (por defecto tasa-bcv/tasa.json)
// Se publica como el archivo "tasa.json" del artifact, aparte del resto: compilar la tienda nunca lo pisa.
// Fuente: ve.dolarapi.com, que publica la tasa oficial del BCV.
// Si la respuesta parece rara, NO escribe nada y termina con error: la tienda sigue con la tasa anterior
// (y, si esa tiene más de 4 días, deja de mostrar bolívares y avisa que el monto se confirma por mensaje).
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] ?? "tasa-bcv/tasa.json";
const URL = "https://ve.dolarapi.com/v1/dolares/oficial";

function fail(msg) {
  console.error("Tasa BCV NO actualizada:", msg);
  process.exit(1);
}

const res = await fetch(URL, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(20000) }).catch((e) => fail(`sin conexión (${e.message})`));
if (!res.ok) fail(`la fuente respondió ${res.status}`);
const data = await res.json().catch(() => fail("la respuesta no es JSON"));

const valor = Number(data?.promedio);
const fecha = String(data?.fechaActualizacion ?? "").slice(0, 10);
if (data?.fuente !== "oficial") fail(`la fuente no es la oficial (${data?.fuente})`);
if (!Number.isFinite(valor) || valor <= 0) fail(`valor inválido (${data?.promedio})`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) fail(`fecha inválida (${data?.fechaActualizacion})`);
const dias = (Date.now() - Date.parse(fecha + "T12:00:00-04:00")) / 864e5;
if (dias > 5) fail(`la tasa es del ${fecha}, demasiado vieja`);

// Guard against a broken source: the official rate never jumps 25% from one day to the next.
let previo = null;
try {
  previo = JSON.parse(fs.readFileSync(OUT, "utf8"));
} catch {}
if (previo?.bsPorDolar && Math.abs(valor / previo.bsPorDolar - 1) > 0.25)
  fail(`salto sospechoso: ${previo.bsPorDolar} -> ${valor}. Revísalo a mano en bcv.org.ve`);

const tasa = { bsPorDolar: Math.round(valor * 10000) / 10000, fecha, fuente: "BCV (vía ve.dolarapi.com)", consultada: new Date().toISOString() };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(tasa, null, 2) + "\n");
console.log(`Tasa BCV ${tasa.bsPorDolar} Bs/$ del ${fecha} guardada en ${OUT}`);
