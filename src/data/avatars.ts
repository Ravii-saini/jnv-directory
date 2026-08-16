export interface PresetAvatar {
  file: string
  category: 'boy' | 'girl'
  url: string
}

const RAW: Array<Omit<PresetAvatar, 'url'>> = [
  { file: 'kaen', category: 'boy' },
  { file: 'sui', category: 'boy' },
  { file: 'kuro', category: 'boy' },
  { file: 'izu', category: 'boy' },
  { file: 'ren', category: 'girl' },
  { file: 'aiko', category: 'girl' },
  { file: 'kage', category: 'girl' },
  { file: 'hana', category: 'girl' },
]

export const PRESET_AVATARS: PresetAvatar[] = RAW.map((a) => ({
  ...a,
  url: `/avatars/${a.file}.png`,
}))
