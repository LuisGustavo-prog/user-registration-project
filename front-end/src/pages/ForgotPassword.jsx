import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { requestResetPassword, confirmResetPassword } from '../services/authService'

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await requestResetPassword({ email })
      setStep('confirm')
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao enviar código')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      return
    }
    setLoading(true)
    try {
      await confirmResetPassword({ email, code: parseInt(code), new_password: newPassword })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Código inválido ou expirado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.card}>

        {step === 'request' && (
          <>
            <h1 style={s.title}>Esqueceu a senha?</h1>
            <p style={s.subtitle}>Informe seu email e enviaremos um código de recuperação</p>

            {error && <div style={s.errorBox}>{error}</div>}

            <form onSubmit={handleRequest} style={s.form}>
              <Field label="Email" type="email" placeholder="seu@email.com" value={email} onChange={setEmail} />
              <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>
            </form>
          </>
        )}

        {step === 'confirm' && (
          <>
            <h1 style={s.title}>Redefinir senha</h1>
            <p style={s.subtitle}>Digite o código enviado para <strong style={{ color: '#f59e0b' }}>{email}</strong> e sua nova senha</p>

            {error && <div style={s.errorBox}>{error}</div>}

            <form onSubmit={handleConfirm} style={s.form}>
              <Field label="Código" type="text" placeholder="000000" value={code} onChange={setCode} />
              <Field label="Nova senha (mín. 8 caracteres)" type="password" placeholder="••••••••" value={newPassword} onChange={setNewPassword} />
              <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Salvando...' : 'Redefinir senha'}
              </button>
            </form>
          </>
        )}

        <p style={s.footer}>
          Lembrou a senha?{' '}
          <Link to="/login" style={s.link}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}

function Field({ label, type, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={s.fieldWrap}>
      <label style={s.label}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
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
  subtitle: { color: '#8aa8c8', fontSize: '14px', textAlign: 'center', margin: '0 0 32px 0', lineHeight: '1.6' },
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

export default ForgotPassword