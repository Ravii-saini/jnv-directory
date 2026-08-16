import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './config'
import { ACTIVE_BATCH } from '../types'

const PLACEHOLDER_BATCH_LINK = 'https://chat.whatsapp.com/REPLACE_WITH_BATCH_2020_INVITE_LINK'
const PLACEHOLDER_ALUMNI_LINK = 'https://chat.whatsapp.com/REPLACE_WITH_JNV_ALUMNI_INVITE_LINK'

export async function getBatchWhatsAppLink(batch: string): Promise<string> {
  const snap = await getDoc(doc(db, 'batchConfig', batch))
  if (snap.exists()) return (snap.data().whatsappLink as string) ?? PLACEHOLDER_BATCH_LINK
  return batch === ACTIVE_BATCH ? PLACEHOLDER_BATCH_LINK : PLACEHOLDER_BATCH_LINK
}

export async function getAlumniWhatsAppLink(): Promise<string> {
  const snap = await getDoc(doc(db, 'appConfig', 'global'))
  if (snap.exists()) return (snap.data().jnvAlumniWhatsappLink as string) ?? PLACEHOLDER_ALUMNI_LINK
  return PLACEHOLDER_ALUMNI_LINK
}

export async function setBatchWhatsAppLink(batch: string, link: string): Promise<void> {
  await setDoc(doc(db, 'batchConfig', batch), { batch, whatsappLink: link }, { merge: true })
}

export async function setAlumniWhatsAppLink(link: string): Promise<void> {
  await setDoc(doc(db, 'appConfig', 'global'), { jnvAlumniWhatsappLink: link }, { merge: true })
}

export const PLACEHOLDERS = { PLACEHOLDER_BATCH_LINK, PLACEHOLDER_ALUMNI_LINK }
