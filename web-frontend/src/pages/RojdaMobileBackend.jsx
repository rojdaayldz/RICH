import React, { useMemo, useState } from 'react'
import { demoProducts } from '../data/demoProducts'

export default function RojdaMobileBackend() {
  const [selected, setSelected] = useState('products')
  const [result, setResult] = useState(null)

  const endpoints = {
    products: { method:'GET', path:'/api/products', desc:'Mobil Ã¼rÃ¼n listesi', response:{ success:true, count:demoProducts.length, data:demoProducts.slice(0,4).map(x=>({id:x.id,name:x.name,price:x.price})) } },
    detail: { method:'GET', path:'/api/products/1', desc:'ÃœrÃ¼n detay cevabÄ±', response:{ success:true, data:demoProducts[0] } },
    login: { method:'POST', path:'/api/auth/login', desc:'Mobil giriÅŸ', response:{ success:true, token:'mobile-demo-token', user:{id:1, username:'mobile_user'} } },
    cart: { method:'POST', path:'/api/cart', desc:'Sepete ekleme', response:{ success:true, cartId:'RICH-CART-001', itemCount:3 } },
    order: { method:'POST', path:'/api/orders', desc:'SipariÅŸ oluÅŸturma', response:{ success:true, orderId:'RICH-MOB-001', status:'created'} }
  }

  const current = endpoints[selected]
  const json = useMemo(() => JSON.stringify(current.response, null, 2), [current])
  const run = () => setResult({ endpoint: current.path, method: current.method, status: 200, time: new Date().toLocaleTimeString('tr-TR') })

  return (
    <section className="api-page">
      <style>{css}</style>
      <div className="hero"><div><div className="kicker">ROJDA Â· MOBILE BACK-END</div><h1>Mobil API Test Paneli</h1><p>Endpoint seÃ§, JSON cevabÄ±nÄ± gÃ¶r, test Ã§alÄ±ÅŸtÄ±r.</p></div></div>
      <div className="layout">
        <aside className="list">
          <h2>Endpointler</h2>
          {Object.entries(endpoints).map(([k,e]) => (
            <button key={k} className={selected===k?'active':''} onClick={()=>setSelected(k)}>
              <b>{e.method}</b> <span>{e.path}</span><small>{e.desc}</small>
            </button>
          ))}
        </aside>
        <main className="panel">
          <div className="head"><div><b>{current.method}</b><h2>{current.path}</h2></div><button onClick={run}>Test Ã‡alÄ±ÅŸtÄ±r</button></div>
          <pre>{json}</pre>
          {result && <div className="result"><h3>Son Test</h3><p>Endpoint: <b>{result.endpoint}</b></p><p>Status: <b>{result.status}</b></p><p>Saat: <b>{result.time}</b></p></div>}
        </main>
      </div>
    </section>
  )
}

const css = `
.api-page{padding:42px 36px 70px;background:#071122;color:#f8fafc;min-height:calc(100vh - 120px)}
.kicker{color:#d7ad5b;letter-spacing:4px;font-size:12px;margin-bottom:10px}.hero h1{font-family:Georgia,serif;font-size:44px;margin:0 0 10px}.hero p{color:#a7b4c7}
.layout{display:grid;grid-template-columns:360px 1fr;gap:24px;margin-top:28px}.list,.panel{background:#0d1b33;border:1px solid #243653;border-radius:18px;padding:18px}.list h2{color:#d7ad5b}
.list button{width:100%;text-align:left;background:#091326;color:#dbeafe;border:1px solid #2b3f62;border-radius:14px;padding:14px;margin-bottom:10px;cursor:pointer}.list button.active{background:#d7ad5b;color:#071122}.list b{color:#4ade80}.list small{display:block;margin-top:7px;color:#94a3b8}.head{display:flex;justify-content:space-between;align-items:center}.head b{color:#4ade80}.head button{border:0;background:#d7ad5b;color:#071122;padding:12px 16px;border-radius:10px;font-weight:700;cursor:pointer}.panel pre{background:#050b16;border:1px solid #1f2f4a;border-radius:14px;padding:18px;color:#b7e4c7;white-space:pre-wrap}.result{margin-top:18px;background:#0b1528;border:1px solid #243653;border-radius:14px;padding:16px}.result h3{color:#d7ad5b}@media(max-width:900px){.layout{grid-template-columns:1fr}}
`

