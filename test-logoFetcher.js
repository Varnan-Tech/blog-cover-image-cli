import { fetchLogo } from './src/logoFetcher.js';

async function test() {
  try {
    const logo = await fetchLogo('google.com', '1idjWOIcdUuF0HA2VU-');
    if (logo && logo.data) {
      console.log(`Success! Fetched ${logo.mimeType}. Base64 length: ${logo.data.length}`);
      const buffer = Buffer.from(logo.data, 'base64');
      console.log(`Buffer length: ${buffer.length}`);
      console.log(`First 8 bytes: ${buffer.slice(0, 8).toString('hex')}`);
    } else {
      console.error("Failed to fetch. Logo is null.");
    }
  } catch(e) {
    console.error("Uncaught error:", e);
  }
}
test();
