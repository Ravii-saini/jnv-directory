export type Visibility = 'private' | 'batch' | 'anyone'
export type OpenVisibility = 'batch' | 'anyone'
export type MemberStatus = 'pending' | 'approved' | 'rejected' | 'removed'
export type Stream = 'PCM' | 'PCB' | 'Commerce' | 'Arts' | 'Others'
export type House = 'Aravali' | 'Nilgiri' | 'Shivalik' | 'Udaigiri'
export type OccupationStatus = 'working' | 'studying'
export type Section = 'A' | 'B'

export const STREAMS: Stream[] = ['PCM', 'PCB', 'Commerce', 'Arts', 'Others']
export const HOUSES: House[] = ['Aravali', 'Nilgiri', 'Shivalik', 'Udaigiri']
export const SECTIONS: Section[] = ['A', 'B']

/** The one batch open in v1. Data model supports others; only this is live. */
export const ACTIVE_BATCH = '2013–2020'

export interface Profile {
  uid: string
  phone: string
  phoneVisibility: Visibility // defaults to 'private'

  name: string // mandatory, always visible

  email: string // auto-collected from Google sign-in
  emailVisibility: OpenVisibility

  photoUrl?: string
  photoVisibility: OpenVisibility

  bio?: string
  bioVisibility: OpenVisibility

  stream: Stream // mandatory, always visible
  house: House // mandatory, always visible
  section?: Section // optional, always visible once set
  hometown: string // mandatory, always visible
  city: string // mandatory, always visible — current city
  occupationStatus?: OccupationStatus // defaults to 'working' when job is set but this isn't
  job?: string // company name if working, course/institution if studying — always visible once set

  instagram: string // mandatory
  instagramVisibility: OpenVisibility

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

export function occupationLabel(status: OccupationStatus | undefined): string {
  return status === 'studying' ? 'Course' : 'Job / company'
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
