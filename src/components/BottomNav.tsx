import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function BottomNav() {
  const { profile } = useAuth()

  return (
    <nav className="bottomnav">
      <NavLink to="/" end className={({ isActive }) => `bottomnav-item${isActive ? ' active' : ''}`}>
        <span className="bottomnav-icon">🏠</span>
        Directory
      </NavLink>
      <NavLink to="/me" className={({ isActive }) => `bottomnav-item${isActive ? ' active' : ''}`}>
        <span className="bottomnav-icon">👤</span>
        My profile
      </NavLink>
      {profile?.isAdmin && (
        <NavLink to="/admin" className={({ isActive }) => `bottomnav-item${isActive ? ' active' : ''}`}>
          <span className="bottomnav-icon">🛡️</span>
          Admin
        </NavLink>
      )}
    </nav>
  )
}
