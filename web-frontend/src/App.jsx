import React, { useState, useContext } from 'react'
import './App.css'
import Odeme from './pages/odeme'
import Adres from './pages/adres'
import Arama from './components/arama'
import Favoriler from './pages/favoriler'
import Sepet from './pages/sepet'
import UrunDetay from './pages/UrunDetay'
import Yorumlar from './pages/Yorumlar'
import Siparislerim from './pages/Siparislerim'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthContext } from './context/AuthContext'
import Kategori from './components/Kategori'
import RojdaMobileBackend from './pages/RojdaMobileBackend'

function App() {
  const [activeTab, setActiveTab] = useState('magaza')
  const [selectedCategory, setSelectedCategory] = useState('')
  const { user, logout, deleteAccount, cart } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
    setActiveTab('magaza')
  }

  const handleDeleteAccount = () => {
    const confirm1 = window.confirm("HesabÄ±nÄ±zÄ± silmek istediÄŸinize emin misiniz?")
    if (!confirm1) return
    const confirm2 = window.confirm("Bu iÅŸlem geri alÄ±namaz. Devam etmek istiyor musunuz?")
    if (confirm2) {
      deleteAccount()
      setActiveTab('magaza')
    }
  }

  return (
    <div className="rich-shop-layout">

      {/* NAVBAR */}
      <nav className="navbar-modern">
        <div
          className="logo-section"
          style={{ cursor: 'pointer' }}
          onClick={() => { setActiveTab('magaza'); setSelectedCategory('') }}
        >
          RICH
        </div>

        <div className="nav-links-modern">
          <button onClick={() => { setActiveTab('magaza'); setSelectedCategory('') }}>
            MaÄŸaza
          </button>

          <div className="dropdown-modern">
            <button className="dropbtn-modern">Kategoriler â–¾</button>
            <div className="dropdown-content-modern">
              {['kadin', 'erkek', 'bebek', 'aksesuar'].map((kat) => (
                <button
                  key={kat}
                  onClick={() => { setSelectedCategory(kat); setActiveTab('magaza') }}
                >
                  {kat.charAt(0).toUpperCase() + kat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setActiveTab('favoriler')}>Favoriler</button>
          <button onClick={() => setActiveTab('rojdaMobileBackend')}>Rojda API</button>

          {user ? (
            <>
              <button onClick={() => setActiveTab('hesabim')}>HesabÄ±m</button>
              <span style={{ color: '#c8a96e', fontSize: '12px', letterSpacing: '1px' }}>
                {user.fullName || user.email}
              </span>
              <button onClick={handleLogout} style={{ color: '#e57373' }}>
                Ã‡Ä±kÄ±ÅŸ
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('login')}>GiriÅŸ</button>
              <button
                onClick={() => setActiveTab('register')}
                style={{
                  background: '#ffffff',
                  color: '#0a0f1e',
                  borderRadius: '4px',
                  padding: '8px 16px',
                }}
              >
                KayÄ±t Ol
              </button>
            </>
          )}
        </div>

        <div className="nav-right">
          <Arama />
          <button className="cart-icon-btn" onClick={() => setActiveTab('sepet')}>
            ğŸ›’ {cart.length > 0 && (
              <span style={{
                fontSize: '10px',
                background: '#c8a96e',
                color: '#0a0f1e',
                borderRadius: '50%',
                padding: '1px 5px',
                marginLeft: '2px',
              }}>
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="content-modern">

        {activeTab === 'magaza' && (
          <>
            {/* Hero â€” sadece kategori seÃ§ili deÄŸilken */}
            {!selectedCategory && (
              <div style={{
                background: 'linear-gradient(135deg, #060b14 0%, #0f1f3d 60%, #060b14 100%)',
                padding: '80px 40px',
                borderBottom: '1px solid #1e2d4a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '40px',
              }}>
                <div>
                  <p style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '11px',
                    letterSpacing: '4px',
                    color: '#c8a96e',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                  }}>
                    2026 Ä°lkbahar â€” Yaz
                  </p>
                  <h1 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '56px',
                    fontWeight: '300',
                    letterSpacing: '6px',
                    color: '#ffffff',
                    lineHeight: '1.1',
                    marginBottom: '24px',
                    textTransform: 'uppercase',
                  }}>
                    Yeni<br />Koleksiyon
                  </h1>
                  <button
                    onClick={() => setSelectedCategory('kadin')}
                    style={{
                      background: '#ffffff',
                      color: '#0a0f1e',
                      border: 'none',
                      padding: '14px 36px',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '11px',
                      letterSpacing: '3px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    KeÅŸfet
                  </button>
                </div>

                <div style={{
                  background: '#0d1526',
                  border: '1px solid #1e2d4a',
                  borderRadius: '8px',
                  padding: '32px 40px',
                  textAlign: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '32px',
                    color: '#ffffff',
                    letterSpacing: '8px',
                  }}>RICH</div>
                  <div style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '10px',
                    letterSpacing: '2px',
                    color: '#c8a96e',
                    textTransform: 'uppercase',
                    marginTop: '4px',
                    marginBottom: '24px',
                  }}>Premium E-Ticaret</div>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    {[['4.8', 'Puan'], ['2K+', 'ÃœrÃ¼n'], ['%100', 'GÃ¼venli']].map(([val, label]) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: '22px',
                          color: '#c8a96e',
                        }}>{val}</div>
                        <div style={{
                          fontFamily: "'Jost', sans-serif",
                          fontSize: '10px',
                          color: '#4a5568',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          marginTop: '2px',
                        }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Kategori setSelectedCategory={setSelectedCategory} />
            <UrunDetay selectedCategory={selectedCategory} />
          </>
        )}

        {activeTab === 'rojdaMobileBackend' && <RojdaMobileBackend />}

        {activeTab === 'favoriler' && <Favoriler />}

        {activeTab === 'sepet' && (
          <div className="checkout-layout">
            <Sepet />
            <Odeme />
          </div>
        )}

        {activeTab === 'hesabim' && (
          <div className="profile-layout">
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '28px',
              color: '#f0f0f0',
              letterSpacing: '2px',
              borderBottom: '1px solid #1e2d4a',
              paddingBottom: '16px',
            }}>
              HesabÄ±m
            </div>
            <Adres />
            <Siparislerim />
            <Yorumlar />
            <button
              onClick={handleDeleteAccount}
              style={{
                background: 'none',
                border: '1px solid rgba(229, 115, 115, 0.4)',
                color: '#e57373',
                padding: '12px 24px',
                borderRadius: '4px',
                fontFamily: "'Jost', sans-serif",
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              HesabÄ± Sil
            </button>
          </div>
        )}

        {activeTab === 'login' && <Login setActiveTab={setActiveTab} />}
        {activeTab === 'register' && <Register setActiveTab={setActiveTab} />}
      </main>

      {/* FOOTER */}
      <footer className="footer-modern">
        Â© 2026 RICH E-Commerce â€” SDÃœ Bilgisayar MÃ¼hendisliÄŸi
      </footer>
    </div>
  )
}

export default App


