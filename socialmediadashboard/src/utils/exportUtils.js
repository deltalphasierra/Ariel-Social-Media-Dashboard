/**
 * Utility functions for exporting social media posts and analytics to CSV and Excel-compatible formats.
 */

export function convertToCSV(data, headers) {
  if (!data || !data.length) return '';

  const headerRow = headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(',');
  const rows = data.map(item => {
    return headers.map(h => {
      let val = item[h.key];
      if (val === undefined || val === null) val = '';
      if (typeof val === 'object') {
        if (Array.isArray(val)) val = val.join(', ');
        else val = JSON.stringify(val);
      }
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    }).join(',');
  });

  return [headerRow, ...rows].join('\r\n');
}

export function downloadCSV(csvContent, filename) {
  // Add UTF-8 BOM so Microsoft Excel correctly displays special characters and accents
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportPostsToCSV(posts, projects, accounts, filename = 'social_media_content_plan.csv') {
  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));
  const accountMap = Object.fromEntries(accounts.map(a => [a.id, `${a.handle} (${a.platform})`]));

  const headers = [
    { key: 'project', label: 'Project' },
    { key: 'account', label: 'Account / Platform' },
    { key: 'title', label: 'Judul Konten' },
    { key: 'format', label: 'Format' },
    { key: 'publishDate', label: 'Tanggal Tayang' },
    { key: 'publishTime', label: 'Jam Tayang' },
    { key: 'status', label: 'Status' },
    { key: 'hook', label: 'Hook / Headline' },
    { key: 'caption', label: 'Caption' },
    { key: 'hashtags', label: 'Hashtags' },
    { key: 'assignee', label: 'Assignee (PIC)' },
    { key: 'assetUrl', label: 'Link Asset Visual' },
    { key: 'notes', label: 'Catatan Tim' },
  ];

  const enrichedData = posts.map(post => ({
    project: projectMap[post.projectId] || post.projectId,
    account: accountMap[post.accountId] || post.accountId,
    title: post.title,
    format: post.format,
    publishDate: post.publishDate,
    publishTime: post.publishTime,
    status: post.status.toUpperCase(),
    hook: post.hook || '',
    caption: post.caption || '',
    hashtags: (post.hashtags || []).join(' '),
    assignee: post.assignee || 'Unassigned',
    assetUrl: post.assetUrl || '',
    notes: post.notes || '',
  }));

  const csv = convertToCSV(enrichedData, headers);
  downloadCSV(csv, filename);
}

export function exportAnalyticsToCSV(posts, projects, accounts, filename = 'social_media_analytics_report.csv') {
  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));
  const accountMap = Object.fromEntries(accounts.map(a => [a.id, a.handle]));
  const platformMap = Object.fromEntries(accounts.map(a => [a.id, a.platform]));

  const headers = [
    { key: 'project', label: 'Project' },
    { key: 'handle', label: 'Akun Sosmed' },
    { key: 'platform', label: 'Platform' },
    { key: 'title', label: 'Judul Konten' },
    { key: 'format', label: 'Format Konten' },
    { key: 'publishDate', label: 'Tanggal Tayang' },
    { key: 'views', label: 'Views / Tayangan' },
    { key: 'reach', label: 'Reach' },
    { key: 'likes', label: 'Likes' },
    { key: 'comments', label: 'Komentar' },
    { key: 'shares', label: 'Shares' },
    { key: 'saves', label: 'Saves' },
    { key: 'totalEngagement', label: 'Total Interaksi' },
    { key: 'engagementRate', label: 'Engagement Rate (%)' },
  ];

  const publishedPosts = posts.filter(p => p.status === 'published' && p.metrics);

  const enrichedData = publishedPosts.map(p => {
    const m = p.metrics || {};
    const views = m.views || 0;
    const reach = m.reach || views;
    const likes = m.likes || 0;
    const comments = m.comments || 0;
    const shares = m.shares || 0;
    const saves = m.saves || 0;
    const totalEng = likes + comments + shares + saves;
    const er = reach > 0 ? ((totalEng / reach) * 100).toFixed(2) : '0.00';

    return {
      project: projectMap[p.projectId] || p.projectId,
      handle: accountMap[p.accountId] || p.accountId,
      platform: (platformMap[p.accountId] || '').toUpperCase(),
      title: p.title,
      format: p.format,
      publishDate: p.publishDate,
      views,
      reach,
      likes,
      comments,
      shares,
      saves,
      totalEngagement: totalEng,
      engagementRate: `${er}%`,
    };
  });

  const csv = convertToCSV(enrichedData, headers);
  downloadCSV(csv, filename);
}
