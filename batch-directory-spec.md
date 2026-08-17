# Batch Directory App — v1 Spec

## What this is
A verified, admin-approved directory for your school batch (starting with 2020),
where members can see each other's current city, job, Insta, and other details —
with per-field privacy control — plus a link to join the batch WhatsApp group.
Not a chat app. Not a feed. A living, always-current "who's who" of the batch.

## Scope for v1
- **Batch 2013–2020 only.** Data model is multi-batch-ready (every profile
  has a `batch` field storing the full range, visibility supports "batch
  only"), but signup/approval is open for this one batch alone. Other
  batches = future work, future admins.
- **You are the sole admin.** No per-batch admin roles yet — that's explicitly
  deferred until other batches actually get added.
- **No chat, no feed, no posts.** Directory + profiles only. A WhatsApp group
  link is provided for anything conversational — this app doesn't compete
  with that.

## User flow

1. **Landing** → single entry point for both new and returning users: enter
   phone number → OTP verification (Firebase Phone Auth) → app checks if
   this number is new, pending, approved, or rejected, and routes
   accordingly (see below)
2. **First-time signup ("Register")** → same entry point as login: enter
   phone number → OTP → if this number has never been seen before, prompted
   to fill mandatory fields (Name, 12th Stream, House, Current City,
   Instagram) before submission → submitted for approval. Optional fields
   (Photo, Bio, Job, LinkedIn, College) can be skipped and added later.
3. **Pending screen** → "Waiting for admin approval" → no push notification
   for v1 (cut, see Notification triggers below); user finds out the outcome
   by reopening the app, which reflects their current status live
   - Approved → "You're in! Welcome to [Batch] Directory."
   - Rejected → generic "Your request wasn't approved" message
4. **On approval, first login** → one-time profile setup (see Profile Fields
   below), each field has a visibility selector
5. **Prompted to "Add to Home Screen"** (one-time instructional screen)
6. **Home = Directory**
   - Search bar — searches by **name and city only** (not job, bio, or other
     fields)
   - Grid/list of approved members, respecting each viewer's visibility
     permissions per field
   - Tapping a member shows their full profile — only fields marked visible
     to this viewer are shown; others are simply omitted (not shown as
     "hidden", just absent)
7. **Own profile** → editable anytime, including changing any field's
   visibility later
8. **WhatsApp group links** — two join buttons, prominent on directory header
   and own profile screen:
   - "Join [Your Batch] WhatsApp Group" — scoped to the viewer's own batch
     (e.g. a 2020 member sees the 2020 group link; a future 2021 member
     would see the 2021 link). Stored per-batch in the data model, not as a
     single global link, so this is correct from day one even though only
     2020 is open right now.
   - "Join JNV Alumni WhatsApp Group" — school-wide, same link for everyone
     regardless of batch
   Both are static, admin-configured links, with a "copy link" fallback for
   browsers that don't auto-open WhatsApp.
9. **Admin view (you only)**
   - Pending requests queue → approve / reject (no push sent, per Notification
     triggers below)
   - Full member list → remove member (soft-remove: deactivates access,
     keeps profile record rather than hard-deleting)

## Profile fields (all optional except name)

| Field | Required at registration? | Visibility options | Notes |
|---|---|---|---|
| Name | **Mandatory** | always visible | not user-toggleable |
| Photo | Optional | Batch only / Anyone | can be added later |
| Bio | Optional | Batch only / Anyone | short free text, e.g. 1-2 lines — no Private option |
| 12th stream | **Mandatory** | always Anyone | not user-toggleable — Science / Commerce / Arts |
| House | **Mandatory** | always Anyone | not user-toggleable — Aravali / Nilgiri / Shivalik / Udaigiri |
| Current city | **Mandatory** | always Anyone | not user-toggleable |
| Current job / company | Optional | always Anyone | not user-toggleable, can be added later |
| Instagram link | **Mandatory** | Batch only / Anyone | no Private option |
| LinkedIn link | Optional | always Anyone | not user-toggleable |
| College | Optional | Batch only / Anyone | which college/university they attended after school |
| Phone number | auto-collected via OTP | Private / Batch only / Anyone | only field with a Private option; defaults to Private |
| Batch | auto-assigned | always visible (structural, not user-toggleable) | stored as a year range, e.g. "2013–2020", not a single year |

"Private" = only visible to the person themself (and admin). "Batch only" =
visible to other verified members of the same batch. "Anyone" = visible to
any verified user across any batch, once multi-batch exists — for now,
functionally same as "batch only" since only one batch exists.

## Notification triggers (v1)
Push notifications are cut for v1 — not needed at this scale. Status changes
(approved/rejected) are reflected live in the app via a Firestore listener on
the user's own profile; they just see it next time they open the app, no
push required. The Cloud Function code for approve/reject push (FCM) exists
in the repo but is intentionally not relied on — it also requires the Blaze
plan to deploy, which isn't enabled.

## Explicitly out of scope for v1
- Chat, group asks/polls, comments, threads (WhatsApp already does this)
- Multi-batch self-registration / other batches going live
- Per-batch admin roles
- Directory filters beyond name search (e.g. filter by city)
- Hard-delete of removed members (soft-remove only)
- Native iOS/Android apps (PWA + "Add to Home Screen" only)

## Security (v1)
Real threat model for this app: 50 known people you trust, not the public
internet. Security work is scoped to that — not enterprise-grade, but not
"just hope nobody looks."

- **Firestore security rules are the actual enforcement layer**, not just
  having Firebase Auth turned on. Rules must explicitly restrict:
  - Profile reads → only by users with `status: approved`
  - Profile writes → only by the profile's own owner (matched by UID), for
    their own document
  - Approve / reject / remove actions → only callable by the admin's
    specific Firebase UID, enforced in rules (or a Cloud Function), not just
    hidden in the UI. A hidden button is not a security boundary.
  - Field-level privacy (Private / Batch only / Anyone) enforced in rules
    where feasible, not just filtered client-side in the UI
- **App Check** enabled on Firebase Phone Auth to prevent bot-driven OTP
  spam (protects your SMS quota/cost, not just abuse in the abstract)
- **Storage rules**: restrict photo uploads to image MIME types only, cap
  file size (e.g. 5MB), reject anything else
- **Free-text fields (Bio, etc.)** rendered as plain text, not raw HTML —
  standard escaping to avoid any injection surface, even though risk is low
  at this scale
- **No test-mode Firestore in production** — test mode (open read/write)
  must never be the deployed state; it's the single most common way small
  Firebase apps get their data scraped

Explicitly not doing for v1 (over-engineering for a 50-person trusted-friend
app): 2FA beyond OTP, end-to-end encryption, WAF/DDoS protection, formal
penetration testing.

## Technical approach
- **Frontend:** React PWA, installable via "Add to Home Screen" (works on
  both Android and iOS 16.4+)
- **Auth:** Firebase Phone Auth (OTP)
- **Backend/data:** Firebase Firestore (or Postgres if you'd rather keep it
  consistent with your other projects) for profiles, approval queue, member
  status
- **Notifications:** none for v1 — cut, see Notification triggers above
- **Hosting:** Firebase Hosting or Railway (same as your Rate Limiter plan)

## Known limitations to communicate to your batch at rollout
- No push notifications — check the app to see if you've been approved
- Admin approval is manual and single-person (you) — expect some delay
  between signup and approval, especially at launch with 50 people joining
  around the same time
