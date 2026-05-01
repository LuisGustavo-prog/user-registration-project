import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, updateName, updatePhone, updateEmail, updatePassword, requestDelete, confirmDelete } from '../services/userService'
import { removeToken } from '../utils/auth'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState('Perfil')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteCode, setDeleteCode] = useState('')
  const [deleteRequested, setDeleteRequested] = useState(false)

  useEffect(() => {
    getUser().then(res => setUser(res.data)).catch(() => navigate('/login'))
  }, [])

  const handleLogout = () => { removeToken(); navigate('/login') }

  const handle = async (fn, payload) => {
    setError(''); setSuccess('')
    try {
      await fn(payload)
      setSuccess('Salvo com sucesso!')
      const res = await getUser()
      setUser(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao atualizar')
    }
  }

  const handleUpdatePassword = () => {
    setError(''); setSuccess('')
    if (newPassword.length < 8) { setError('A nova senha deve ter no mínimo 8 caracteres'); return }
    handle(updatePassword, { old_password: oldPassword, new_password: newPassword })
  }

  const handleRequestDelete = async () => {
    setError(''); setSuccess('')
    try {
      await requestDelete({ password: deletePassword })
      setDeleteRequested(true)
      setSuccess('Código enviado para o seu email!')
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao solicitar exclusão')
    }
  }

  const handleConfirmDelete = async () => {
    setError(''); setSuccess('')
    try {
      await confirmDelete({ code: deleteCode })
      removeToken(); navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Código inválido')
    }
  }

  const handleNavClick = (section) => {
    setActiveSection(section)
    setError('')
    setSuccess('')
  }

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#060d1f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
    </div>
  )

  const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div style={s.page}>
      <aside style={s.sidebar}>
        <div style={s.sidebarTop}>
          <div style={s.avatar}>{initials}</div>
          <div style={s.sidebarUser}>
            <p style={s.sidebarName}>{user.name}</p>
            <p style={s.sidebarEmail}>{user.email}</p>
          </div>
        </div>
        <nav style={s.nav}>
          {['Perfil', 'Conta', 'Segurança'].map((item) => (
            <div key={item} onClick={() => handleNavClick(item)}
              style={{ ...s.navItem, ...(activeSection === item ? s.navItemActive : {}) }}>
              {item}
            </div>
          ))}
        </nav>
        <button onClick={handleLogout} style={s.logoutBtn}>→ Sair</button>
      </aside>

      <main style={s.main}>
        {error && <div style={s.toast}><div style={{ ...s.toastDot, background: '#f87171' }} />{error}</div>}
        {success && <div style={s.toast}><div style={{ ...s.toastDot, background: '#f59e0b' }} />{success}</div>}

        {activeSection === 'Perfil' && (
          <Section title="Perfil" description="Suas informações pessoais na plataforma.">
            <InfoRow label="Nome" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Telefone" value={user.telephone} />
            <InfoRow label="Status" value="Ativo" />
          </Section>
        )}

        {activeSection === 'Conta' && (
          <Section title="Conta" description="Atualize suas informações de contato.">
            <Row label="Nome" description="Seu nome de exibição na plataforma.">
              <div style={s.inputRow}>
                <Input placeholder="Novo nome" value={newName} onChange={setNewName} />
                <SaveBtn onClick={() => handle(updateName, { name: newName })} />
              </div>
            </Row>
            <Row label="Telefone" description="Número de contato da sua conta.">
              <div style={s.inputRow}>
                <Input placeholder="Novo telefone" value={newPhone} onChange={setNewPhone} />
                <SaveBtn onClick={() => handle(updatePhone, { telephone: newPhone })} />
              </div>
            </Row>
            <Row label="Email" description="Requer confirmação de senha atual.">
              <div style={s.inputStack}>
                <Input placeholder="Novo email" value={newEmail} onChange={setNewEmail} />
                <Input placeholder="Senha atual" value={emailPassword} onChange={setEmailPassword} type="password" />
                <SaveBtn onClick={() => handle(updateEmail, { email: newEmail, password: emailPassword })} />
              </div>
            </Row>
          </Section>
        )}

        {activeSection === 'Segurança' && (
          <Section title="Segurança" description="Gerencie sua senha e exclusão de conta.">
            <Row label="Senha" description="Use uma senha forte com pelo menos 8 caracteres.">
              <div style={s.inputStack}>
                <Input placeholder="Senha atual" value={oldPassword} onChange={setOldPassword} type="password" />
                <Input placeholder="Nova senha" value={newPassword} onChange={setNewPassword} type="password" />
                <SaveBtn onClick={handleUpdatePassword} />
              </div>
            </Row>
            <Divider />
            <Row label="Excluir conta" description="Ação permanente e irreversível." danger>
              {!deleteRequested ? (
                <div style={s.inputRow}>
                  <Input placeholder="Senha atual" value={deletePassword} onChange={setDeletePassword} type="password" danger />
                  <button onClick={handleRequestDelete} style={s.dangerBtn}>Solicitar</button>
                </div>
              ) : (
                <div style={s.inputRow}>
                  <Input placeholder="Código do email" value={deleteCode} onChange={setDeleteCode} danger />
                  <button onClick={handleConfirmDelete} style={s.dangerBtn}>Confirmar</button>
                </div>
              )}
            </Row>
          </Section>
        )}
      </main>
    </div>
  )
}

function Section({ title, description, children }) {
  return (
    <section style={s.section}>
      <div style={s.sectionHead}>
        <h2 style={s.sectionTitle}>{title}</h2>
        <p style={s.sectionDesc}>{description}</p>
      </div>
      <div>{children}</div>
    </section>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={s.infoRow}>
      <p style={s.infoLabel}>{label}</p>
      <p style={s.infoValue}>{value}</p>
    </div>
  )
}

function Row({ label, description, children, danger }) {
  return (
    <div style={s.row}>
      <div style={s.rowLeft}>
        <p style={{ ...s.rowLabel, color: danger ? '#f87171' : '#d0e0f8' }}>{label}</p>
        <p style={s.rowDesc}>{description}</p>
      </div>
      <div style={s.rowRight}>{children}</div>
    </div>
  )
}

function Input({ placeholder, value, onChange, type = 'text', danger }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        ...s.input,
        borderColor: focused
          ? (danger ? 'rgba(248,113,113,0.6)' : '#f59e0b')
          : (danger ? 'rgba(248,113,113,0.2)' : '#1e3a5f'),
        boxShadow: focused ? `0 0 0 3px ${danger ? 'rgba(248,113,113,0.08)' : 'rgba(245,158,11,0.08)'}` : 'none',
      }}
    />
  )
}

function SaveBtn({ onClick }) {
  return <button onClick={onClick} style={s.saveBtn}>Salvar</button>
}

function Divider() {
  return <div style={{ borderTop: '1px solid #1e3a5f', margin: '8px 0' }} />
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #060d1f 0%, #0a1628 60%, #0d1d35 100%)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    display: 'flex', position: 'relative',
  },
  sidebar: {
    position: 'fixed', left: 0, top: 0, bottom: 0, width: '240px',
    background: 'rgba(6, 13, 31, 0.95)',
    borderRight: '1px solid #1e3a5f',
    display: 'flex', flexDirection: 'column', padding: '32px 20px', zIndex: 10,
  },
  sidebarTop: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' },
  avatar: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#1a0a00', fontWeight: '700', fontSize: '13px', flexShrink: 0,
    boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
  },
  sidebarUser: { overflow: 'hidden' },
  sidebarName: { color: '#d0e0f8', fontSize: '13px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  sidebarEmail: { color: '#2e4a6a', fontSize: '12px', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  nav: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
  navItem: {
    padding: '8px 12px', borderRadius: '8px',
    color: '#3a5a80', fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  navItemActive: {
    background: 'rgba(245,158,11,0.1)',
    color: '#f59e0b',
    borderLeft: '2px solid #f59e0b',
  },
  logoutBtn: {
    background: 'transparent', border: 'none', color: '#2e4a6a',
    fontSize: '13px', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
    textAlign: 'left', padding: '8px 12px',
  },
  main: {
    marginLeft: '240px', flex: 1,
    padding: '64px 72px', maxWidth: '860px',
    position: 'relative', zIndex: 1,
  },
  toast: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(10,22,40,0.9)', border: '1px solid #1e3a5f',
    borderRadius: '10px', padding: '12px 16px',
    color: '#6b8ab0', fontSize: '13px', marginBottom: '40px',
  },
  toastDot: { width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0 },
  section: { marginBottom: '0' },
  sectionHead: { marginBottom: '40px' },
  sectionTitle: { color: '#f0f4ff', fontSize: '18px', fontWeight: '600', margin: '0 0 6px 0' },
  sectionDesc: { color: '#2e4a6a', fontSize: '13px', margin: 0 },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 0', borderBottom: '1px solid #0f2040',
  },
  infoLabel: { color: '#3a5a80', fontSize: '13px', margin: 0 },
  infoValue: { color: '#d0e0f8', fontSize: '13px', fontWeight: '500', margin: 0 },
  row: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: '48px',
    padding: '24px 0', borderBottom: '1px solid #0f2040',
  },
  rowLeft: { flex: '0 0 220px' },
  rowLabel: { fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' },
  rowDesc: { color: '#2e4a6a', fontSize: '13px', margin: 0, lineHeight: '1.5' },
  rowRight: { flex: 1 },
  inputRow: { display: 'flex', gap: '10px', alignItems: 'center' },
  inputStack: { display: 'flex', flexDirection: 'column', gap: '8px' },
  input: {
    background: '#071020', border: '1px solid #1e3a5f',
    borderRadius: '8px', padding: '10px 14px',
    color: '#d0e0f8', fontSize: '13px', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    width: '100%', boxSizing: 'border-box',
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    border: 'none', borderRadius: '8px', padding: '10px 18px',
    color: '#1a0a00', fontSize: '13px', fontWeight: '700',
    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
    whiteSpace: 'nowrap', flexShrink: 0,
    boxShadow: '0 4px 12px rgba(245,158,11,0.25)',
  },
  dangerBtn: {
    background: 'transparent', border: '1px solid rgba(248,113,113,0.3)',
    borderRadius: '8px', padding: '10px 18px',
    color: '#f87171', fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
    whiteSpace: 'nowrap', flexShrink: 0,
  },
}

export default Dashboard