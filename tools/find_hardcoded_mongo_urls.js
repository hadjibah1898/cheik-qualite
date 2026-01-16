#!/usr/bin/env node
// Script simple pour rechercher des URI MongoDB hardcodées dans le dépôt
// Usage: node tools/find_hardcoded_mongo_urls.js

import fs from 'fs';
import path from 'path';

const root = process.cwd();
const pattern = /mongodb\+srv:\/\/[\w%:@\-._]+\/?.*/i;
const excludeDirs = ['node_modules', '.git'];

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (excludeDirs.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

function findMatches() {
  const files = walk(root);
  const results = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split(/\r?\n/);
      lines.forEach((line, idx) => {
        const m = line.match(pattern);
        if (m) {
          results.push({ file, line: idx + 1, match: m[0].trim() });
        }
      });
    } catch (err) {
      // ignore binary / permission errors
    }
  }
  return results;
}

function main() {
  console.log('Recherche d\u2019URI MongoDB (mongodb+srv://) dans le dépôt...');
  const matches = findMatches();
  if (!matches.length) {
    console.log('Aucune URI MongoDB hardcodée trouvée.');
    process.exit(0);
  }
  console.log(`Trouvé ${matches.length} occurrence(s) :`);
  matches.forEach(m => {
    console.log(`- ${m.file}:${m.line} -> ${m.match}`);
  });
  const reportFile = path.join(process.cwd(), 'tools', 'mongo_uri_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(matches, null, 2));
  console.log(`Rapport écrit dans ${reportFile}`);
  console.log('\nConseil : remplacez ces valeurs par une variable d\u2019environnement (ex: process.env.DATABASE_URL) et révoquez toute clé exposée.');
}

main();
