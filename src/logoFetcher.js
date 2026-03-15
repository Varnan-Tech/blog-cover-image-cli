import sharp from 'sharp';

/**
 * Fetches a logo from a domain or URL and converts it to PNG.
 * @param {string} logoInput - Domain (e.g., 'google.com') or full URL.
 * @param {string} [clientId] - Brandfetch Client ID.
 * @returns {Promise<{ data: string, mimeType: string } | null>}
 */
export async function fetchLogo(logoInput, clientId) {
  let url;
  if (logoInput.startsWith('http://') || logoInput.startsWith('https://')) {
    url = logoInput;
  } else {
    // Assume it's a domain, use Brandfetch API
    url = `https://cdn.brandfetch.io/${logoInput}/type/logo?c=${clientId}`;
  }

  try {
    let response;
    if (!logoInput.startsWith('http')) {
      response = await fetch(url);
      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType?.includes('image')) {
        // Fallback to icon.horse if Brandfetch fails or returns non-image
        const fallbackUrl = `https://icon.horse/icon/${logoInput}`;
        response = await fetch(fallbackUrl);
        const fallbackContentType = response.headers.get('content-type');
        if (!response.ok || !fallbackContentType?.includes('image')) {
          return null;
        }
      }
    } else {
      response = await fetch(url);
      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType?.includes('image')) {
        return null;
      }
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
    console.error(`Error fetching logo:`, error.message);
    return null;
  }
}
