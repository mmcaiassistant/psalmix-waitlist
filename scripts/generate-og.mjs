import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function generateOGImage() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 630 });
  
  const templatePath = join(__dirname, '..', 'public', 'og-template.html');
  await page.goto(`file://${templatePath}`);
  
  const outputPath = join(__dirname, '..', 'public', 'og-image.png');
  await page.screenshot({ path: outputPath, type: 'png' });
  
  await browser.close();
  console.log('OG image generated:', outputPath);
}

generateOGImage().catch(console.error);
