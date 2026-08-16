import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 11.5 12 4l8 7.5M6 9.5V19a1 1 0 0 0 1 1h3v-5a2 2 0 1 1 4 0v5h3a1 1 0 0 0 1-1V9.5"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} />
      <path
        d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
      />
    </svg>
  )
}

function ShieldIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5 5 6v6c0 4.5 3 7.5 7 8.5 4-1 7-4 7-8.5V6l-7-2.5Z"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function BottomNav() {
  const { profile } = useAuth()

  return (
    <nav className="bottomnav">
      <NavLink to="/" end className={({ isActive }) => `bottomnav-item${isActive ? ' active' : ''}`}>
        {({ isActive }) => (
          <>
            <span className="bottomnav-icon">
              <HomeIcon active={isActive} />
            </span>
            Directory
          </>
        )}
      </NavLink>
      <NavLink to="/me" className={({ isActive }) => `bottomnav-item${isActive ? ' active' : ''}`}>
        {({ isActive }) => (
          <>
            <span className="bottomnav-icon">
              <UserIcon active={isActive} />
            </span>
            My profile
          </>
        )}
      </NavLink>
      {profile?.isAdmin && (
        <NavLink to="/admin" className={({ isActive }) => `bottomnav-item${isActive ? ' active' : ''}`}>
          {({ isActive }) => (
            <>
              <span className="bottomnav-icon">
                <ShieldIcon active={isActive} />
              </span>
              Admin
            </>
          )}
        </NavLink>
      )}
    </nav>
  )
}
