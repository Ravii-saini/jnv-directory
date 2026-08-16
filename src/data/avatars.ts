export interface PresetAvatar {
  file: string
  category: 'boy' | 'girl'
  url: string
}

const RAW: Array<Omit<PresetAvatar, 'url'>> = [
  { file: 'spark', category: 'boy' },
  { file: 'cove', category: 'boy' },
  { file: 'amber', category: 'boy' },
  { file: 'clover', category: 'boy' },
  { file: 'willow', category: 'girl' },
  { file: 'plum', category: 'girl' },
  { file: 'rosewood', category: 'girl' },
  { file: 'frost', category: 'girl' },
]

export const PRESET_AVATARS: PresetAvatar[] = RAW.map((a) => ({
  ...a,
  url: `/avatars/${a.file}.png`,
}))
