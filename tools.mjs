import { createServer } from 'node:http';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, extname, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = dirname(fileURLToPath(import.meta.url));
const assets = ['index.html', 'style.css', 'app.mjs', 'model.mjs'];
const command = process.argv[2] || 'dev';
if (command === 'build') {
  const output = resolve(project, 'dist');
  await mkdir(output, { recursive: true });
  await Promise.all(assets.map(file => copyFile(resolve(project, file), resolve(output, file))));
  console.log(`Built ${assets.length} files in ${output}`);
} else if (command === 'dev' || command === 'preview') {
  const root = resolve(project, command === 'preview' ? 'dist' : '.');
  const port = Number(process.env.PORT || 5173);
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8' };
  const server = createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end();
        return;
      }
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
      const target = resolve(root, relative);
      if (!target.startsWith(root + sep) || !assets.includes(relative)) {
        response.writeHead(404).end('Not found');
        return;
      }
      const content = await readFile(target);
      response.writeHead(200, { 'Content-Type': types[extname(target)], 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 400).end('Cannot serve this file');
    }
  });
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Nhớ is ready at http://localhost:${port} (${command})`));
} else {
  console.error('Use: node tools.mjs dev | build | preview');
  process.exitCode = 1;
}
