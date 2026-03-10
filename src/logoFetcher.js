import sharp from 'sharp';

/**
 * Fetches a logo from a domain or URL and converts it to PNG.
 * @param {string} logoInput - Domain (e.g., 'google.com') or full URL.
 * @returns {Promise<{ data: string, mimeType: string } | null>}
 */
export async function fetchLogo(logoInput) {
  let url;
  if (logoInput.startsWith('http://') || logoInput.startsWith('https://')) {
    url = logoInput;
  } else {
    // Assume it's a domain
    url = `https://logos.hunter.io/${logoInput}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to PNG using sharp
    const pngBuffer = await sharp(buffer)
      .png()
      .toBuffer();

    const base64String = pngBuffer.toString('base64');

    return {
      data: base64String,
      mimeType: 'image/png'
    };
  } catch (error) {
    console.error(`Error fetching logo from ${url}:`, error.message);
    return null;
  }
}
