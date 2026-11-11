// Turns the static export (out/) into a hostable folder (artifact/):
// the page body without its own <html>/<head>/<body> wrapper, since the host
// supplies one, plus the _next assets it references.
import fs from "node:fs";
import path from "node:path";

const src = "out";
const dest = "artifact";
fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });
// The host reserves names starting with "_", so _next/ ships as assets/.
fs.cpSync(path.join(src, "_next"), path.join(dest, "assets"), { recursive: true });
// U+FFFD only occurs inside string literals in the bundles; the host rejects
// the raw character, so write it as the equivalent \uFFFD escape.
const rewrite = (t) => t.replaceAll("/_next/", "/assets/").replaceAll("\uFFFD", "\\uFFFD");
(function fix(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) fix(p);
    else if (/\.(js|css|txt)$/.test(f)) fs.writeFileSync(p, rewrite(fs.readFileSync(p, "utf8")));
  }
})(path.join(dest, "assets"));
// Product photos from public/catalogo.
if (fs.existsSync(path.join(src, "catalogo"))) fs.cpSync(path.join(src, "catalogo"), path.join(dest, "catalogo"), { recursive: true });
fs.writeFileSync(path.join(dest, "index.txt"), rewrite(fs.readFileSync(path.join(src, "index.txt"), "utf8")));

const html = fs.readFileSync(path.join(src, "index.html"), "utf8");
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
const htmlClass = (html.match(/<html[^>]*class="([^"]*)"/) || [])[1] || "";

const cleanHead = head
  .replace(/<meta charSet="utf-8"\/?>/i, "")
  .replace(/<meta name="viewport"[^>]*>/i, "")
  .replace(/<title>[\s\S]*?<\/title>/i, "");

const page =
  `<title>Otra Pinta</title>\n` +
  // The host owns <html>; re-apply the font variable classes it would carry.
  `<script>document.documentElement.className=${JSON.stringify(htmlClass)};document.documentElement.lang="es"</script>\n` +
  rewrite(cleanHead + "\n" + body) + "\n";
fs.writeFileSync(path.join(dest, "index.html"), page);

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    fs.statSync(p).isDirectory() ? walk(p) : files.push(path.relative(dest, p));
  }
})(dest);
fs.writeFileSync("artifact-files.json", JSON.stringify(files.filter((f) => f !== "index.html")));
console.log(files.length, "files,", (files.reduce((s, f) => s + fs.statSync(path.join(dest, f)).size, 0) / 1e6).toFixed(2), "MB");
