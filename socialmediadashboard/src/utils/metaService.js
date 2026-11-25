const GRAPH_API_VERSION = 'v27.0';

/**
 * Meta Graph API Integration Service
 * Smart resolver:
 * 1. Checks /me/accounts to automatically discover all linked Instagram Business accounts.
 * 2. Matches by targetHandle so the user doesn't need to know their exact Instagram ID.
 * 3. Falls back to direct ID lookup or Page lookup.
 * 4. Detects App ID vs Page ID vs Instagram ID and provides helpful human error messages.
 */

export async function fetchInstagramProfile({ igAccountId, accessToken, targetHandle }) {
  if (!accessToken) {
    return {
      success: false,
      error: 'Meta Access Token wajib diisi.',
    };
  }

  const cleanToken = accessToken.trim();
  const cleanId = (igAccountId || '').trim();
  const cleanTarget = (targetHandle || '').replace('@', '').trim().toLowerCase();

  // Validate token format (Meta access tokens start with EA... e.g. EAA, EAG, etc.)
  if (!cleanToken.startsWith('EA') && !cleanToken.includes('|')) {
    return {
      success: false,
      error: 'Format Token salah! Token Meta yang valid SELALU diawali dengan huruf "EA..." (sangat panjang). Pastikan Anda menyalin dari kotak Access Token di Graph API Explorer, bukan App Secret.',
    };
  }

  try {
    // Strategy 1: SMART AUTO-DISCOVERY via /me/accounts
    // Query all Pages and linked Instagram accounts accessible by this token
    const meAccountsUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/me/accounts?fields=id,name,instagram_business_account{id,username,name,profile_picture_url,followers_count,biography,media_count}&access_token=${cleanToken}`;
    
    try {
      const meRes = await fetch(meAccountsUrl);
      const meData = await meRes.json();

      if (meData && Array.isArray(meData.data) && meData.data.length > 0) {
        // Collect all linked Instagram accounts
        const igAccounts = [];
        for (const page of meData.data) {
          if (page.instagram_business_account) {
            igAccounts.push({
              pageName: page.name,
              pageId: page.id,
              ...page.instagram_business_account,
            });
          }
        }

        // Try to match by targetHandle first.
        if (cleanTarget) {
          const match = igAccounts.find(ig => ig.username?.toLowerCase() === cleanTarget);
          if (match) {
            return {
              success: true,
              data: {
                id: match.id, // the real Instagram Business Account ID (e.g. 178414...)
                handle: `@${match.username}`,
                displayName: match.name || match.username,
                avatar: match.profile_picture_url || '',
                followers: match.followers_count || 0,
                bio: match.biography || '',
                mediaCount: match.media_count || 0,
              },
              note: `Otomatis terhubung ke @${match.username} lewat Halaman "${match.pageName}"! ID Instagram asli (${match.id}) berhasil dipasang.`,
            };
          }
        }

        // Try to match by cleanId if provided
        if (cleanId) {
          const matchById = igAccounts.find(ig => ig.id === cleanId || ig.pageId === cleanId);
          if (matchById) {
            return {
              success: true,
              data: {
                id: matchById.id,
                handle: `@${matchById.username}`,
                displayName: matchById.name || matchById.username,
                avatar: matchById.profile_picture_url || '',
                followers: matchById.followers_count || 0,
                bio: matchById.biography || '',
                mediaCount: matchById.media_count || 0,
              },
              note: `Otomatis terhubung ke @${matchById.username}!`,
            };
          }
        }

        // If target was not matched but there is at least 1 IG account, use the first one
        if (igAccounts.length > 0 && !cleanTarget) {
          const first = igAccounts[0];
          return {
            success: true,
            data: {
              id: first.id,
              handle: `@${first.username}`,
              displayName: first.name || first.username,
              avatar: first.profile_picture_url || '',
              followers: first.followers_count || 0,
              bio: first.biography || '',
              mediaCount: first.media_count || 0,
            },
            note: `Ditemukan akun @${first.username} di Halaman "${first.pageName}".`,
          };
        }

        // If pages exist but none has instagram_business_account linked
        if (igAccounts.length === 0) {
          const pageNames = meData.data.map(p => `"${p.name}"`).join(', ');
          return {
            success: false,
            error: `Token kamu terhubung ke Halaman Facebook (${pageNames}), tetapi Halaman ini BELUM ditautkan ke Akun Instagram Bisnis di Pengaturan Meta Business Suite (Akun &rarr; Akun Instagram).`,
          };
        }
      }
    } catch (e) {
      // ignore and try Strategy 2
    }

    // Strategy 2: If cleanId is given, check what cleanId actually is
    if (cleanId) {
      // Check if cleanId is a direct Instagram Account
      const directUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${cleanId}?fields=id,username,name,profile_picture_url,followers_count,biography,media_count&access_token=${cleanToken}`;
      const directRes = await fetch(directUrl);
      const directData = await directRes.json();

      if (!directData.error && directData.username) {
        return {
          success: true,
          data: {
            id: directData.id,
            handle: `@${directData.username}`,
            displayName: directData.name || directData.username,
            avatar: directData.profile_picture_url || '',
            followers: directData.followers_count || 0,
            bio: directData.biography || '',
            mediaCount: directData.media_count || 0,
          },
        };
      }

      // Check if cleanId is a Page with instagram_business_account
      const pageUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${cleanId}?fields=name,instagram_business_account{id,username,name,profile_picture_url,followers_count,biography,media_count}&access_token=${cleanToken}`;
      const pageRes = await fetch(pageUrl);
      const pageData = await pageRes.json();

      if (!pageData.error && pageData.instagram_business_account) {
        const ig = pageData.instagram_business_account;
        return {
          success: true,
          data: {
            id: ig.id,
            handle: `@${ig.username}`,
            displayName: ig.name || ig.username,
            avatar: ig.profile_picture_url || '',
            followers: ig.followers_count || 0,
            bio: ig.biography || '',
            mediaCount: ig.media_count || 0,
          },
          note: `Terhubung via Halaman "${pageData.name}".`,
        };
      }

      // If cleanId returned error: check if it's an App ID
      if (directData.error?.message?.includes('nonexisting field') || pageData.error?.message?.includes('nonexisting field')) {
        return {
          success: false,
          error: `ID "${cleanId}" kemungkinan adalah App ID (ID Aplikasi Meta), BUKAN ID Akun Instagram. Kosongkan kolom ID ini dan cukup isi Token EAA... saja, sistem akan mencari akun Instagram-mu secara otomatis!`,
        };
      }

      if (directData.error) {
        return {
          success: false,
          error: directData.error.message || 'Gagal memproses ID tersebut.',
        };
      }
    }

    return {
      success: false,
      error: 'Tidak ditemukan akun Instagram Bisnis yang terhubung dengan token ini. Pastikan token memiliki izin "instagram_basic" dan "pages_show_list".',
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Gagal menghubungi server Meta Graph API.',
    };
  }
}

/**
 * Load current account insights. Insights are optional because Meta may allow
 * profile access while the token lacks instagram_manage_insights permission.
 */
export async function fetchInstagramInsights({ igAccountId, accessToken }) {
  if (!igAccountId || !accessToken) return { success: false, error: 'ID akun atau token Meta belum tersedia.' };

  try {
    const params = new URLSearchParams({
      metric: 'reach,profile_views,accounts_engaged,total_interactions',
      period: 'day',
      access_token: accessToken.trim(),
    });
    const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igAccountId}/insights?${params}`);
    const payload = await response.json();
    if (!response.ok || payload.error) {
      return { success: false, error: payload.error?.message || 'Meta tidak dapat mengambil insights akun ini.' };
    }

    const values = Object.fromEntries((payload.data || []).map((metric) => [
      metric.name,
      metric.values?.[metric.values.length - 1]?.value ?? 0,
    ]));
    return {
      success: true,
      data: {
        reach: values.reach ?? 0,
        profileViews: values.profile_views ?? 0,
        accountsEngaged: values.accounts_engaged ?? 0,
        totalInteractions: values.total_interactions ?? 0,
        fetchedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return { success: false, error: error.message || 'Gagal mengambil insights Meta.' };
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
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${commentId}/replies`;
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
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${igUserId}/messages`;
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

