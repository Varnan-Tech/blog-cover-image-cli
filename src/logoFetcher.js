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
      try {
        // Try Brandfetch first with spoofed headers and manual redirect handling
        response = await fetch(url, {
          headers: {
            'Referer': 'https://brandfetch.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          redirect: 'manual'
        });

        // If Brandfetch returns a 3xx redirect or is not OK, we fallback
        if ((response.status >= 300 && response.status < 400) || !response.ok) {
          throw new Error(`Brandfetch failed with status ${response.status}`);
        }
      } catch (brandfetchError) {
        // Silent catch for Brandfetch errors (WAF blocking, ECONNRESET, etc.) and fallback to icon.horse
        try {
          const fallbackUrl = `https://icon.horse/icon/${logoInput}`;
          response = await fetch(fallbackUrl);
          if (!response.ok) {
            throw new Error(`Fallback icon.horse failed with status ${response.status}`);
          }
        } catch (iconHorseError) {
          // Second fallback to logos.hunter.io if icon.horse fails
          const hunterUrl = `https://logos.hunter.io/${logoInput}`;
          response = await fetch(hunterUrl);
          if (!response.ok) {
            throw new Error(`All fallbacks failed (Brandfetch, icon.horse, logos.hunter.io)`);
          }
        }
      }
    } else {
      response = await fetch(url);
      if (!response.ok) {
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
