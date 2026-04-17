import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

const enJsonPath = path.join(projectRoot, 'src/i18n/en.json');
const bnJsonPath = path.join(projectRoot, 'src/i18n/bn.json');

function extractTranslationKeys(content) {
  const keys = new Set();
  
  const patterns = [
    /t\(\s*["'`]([a-zA-Z_][a-zA-Z0-9_.\-]*)["'`]\s*\)/g,
    /t\(\s*`([a-zA-Z_][a-zA-Z0-9_.\-]*)`\s*\)/g,
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const key = match[1];
      if (key && !key.startsWith('/') && !key.includes('${') && key.length > 1) {
        keys.add(key);
      }
    }
  });

  return keys;
}

function getAllTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!item.name.startsWith('.') && item.name !== 'node_modules') {
        files.push(...getAllTsxFiles(fullPath));
      }
    } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function extractAllKeys() {
  const allKeys = new Set();
  const files = getAllTsxFiles(srcDir);
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const keys = extractTranslationKeys(content);
      keys.forEach(key => allKeys.add(key));
    } catch (err) {
      console.error(`Error reading ${file}:`, err.message);
    }
  }
  
  return allKeys;
}

function mergeKeys(existingKeys, newKeys) {
  const merged = {};
  
  // Add all new keys found in code
  for (const key of newKeys) {
    if (key in existingKeys && existingKeys[key] && existingKeys[key].trim() !== '') {
      merged[key] = existingKeys[key];
    } else {
      merged[key] = "";
    }
  }
  
  return merged;
}

function main() {
  console.log('🔍 Scanning for translation keys...');
  
  const newKeys = extractAllKeys();
  console.log(`Found ${newKeys.size} unique translation keys`);
  
  let enData = {};
  let bnData = {};
  
  if (fs.existsSync(enJsonPath)) {
    try {
      enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf-8'));
      console.log(`Loaded ${Object.keys(enData).length} keys from en.json`);
    } catch (e) {
      console.error('Error reading en.json:', e.message);
    }
  }
  
  if (fs.existsSync(bnJsonPath)) {
    try {
      bnData = JSON.parse(fs.readFileSync(bnJsonPath, 'utf-8'));
      console.log(`Loaded ${Object.keys(bnData).length} keys from bn.json`);
    } catch (e) {
      console.error('Error reading bn.json:', e.message);
    }
  }
  
  const mergedEn = mergeKeys(enData, newKeys);
  const mergedBn = mergeKeys(bnData, newKeys);
  
  const newEnKeys = Object.keys(mergedEn).length - Object.keys(enData).length;
  const newBnKeys = Object.keys(mergedBn).length - Object.keys(bnData).length;
  
  console.log(`\n📝 Updates:`);
  console.log(`  - en.json: ${Object.keys(enData).length} → ${Object.keys(mergedEn).length} (+${newEnKeys} new)`);
  console.log(`  - bn.json: ${Object.keys(bnData).length} → ${Object.keys(mergedBn).length} (+${newBnKeys} new)`);
  
  const enSorted = Object.keys(mergedEn).sort().reduce((obj, key) => {
    obj[key] = mergedEn[key];
    return obj;
  }, {});
  
  const bnSorted = Object.keys(mergedBn).sort().reduce((obj, key) => {
    obj[key] = mergedBn[key];
    return obj;
  }, {});
  
  fs.writeFileSync(enJsonPath, JSON.stringify(enSorted, null, 2) + '\n');
  fs.writeFileSync(bnJsonPath, JSON.stringify(bnSorted, null, 2) + '\n');
  
  console.log('\n✅ Translation files updated successfully!');
}

main();