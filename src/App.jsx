import { useState, useRef } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './Context/AuthContext'
import StudentDashboard from "./Componets/Pages/StudentDashboard";
import FacultyDashboard from "./Componets/Pages/FacultyDashboard";
import './App.css'

function AuthForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  const isLoginView = location.pathname === '/login'

  const [formData, setFormData] = useState({
    StudentName: '',
    StudentEmail: '',
    Phone: '',
    ProfileImage: '',
    Password: '',
    ConfirmPassword: '',
    Role: 'student',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const cardWrapperRef = useRef(null)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardWrapperRef.current || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -3.5
    const rotateY = ((x - centerX) / centerX) * 3.5

    cardWrapperRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    if (!cardWrapperRef.current) return
    cardWrapperRef.current.style.transform =
      'perspective(1200px) rotateX(0deg) rotateY(0deg)'
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const filledFields = isLoginView
    ? [formData.StudentEmail.trim(), formData.Password.trim()].filter(Boolean).length
    : [
        formData.StudentName.trim(),
        formData.StudentEmail.trim(),
        formData.Phone.trim(),
        formData.Password.trim(),
        formData.ConfirmPassword.trim(),
      ].filter(Boolean).length

  const progressPercent = (filledFields / (isLoginView ? 2 : 5)) * 100

  const toggleView = () => {
    setStatus({ type: '', message: '' })
    setFormData({
      StudentName: '',
      StudentEmail: '',
      Phone: '',
      ProfileImage: '',
      Password: '',
      ConfirmPassword: '',
      Role: 'student',
    })
    if (isLoginView) {
      navigate('/register')
    } else {
      navigate('/login')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isLoginView && formData.Password !== formData.ConfirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match. Please verify both fields.' })
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    const endpoint = isLoginView
      ? 'https://backend-edu-git-main-mobi-llm.vercel.app/Login'
      : 'https://backend-edu-git-main-mobi-llm.vercel.app/Register'

    const payload = isLoginView
      ? { StudentEmail: formData.StudentEmail, Password: formData.Password }
      : formData

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication request failed. Please try again.')
      }

      if (isLoginView) {
        const token = data.token || data.data?.token
        const centralData = token.split('.')[1]
        const decodedToken = JSON.parse(atob(centralData))

        const savedProfileExtras = JSON.parse(localStorage.getItem('registered_profile') || '{}')

        let userData = {
          ...decodedToken,
          ...(data.user || {}),
          Phone: data.user?.Phone || decodedToken?.Phone || savedProfileExtras[formData.StudentEmail]?.Phone || '',
          ProfileImage:
            data.user?.ProfileImage ||
            decodedToken?.ProfileImage ||
            savedProfileExtras[formData.StudentEmail]?.ProfileImage ||
            '',
        }

        // Also check live role from MongoDB so if user changed role to "faculty" in Compass, it works 100%!
        try {
          const roleRes = await fetch(
            `http://localhost:3000/api/ai-agent/faculty/check-role?email=${encodeURIComponent(
              formData.StudentEmail
            )}`
          )
          const roleData = await roleRes.json()
          if (roleData && roleData.success && roleData.role) {
            userData = {
              ...userData,
              ...(roleData.user || {}),
              role: roleData.role,
              Role: roleData.role,
            }
          }
        } catch (err) {}

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        login(token, userData)

        const resolvedRole = String(userData.role || userData.Role || 'student').toLowerCase()

        if (resolvedRole === 'admin') {
          navigate('/admin-dashboard')
        } else if (resolvedRole === 'faculty') {
          navigate('/faculty-dashboard')
        } else {
          navigate('/student-dashboard')
        }
      } else {
        const existingExtras = JSON.parse(localStorage.getItem('registered_profile') || '{}')
        existingExtras[formData.StudentEmail] = {
          Phone: formData.Phone || '',
          ProfileImage: formData.ProfileImage || '',
        }
        localStorage.setItem('registered_profile', JSON.stringify(existingExtras))

        setStatus({
          type: 'success',
          message: 'Account created successfully. Redirecting to sign in...',
        })
        setTimeout(() => {
          navigate('/login')
        }, 1200)
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to connect to the authentication server. Please verify the backend is running.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cyber-scene">
      <div className="cyber-grid"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div
        className="card-3d-wrapper"
        ref={cardWrapperRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-border-glow">
          <div className="card" ref={cardRef}>
            <div className="progress-container">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="card-header">
              <div className="badge-3d">
                <span className="pulse-dot"></span>
                EDUSPHERE ACADEMIC PORTAL
              </div>
              <h2>{isLoginView ? 'Sign In to Workspace' : 'Create Student Account'}</h2>
              <p>
                {isLoginView
                  ? 'Enter your academic credentials to access your dashboard'
                  : 'Complete your profile to unlock AI tutoring & assessments'}
              </p>
            </div>

            {status.message && (
              <div className={`alert ${status.type}`}>
                {status.type === 'success' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLoginView && (
                <div className="form-group">
                  <div className="label-row">
                    <label>Full Name</label>
                  </div>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      name="StudentName"
                      placeholder="e.g. Syed Mustafa"
                      value={formData.StudentName}
                      onChange={handleChange}
                      required={!isLoginView}
                    />
                    <span className="input-laser"></span>
                  </div>
                </div>
              )}

              <div className="form-group">
                <div className="label-row">
                  <label>Email Address</label>
                </div>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    type="email"
                    name="StudentEmail"
                    placeholder="name@university.edu"
                    value={formData.StudentEmail}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-laser"></span>
                </div>
              </div>

              {!isLoginView && (
                <div className="form-row">
                  <div className="form-group">
                    <div className="label-row">
                      <label>Phone Number</label>
                    </div>
                    <div className="input-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <input
                        type="text"
                        name="Phone"
                        placeholder="+92 300 1234567"
                        value={formData.Phone}
                        onChange={handleChange}
                        required={!isLoginView}
                      />
                      <span className="input-laser"></span>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="label-row">
                      <label>Avatar URL (Optional)</label>
                    </div>
                    <div className="input-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <input
                        type="text"
                        name="ProfileImage"
                        placeholder="https://..."
                        value={formData.ProfileImage}
                        onChange={handleChange}
                      />
                      <span className="input-laser"></span>
                    </div>
                  </div>
                </div>
              )}

              <div className={!isLoginView ? "form-row" : ""}>
                <div className="form-group">
                  <div className="label-row">
                    <label>Password</label>
                  </div>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="Password"
                      placeholder="••••••••"
                      value={formData.Password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                    <span className="input-laser"></span>
                  </div>
                </div>

                {!isLoginView && (
                  <div className="form-group">
                    <div className="label-row">
                      <label>Confirm Password</label>
                    </div>
                    <div className="input-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="ConfirmPassword"
                        placeholder="••••••••"
                        value={formData.ConfirmPassword}
                        onChange={handleChange}
                        required={!isLoginView}
                      />
                      <span className="input-laser"></span>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <span>{isLoginView ? 'Sign In to Workspace' : 'Create Student Account'}</span>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="auth-switch-footer">
              <span>{isLoginView ? "Don't have an account?" : 'Already have an account?'}</span>
              <button
                type="button"
                onClick={toggleView}
                className="auth-switch-link"
              >
                {isLoginView ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', color: '#f8fafc', background: '#07090e', minHeight: '100vh' }}>
      <h1>Executive Admin Portal</h1>
      <p style={{ margin: '16px 0', color: '#94a3b8' }}>Authenticated as {user?.email || 'Administrator'}</p>
      <button
        onClick={handleLogout}
        className="submit-btn"
        style={{ maxWidth: '180px', margin: '0 auto' }}
      >
        Sign Out
      </button>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="/register" element={<AuthForm />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App