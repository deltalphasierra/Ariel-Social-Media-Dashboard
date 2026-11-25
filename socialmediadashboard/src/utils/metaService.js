/**
 * Meta Graph API Integration Service
 * Automatically detects whether the input ID is an Instagram Business Account ID
 * or a Facebook Page ID that links to an Instagram Business Account.
 */

export async function fetchInstagramProfile({ igAccountId, accessToken }) {
  if (!igAccountId || !accessToken) {
    return {
      success: false,
      error: 'ID dan Access Token Meta wajib diisi.',
    };
  }

  const cleanId = igAccountId.trim();
  const cleanToken = accessToken.trim();

  try {
    // Attempt 1: Direct Instagram Business Account lookup
    const directEndpoint = `https://graph.facebook.com/v19.0/${cleanId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography&access_token=${cleanToken}`;
    const directRes = await fetch(directEndpoint);
    const directData = await directRes.json();

    if (!directData.error && directData.username) {
      return {
        success: true,
        data: {
          id: directData.id,
          handle: `@${directData.username}`,
          displayName: directData.name || directData.username,
          avatar: directData.profile_picture_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150',
          followers: directData.followers_count || 0,
          bio: directData.biography || '',
          mediaCount: directData.media_count || 0,
        },
      };
    }

    // Attempt 2: If error mentions nonexisting field (username), cleanId is likely a Facebook Page ID!
    // We can query the linked instagram_business_account on this Page:
    const pageEndpoint = `https://graph.facebook.com/v19.0/${cleanId}?fields=name,instagram_business_account{id,username,name,profile_picture_url,followers_count,biography,media_count}&access_token=${cleanToken}`;
    const pageRes = await fetch(pageEndpoint);
    const pageData = await pageRes.json();

    if (!pageData.error) {
      if (pageData.instagram_business_account) {
        const ig = pageData.instagram_business_account;
        return {
          success: true,
          data: {
            id: ig.id, // the real Instagram Business Account ID
            handle: `@${ig.username}`,
            displayName: ig.name || ig.username,
            avatar: ig.profile_picture_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150',
            followers: ig.followers_count || 0,
            bio: ig.biography || '',
            mediaCount: ig.media_count || 0,
          },
          note: `Terdeteksi ID Halaman Facebook ("${pageData.name}"). Berhasil mengambil akun Instagram yang terhubung!`,
        };
      } else {
        return {
          success: false,
          error: `ID ${cleanId} adalah Halaman Facebook "${pageData.name}", tetapi halaman ini BELUM ditautkan ke Akun Instagram Bisnis di Meta Business Suite.`,
        };
      }
    }

    // If both failed, return the primary error
    const primaryError = directData.error || pageData.error;
    return {
      success: false,
      error: primaryError?.message || 'Gagal mengambil data dari Meta API.',
      code: primaryError?.code,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Gagal menghubungi server Meta Graph API. Periksa koneksi internet.',
    };
  }
}

/**
 * Reply to an Instagram Comment via Meta Graph API
 * Requires: instagram_manage_comments permission
 */
export async function replyToInstagramComment({ commentId, message, accessToken }) {
  if (!commentId || !message || !accessToken) {
    return { success: false, error: 'Parameter tidak lengkap.' };
  }
  try {
    const url = `https://graph.facebook.com/v19.0/${commentId}/replies`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        access_token: accessToken.trim(),
      }),
    });
    const data = await res.json();
    if (data.error) {
      return { success: false, error: data.error.message };
    }
    return { success: true, id: data.id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Send an Instagram Direct Message via Meta Messaging API
 * Requires: instagram_manage_messages permission
 */
export async function sendInstagramDirectMessage({ igUserId, recipientId, message, accessToken }) {
  if (!igUserId || !recipientId || !message || !accessToken) {
    return { success: false, error: 'Parameter tidak lengkap.' };
  }
  try {
    const url = `https://graph.facebook.com/v19.0/${igUserId}/messages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
        access_token: accessToken.trim(),
      }),
    });
    const data = await res.json();
    if (data.error) {
      return { success: false, error: data.error.message };
    }
    return { success: true, messageId: data.message_id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
