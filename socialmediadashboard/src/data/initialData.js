// Master Projects & Accounts for Ariel (Clean Slate - No Sample Data)
export const initialProjects = [
  {
    id: 'proj-1',
    name: 'Pintu Potret',
    category: 'Photography & Creative Studio',
    description: 'Jasa fotografi, videografi, dan visual branding profesional Malang & Pasuruan.',
    color: '#ec4899', // Pink
  },
  {
    id: 'proj-2',
    name: 'KL Bizhub Malang',
    category: 'Commercial & Business Park',
    description: 'Kawasan komersial, pergudangan, ruko, dan sentra bisnis modern terpadu di Malang.',
    color: '#3b82f6', // Blue
  },
  {
    id: 'proj-3',
    name: 'Singhasari Hunian & Komersial',
    category: 'Residential & Commercial Estate',
    description: 'Kawasan hunian modern, ruko komersial, dan investasi properti bernilai tinggi di Singhasari Malang.',
    color: '#f59e0b', // Amber
  },
  {
    id: 'proj-4',
    name: 'Riverside Malang',
    category: 'Riverside Residential',
    description: 'Hunian eksklusif tepi sungai dengan udara asri sejuk alami dan fasilitas lengkap di Malang.',
    color: '#10b981', // Emerald
  },
];

export const initialAccounts = [
  {
    id: 'acc-ig-1',
    projectId: 'proj-1',
    platform: 'instagram',
    handle: '@pintupotret.id',
    displayName: 'Pintu Potret',
    avatar: '',
    followers: 0,
    growthRate: '0%',
    bio: '',
    metaAccountId: '',
    metaAccessToken: '',
    isMetaConnected: false,
  },
  {
    id: 'acc-ig-2',
    projectId: 'proj-2',
    platform: 'instagram',
    handle: '@klbizhub_malang',
    displayName: 'KL Bizhub Malang',
    avatar: '',
    followers: 0,
    growthRate: '0%',
    bio: '',
    metaAccountId: '',
    metaAccessToken: '',
    isMetaConnected: false,
  },
  {
    id: 'acc-ig-3',
    projectId: 'proj-3',
    platform: 'instagram',
    handle: '@singhasarihuniankomersial',
    displayName: 'Singhasari Hunian & Komersial',
    avatar: '',
    followers: 0,
    growthRate: '0%',
    bio: '',
    metaAccountId: '',
    metaAccessToken: '',
    isMetaConnected: false,
  },
  {
    id: 'acc-tt-1',
    projectId: 'proj-3',
    platform: 'tiktok',
    handle: '@singhasarihuniankomersil',
    displayName: 'Singhasari Property TikTok',
    avatar: '',
    followers: 0,
    growthRate: '0%',
    bio: '',
    metaAccountId: '',
    metaAccessToken: '',
    isMetaConnected: false,
  },
  {
    id: 'acc-ig-4',
    projectId: 'proj-4',
    platform: 'instagram',
    handle: '@riversidemalang',
    displayName: 'Riverside Malang',
    avatar: '',
    followers: 0,
    growthRate: '0%',
    bio: '',
    metaAccountId: '',
    metaAccessToken: '',
    isMetaConnected: false,
  },
];

export const initialTeamMembers = [
  { id: 'usr-1', name: 'Ariel (You)', role: 'Lead Social Media Manager', email: 'ariel@workspace.local', avatar: '👨‍💼', isLead: true },
];

// Kosongkan seluruh postingan sample
export const initialPosts = [];

// Kosongkan seluruh grafik analitik sample
export const initialHistoricalAnalytics = [];
