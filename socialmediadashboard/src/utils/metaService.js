/**
 * Meta Graph API Integration Service
 * Connects directly to Instagram Graph API (Meta for Developers)
 * Free API to fetch live follower count, biography, profile photo, and media counts.
 */

export async function fetchInstagramProfile({ igAccountId, accessToken }) {
  if (!igAccountId || !accessToken) {
    return {
      success: false,
      error: 'Instagram Business ID dan Access Token Meta wajib diisi.',
    };
  }

  try {
    const cleanId = igAccountId.trim();
    const cleanToken = accessToken.trim();
    const endpoint = `https://graph.facebook.com/v19.0/${cleanId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography&access_token=${cleanToken}`;

    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.error) {
      return {
        success: false,
        error: data.error.message || 'Gagal mengambil data dari Meta API.',
        type: data.error.type,
        code: data.error.code,
      };
    }

    return {
      success: true,
      data: {
        id: data.id,
        handle: `@${data.username}`,
        displayName: data.name || data.username,
        avatar: data.profile_picture_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150',
        followers: data.followers_count || 0,
        bio: data.biography || '',
        mediaCount: data.media_count || 0,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Gagal menghubungi server Meta Graph API. Periksa koneksi internet.',
    };
  }
}
