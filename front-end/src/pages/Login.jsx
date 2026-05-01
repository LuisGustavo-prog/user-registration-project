import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authService'
import { saveToken } from '../utils/auth'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await login(formData)
      saveToken(response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Credenciais inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.card}>
        <h1 style={s.title}>Bem-vindo de volta</h1>
        <p style={s.subtitle}>Entre com sua conta para continuar</p>

        {error && <div style={s.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <Field label="Email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} />
          <Field label="Senha" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={s.footer}>
          Sem conta?{' '}
          <Link to="/register" style={s.link}>Criar conta</Link>
        </p>
      </div>
    </div>
  )
}

function Field({ label, name, type, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={s.fieldWrap}>
      <label style={s.label}>{label}</label>
      <input
        name={name} type={type} value={value} onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          ...s.input,
          borderColor: focused ? '#f59e0b' : '#2a3a5c',
          boxShadow: focused ? '0 0 0 3px rgba(245,158,11,0.1)' : 'none',
        }}
      />
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #060d1f 0%, #0a1628 60%, #0d1d35 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute', width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
    borderRadius: '50%', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', pointerEvents: 'none',
  },
  card: {
    position: 'relative', zIndex: 1,
    background: 'rgba(10, 22, 40, 0.9)',
    border: '1px solid #1e3a5f',
    borderRadius: '20px', padding: '48px 44px',
    width: '100%', maxWidth: '400px',
    boxShadow: '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(245,158,11,0.08)',
    backdropFilter: 'blur(12px)',
  },
  title: { color: '#f0f4ff', fontSize: '22px', fontWeight: '600', textAlign: 'center', margin: '0 0 8px 0' },
  subtitle: { color: '#4a6080', fontSize: '14px', textAlign: 'center', margin: '0 0 32px 0' },
  errorBox: {
    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
    color: '#f87171', fontSize: '13px', padding: '11px 14px',
    borderRadius: '10px', marginBottom: '20px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#6b8ab0', fontSize: '13px', fontWeight: '500' },
  input: {
    background: '#071020', border: '1px solid #2a3a5c',
    borderRadius: '10px', padding: '11px 14px',
    color: '#e8f0fe', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    width: '100%', boxSizing: 'border-box',
  },
  btn: {
    marginTop: '8px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    border: 'none', borderRadius: '10px',
    padding: '12px', color: '#1a0a00',
    fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', letterSpacing: '0.02em',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: '0 4px 20px rgba(245,158,11,0.3)',
  },
  footer: { color: '#2e4a6a', fontSize: '13px', textAlign: 'center', marginTop: '24px' },
  link: { color: '#f59e0b', textDecoration: 'none', fontWeight: '500' },
}

export default Login