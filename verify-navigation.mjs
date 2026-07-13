import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const pagesDir = 'C:/Users/anony/OneDrive/Documents/D-11/NexusNova-Credit-OS/app';

function getPages(dir) {
  const results = [];
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getPages(fullPath));
    } else if (item === 'page.tsx') {
      results.push(fullPath);
    }
  }
  return results;
}

const pages = getPages(pagesDir);

const checks = {
  'Back Button': /<BackButton|<button[^>]*Back/,
  'Home Link': /href="\/"/,
  'Breadcrumbs': /<Breadcrumbs\s*\/>/,
  'Search': /<SearchBar\s*\/>/,
  'Notifications': /<NotificationCenter\s*\/>/,
  'Profile': /<UserMenu|<CustomerUserMenu/,
  'Help': /href="\/help"|Help Center/,
  'Recommended Next': /<RecommendedNext\s*\/>/
};

console.log('=== Navigation Element Verification Report ===\n');
console.log(`Total pages checked: ${pages.length}\n`);

const results = {};

for (const page of pages) {
  const content = readFileSync(page, 'utf-8');
  const relPath = page.replace('C:/Users/anony/OneDrive/Documents/D-11/NexusNova-Credit-OS/app', '');
  
  results[relPath] = {};
  
  for (const [name, regex] of Object.entries(checks)) {
    const has = regex.test(content);
    results[relPath][name] = has;
  }
}

// Summary
console.log('=== SUMMARY ===\n');
const summary = {};
for (const name of Object.keys(checks)) {
  const count = Object.values(results).filter(r => r[name]).length;
  summary[name] = `${count}/${pages.length}`;
  console.log(`${name}: ${count}/${pages.length} pages`);
}

console.log('\n=== DETAILS BY PAGE ===\n');
for (const [page, checksResult] of Object.entries(results)) {
  const missing = Object.entries(checksResult).filter(([_, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    console.log(`${page}: MISSING ${missing.join(', ')}`);
  } else {
    console.log(`${page}: ✓ All present`);
  }
}