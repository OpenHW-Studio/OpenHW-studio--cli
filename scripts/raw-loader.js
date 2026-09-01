import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TEXT_EXTENSIONS = ['.html', '.svg', '.css', '.txt', '.json'];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico'];

function getCleanPath(specifier) {
  return specifier.split('?')[0].toLowerCase();
}

function isTextSpecifier(specifier) {
  if (specifier.includes('?raw')) return true;
  const clean = getCleanPath(specifier);
  return TEXT_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

function isImageSpecifier(specifier) {
  const clean = getCleanPath(specifier);
  return IMAGE_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

function isAssetSpecifier(specifier) {
  return isTextSpecifier(specifier) || isImageSpecifier(specifier);
}

export async function resolve(specifier, context, nextResolve) {
  if (isAssetSpecifier(specifier)) {
    const baseSpecifier = specifier.split('?')[0];
    const resolved = await nextResolve(baseSpecifier, context);
    return {
      ...resolved,
      url: resolved.url.includes('?asset') || resolved.url.includes('?raw') ? resolved.url : `${resolved.url}?asset`,
    };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  const cleanUrl = url.split('?')[0];
  if (isImageSpecifier(cleanUrl)) {
    const filePath = fileURLToPath(cleanUrl);
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).replace('.', '') || 'png';
    const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
    const dataUri = `data:${mime};base64,${data.toString('base64')}`;
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${JSON.stringify(dataUri)};`,
    };
  }

  if (url.includes('?raw') || isTextSpecifier(cleanUrl)) {
    const filePath = fileURLToPath(cleanUrl);
    const content = await fs.readFile(filePath, 'utf8');
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${JSON.stringify(content)};`,
    };
  }

  return nextLoad(url, context);
}
