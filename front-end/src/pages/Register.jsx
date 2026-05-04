import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/authService'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', telephone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (formData.password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      setLoading(false)
      return
    }
    try {
      await register(formData)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name', label: 'Nome completo', type: 'text', placeholder: 'seu nome' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'seu@email.com' },
    { name: 'telephone', label: 'Telefone', type: 'text', placeholder: '(11) 99999-9999' },
    { name: 'password', label: 'Senha (mín. 8 caracteres)', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.card}>
        <h1 style={s.title}>Criar conta</h1>
        <p style={s.subtitle}>Preencha seus dados para começar</p>

        {error && <div style={s.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          {fields.map(f => (
            <Field key={f.name} label={f.label} name={f.name} type={f.type}
              placeholder={f.placeholder} value={formData[f.name]} onChange={handleChange} />
          ))}
          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p style={s.footer}>
          Já tem conta?{' '}
          <Link to="/login" style={s.link}>Entrar</Link>
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
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: 'relative', overflow: 'hidden', padding: '32px 16px',
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
    border: '1px solid #1e3a5f', borderRadius: '20px', padding: '48px 44px',
    width: '100%', maxWidth: '400px',
    boxShadow: '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(245,158,11,0.08)',
    backdropFilter: 'blur(12px)',
  },
  title: { color: '#f0f4ff', fontSize: '22px', fontWeight: '600', textAlign: 'center', margin: '0 0 8px 0' },
  subtitle: { color: '#8aa8c8', fontSize: '14px', textAlign: 'center', margin: '0 0 32px 0' },
  errorBox: {
    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
    color: '#f87171', fontSize: '13px', padding: '11px 14px',
    borderRadius: '10px', marginBottom: '20px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#8aa8c8', fontSize: '13px', fontWeight: '500' },
  input: {
    background: '#071020', border: '1px solid #3a5a80',
    borderRadius: '10px', padding: '11px 14px',
    color: '#e8f0fe', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    width: '100%', boxSizing: 'border-box',
  },
  btn: {
    marginTop: '8px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    border: 'none', borderRadius: '10px', padding: '12px',
    color: '#1a0a00', fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: '0 4px 20px rgba(245,158,11,0.3)',
  },
  footer: { color: '#4a6a8a', fontSize: '13px', textAlign: 'center', marginTop: '24px' },
  link: { color: '#f59e0b', textDecoration: 'none', fontWeight: '500' },
}

export default Register