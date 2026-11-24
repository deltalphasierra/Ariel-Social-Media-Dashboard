/**
 * AI Content Generation Service
 * Supports Google Gemini API (Free tier from Google AI Studio)
 * Plus rich fallback offline templates when no API key is provided.
 */

export async function generateContentWithGemini({
  apiKey,
  platform,
  format,
  topic,
  tone,
  targetAudience,
  niche,
}) {
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`;
      
      const prompt = `
Bertindaklah sebagai Senior Social Media Strategist & Content Creator profesional di Indonesia.
Buatkan konsep konten media sosial yang lengkap, menarik, dan berpotensi viral dengan detail berikut:

- Platform: ${platform}
- Format Konten: ${format}
- Niche / Industri: ${niche || 'Umum'}
- Topik / Ide Utama: ${topic}
- Tone of Voice: ${tone || 'Casual & Relatable'}
- Target Audience: ${targetAudience || 'Anak muda & profesional Indonesia usia 20-35'}

Balas HANYA dalam format JSON valid (tanpa markdown backtick atau teks lain di luar json) dengan struktur:
{
  "title": "Judul singkat konten",
  "hook": "Kalimat pembuka (hook) 3 detik pertama yang sangat menghentikan scrolling",
  "caption": "Copywriting caption lengkap dengan paragraf rapi, emotikon yang pas, dan Call to Action (CTA) yang kuat",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "visualDirection": "Instruksi visual atau adegan video untuk desainer / video editor",
  "bestTime": "Rekomendasi jam tayang optimal (contoh: 18:30 WIB)"
}
`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Gagal menghubungi Gemini API');
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Clean up markdown code blocks if returned
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart AI template generator:', err);
      // Fallback to local generator with a notice
      const fallback = generateSmartFallback({ platform, format, topic, tone, niche });
      fallback._fromFallback = true;
      fallback._errorNote = err.message;
      return fallback;
    }
  }

  // If no API key provided, use local smart generator
  return generateSmartFallback({ platform, format, topic, tone, niche });
}

export function generateSmartFallback({ platform, format, topic, tone, niche }) {
  const isTikTok = platform.toLowerCase().includes('tiktok');

  const hooks = [
    `Jangan scroll dulu kalau kamu masih sering salah paham soal ${topic}!`,
    `Rahasia ${topic} yang jarang banget dibahas kreator lain, padahal krusial banget.`,
    `Ternyata cuma butuh 1 trik simpel ini buat beresin masalah ${topic} kamu!`,
    `3 Alasan kenapa kamu wajib mulai perhatiin ${topic} dari sekarang.`,
    `Stop buang waktu! Ini cara tercepat handle ${topic} tanpa pusing.`,
  ];

  const selectedHook = hooks[Math.floor(Math.random() * hooks.length)];

  let caption = '';
  if (isTikTok) {
    caption = `POV: Kamu baru sadar kalau ${topic} itu kuncinya ada di konsistensi dan step kecil ini! 🔥\n\n` +
      `Banyak yang ngerasa ini ribet, padahal kalau diterapin perlahan dampaknya kerasa banget.\n\n` +
      `Coba tonton sampai habis dan kasih tau di kolom komentar: kamu udah coba cara ini belum?\n\n` +
      `Jangan lupa save video ini biar gampang dicari pas kamu butuh nanti! ✨`;
  } else if (format.includes('Carousel')) {
    caption = `Pernah gak sih ngerasa stuck pas ngebahas ${topic}? 🤔\n\n` +
      `Geser ke kanan buat baca breakdown lengkapnya slide demi slide 👉\n\n` +
      `📌 Slide 1-2: Masalah umum & akar penyebabnya\n` +
      `📌 Slide 3-4: Solusi praktis yang bisa kamu terapin hari ini\n` +
      `📌 Slide 5: Checklist penting sebelum mulai\n\n` +
      `Drop emoji 💡 kalau konten ini ngebantu kamu, dan share ke bestie kamu ya!`;
  } else {
    caption = `${selectedHook}\n\n` +
      `Di era serba cepat sekarang, ${topic} bukan lagi opsi tapi kebutuhan penting buat kamu yang pengen hasil maksimal.\n\n` +
      `Kuncinya bukan di seberapa banyak waktu yang kamu luangkan, tapi seberapa tepat strategi yang kamu pakai.\n\n` +
      `Bagikan pendapat kamu di bawah ya! Diskusi seru kita mulai di kolom komentar 👇`;
  }

  const tags = [
    `#${(topic || 'konten').replace(/[^a-zA-Z0-9]/g, '')}`,
    isTikTok ? '#SerunyaBelajar' : '#TipsAndTrik',
    isTikTok ? '#GayadiTikTok' : '#EdukasiSosmed',
    '#KontenHarian',
    '#ViralIndo',
    '#StrategiSosmed',
  ];

  return {
    title: `${topic || 'Ide Konten'} - ${format}`,
    hook: selectedHook,
    caption: caption,
    hashtags: tags,
    visualDirection: isTikTok
      ? 'Talking head dinamis di 3 detik pertama dengan teks hook besar warna kuning kontras, diselingi b-roll visual yang estetik.'
      : 'Desain carousel minimalis dengan font tebal dan warna kontras tinggi, max 20 kata per slide.',
    bestTime: '18:30 WIB',
  };
}
