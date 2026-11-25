// Initial sample data for Comments & Direct Messages (DMs)
export const initialComments = [
  {
    id: 'cm-1',
    accountId: 'acc-ig-1', // @pintupotret.id
    postTitle: 'Behind The Lens: Dokumentasi Graduation & Prewedding Estetik',
    postFormat: 'Reels',
    senderUsername: 'dindaputri_s',
    senderName: 'Dinda Putri',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    commentText: 'Kak, untuk paket foto wisuda bareng 3 orang sahabat di Malang berapa ya pricelist-nya? Bisa outdoor di kampus UB?',
    timestamp: '10 menit yang lalu',
    isReplied: false,
    replies: [],
  },
  {
    id: 'cm-2',
    accountId: 'acc-ig-2', // @klbizhub_malang
    postTitle: '3 Alasan Kenapa KL Bizhub Malang Jadi Pilihan Utama Pebisnis',
    postFormat: 'Feed Carousel',
    senderUsername: 'hendra.wijaya.logistik',
    senderName: 'Hendra Wijaya',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    commentText: 'Apakah unit gudang 200m2 masih ready stock? Akses kontainer 40 feet bisa masuk sampai depan pintu gudang?',
    timestamp: '35 menit yang lalu',
    isReplied: true,
    replies: [
      {
        id: 'rep-1',
        senderName: 'KL Bizhub Malang (You)',
        text: 'Halo Pak Hendra! Masih ready stock. Akses jalan kami dirancang khusus dengan ROW 16 meter, sangat leluasa untuk manuver kontainer 40ft. Kami kirimkan denah & spesifikasi ke DM ya Pak!',
        timestamp: '25 menit yang lalu',
      },
    ],
  },
  {
    id: 'cm-3',
    accountId: 'acc-ig-3', // @singhasarihuniankomersial
    postTitle: 'Kawasan Komersial Strategis Singhasari: Unit Terbatas!',
    postFormat: 'Single Post',
    senderUsername: 'rahmat_property',
    senderName: 'Rahmat Hidayat',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    commentText: 'Bisa minta brosur tipe ruko 2 lantai sama skema cicilan in-house 12 bulan kak?',
    timestamp: '1 jam yang lalu',
    isReplied: false,
    replies: [],
  },
  {
    id: 'cm-4',
    accountId: 'acc-ig-4', // @riversidemalang
    postTitle: 'Pagi Hari di Riverside Malang: Tenang, Sejuk, & Bebas Polusi',
    postFormat: 'Reels',
    senderUsername: 'clarissa.angelia',
    senderName: 'Clarissa Angelia',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    commentText: 'Suasananya adem banget 😍 Lokasi tepatnya di sebelah mana ya kak kalau dari pusat kota Malang?',
    timestamp: '3 jam yang lalu',
    isReplied: false,
    replies: [],
  },
];

export const initialDMs = [
  {
    id: 'dm-1',
    accountId: 'acc-ig-1', // @pintupotret.id
    senderUsername: 'anissa_novita',
    senderName: 'Anissa Novita',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    lastMessage: 'Halo kak, untuk tanggal 12 Desember ada slot photoshoot prewedding outdoor di Bromo gak ya?',
    timestamp: '5 menit yang lalu',
    unread: true,
    messages: [
      { id: 'm-1', from: 'them', text: 'Halo admin Pintu Potret! Suka banget sama tone foto-fotonya.', timestamp: '09:12' },
      { id: 'm-2', from: 'them', text: 'Untuk tanggal 12 Desember ada slot photoshoot prewedding outdoor di Bromo gak ya? Kira-kira paketnya include apa saja kak?', timestamp: '09:14' },
    ],
  },
  {
    id: 'dm-2',
    accountId: 'acc-ig-2', // @klbizhub_malang
    senderUsername: 'pt_surya_kencana',
    senderName: 'PT Surya Kencana (Bpk. Aris)',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    lastMessage: 'Baik mas, besok jam 10 pagi tim kami akan meluncur ke lokasi untuk survey gudang.',
    timestamp: '1 jam yang lalu',
    unread: false,
    messages: [
      { id: 'm-1', from: 'them', text: 'Selamat siang. Kami mencari sewa gudang jangka panjang 3 tahun untuk distribusi makanan beku.', timestamp: 'Kemarin' },
      { id: 'm-2', from: 'you', text: 'Selamat siang Pak Aris! Sangat cocok, kami memiliki unit gudang dengan daya listrik industri besar dan lantai beban tinggi. Apakah berkenan survey lokasi besok?', timestamp: 'Kemarin' },
      { id: 'm-3', from: 'them', text: 'Baik mas, besok jam 10 pagi tim kami akan meluncur ke lokasi untuk survey gudang.', timestamp: '10:05' },
    ],
  },
  {
    id: 'dm-3',
    accountId: 'acc-ig-3', // @singhasarihuniankomersial
    senderUsername: 'bramantyo_eko',
    senderName: 'Bramantyo Eko',
    senderAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    lastMessage: 'KPR BTN DP 0% syarat gajinya minimal berapa kak untuk unit rumah Singhasari?',
    timestamp: '2 jam yang lalu',
    unread: true,
    messages: [
      { id: 'm-1', from: 'them', text: 'Permisi min, mau tanya info rumah tipe 45 yang ada promo subsidi DP.', timestamp: '08:30' },
      { id: 'm-2', from: 'them', text: 'KPR BTN DP 0% syarat gajinya minimal berapa kak untuk unit rumah Singhasari?', timestamp: '08:32' },
    ],
  },
  {
    id: 'dm-4',
    accountId: 'acc-ig-4', // @riversidemalang
    senderUsername: 'dr_felicia',
    senderName: 'dr. Felicia Maharani',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    lastMessage: 'Boleh minta share location kantor pemasaran Riverside Malang kak?',
    timestamp: 'Kemarin',
    unread: false,
    messages: [
      { id: 'm-1', from: 'them', text: 'Halo Riverside Malang, saya tertarik dengan unit hook yang view sungai langsung.', timestamp: 'Kemarin' },
      { id: 'm-2', from: 'them', text: 'Boleh minta share location kantor pemasaran Riverside Malang kak?', timestamp: 'Kemarin' },
    ],
  },
];
