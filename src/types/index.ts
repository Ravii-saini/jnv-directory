export type Visibility = 'private' | 'batch' | 'anyone'
export type OpenVisibility = 'batch' | 'anyone'
export type MemberStatus = 'pending' | 'approved' | 'rejected' | 'removed'
export type Stream = 'Science' | 'Commerce' | 'Arts'
export type House = 'Aravali' | 'Nilgiri' | 'Shivalik' | 'Udaigiri'

export const STREAMS: Stream[] = ['Science', 'Commerce', 'Arts']
export const HOUSES: House[] = ['Aravali', 'Nilgiri', 'Shivalik', 'Udaigiri']

/** The one batch open in v1. Data model supports others; only this is live. */
export const ACTIVE_BATCH = '2013–2020'

export interface Profile {
  uid: string
  phone: string
  phoneVisibility: Visibility // defaults to 'private'

  name: string // mandatory, always visible

  photoUrl?: string
  photoVisibility: OpenVisibility

  bio?: string
  bioVisibility: OpenVisibility

  stream: Stream // mandatory, always visible
  house: House // mandatory, always visible
  city: string // mandatory, always visible
  job?: string // always visible once set

  instagram: string // mandatory
  instagramVisibility: OpenVisibility

  linkedin?: string // always visible once set

  college?: string
  collegeVisibility: OpenVisibility

  batch: string // e.g. "2013–2020" — structural, always visible

  status: MemberStatus
  isAdmin?: boolean
  fcmToken?: string

  /** One-time gates in the post-approval flow. */
  profileSetupDone: boolean
  homeScreenPromptSeen: boolean

  createdAt: number
  updatedAt: number
}

export const MANDATORY_SIGNUP_FIELDS = [
  'name',
  'stream',
  'house',
  'city',
  'instagram',
] as const

export interface BatchConfig {
  batch: string
  whatsappLink: string
}

export interface AppConfig {
  jnvAlumniWhatsappLink: string
}

/** Fields a viewer is allowed to see on someone else's profile, given their relationship. */
export interface ViewerContext {
  viewerBatch: string
  isSelf: boolean
  isAdmin: boolean
}

export function canSeeField(
  ownerVisibility: Visibility,
  owner: { batch: string },
  ctx: ViewerContext,
): boolean {
  if (ctx.isSelf || ctx.isAdmin) return true
  if (ownerVisibility === 'private') return false
  if (ownerVisibility === 'batch') return owner.batch === ctx.viewerBatch
  return true // 'anyone'
}
