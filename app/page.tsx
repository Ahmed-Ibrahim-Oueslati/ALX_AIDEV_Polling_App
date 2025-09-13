"use client"

import React, { useEffect, useState } from 'react'
import './exemple.css'

type Poll = {
  id: string
  question: string
  options: { label: string; pct: number; selected?: boolean }[]
  status?: string
  meta?: string
}

const samplePolls: Poll[] = [
  {
    id: '1',
    question: 'Which programming language should we learn next?',
    status: 'Active',
    meta: 'Ahmed Ibrahim · 2 days ago · 127 votes',
    options: [
      { label: 'Rust', pct: 45, selected: true },
      { label: 'Go', pct: 30 },
      { label: 'TypeScript', pct: 25 }
    ]
  },
  {
    id: '2',
    question: 'Best code editor for 2025?',
    status: 'Draft',
    meta: 'Developer Team · 1 hour ago · 89 votes',
    options: [
      { label: 'Neovim (LazyVim)', pct: 65 },
      { label: 'VS Code', pct: 25 },
      { label: 'JetBrains IDEs', pct: 10 }
    ]
  }
]

export default function HomePage() {
  const [time, setTime] = useState('')
  const [polls, setPolls] = useState<Poll[]>(samplePolls)
  const [toast, setToast] = useState<string | null>(null)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [activeSidebar, setActiveSidebar] = useState('Dashboard')

  useEffect(() => {
    const up = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }
    up()
    const t = setInterval(up, 1000)
    return () => clearInterval(t)
  }, [])

  function handleOptionClick(pollId: string, optionIdx: number) {
    setPolls(prev => prev.map(p => {
      if (p.id !== pollId) return p
      const options = p.options.map((o, i) => ({ ...o, selected: i === optionIdx }))
      return { ...p, options }
    }))
    setToast('Vote registered (local only)')
    setTimeout(() => setToast(null), 1800)
  }

  function handleButtonClick(label: string) {
    setToast(`${label} clicked`)
    setTimeout(() => setToast(null), 1500)
  }

  return (
    <div>
      <header className="ex-header">
        <div className="header-content">
          <div className="logo"><span style={{fontSize:18}}>▣</span><span>PollWave</span></div>
          <nav className="nav">
            {['Dashboard','My Polls','Analytics','Settings'].map(n => (
              <a key={n} href="#" className={`nav-link ${activeNav===n? 'active': ''}`} onClick={(e)=>{e.preventDefault(); setActiveNav(n)}}>{n}</a>
            ))}
          </nav>
        </div>
      </header>

      <main className="ex-container">
        <div className="status-bar">
          <div className="status-item"><div className="status-indicator"/>System Online</div>
          <div className="status-item">👥 1,337 Active Users</div>
          <div className="status-item">📊 42 Active Polls</div>
          <div className="status-item">⏱️ <span id="current-time">{time}</span></div>
        </div>

        <div className="dashboard">
          <aside className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-title">Navigation</div>
              {['Dashboard','Create Poll','My Polls','Analytics'].map(s => (
                <div key={s} className={`sidebar-item ${activeSidebar===s? 'active':''}`} onClick={()=>setActiveSidebar(s)}>{s}</div>
              ))}
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Quick Actions</div>
              <button className="btn" style={{width:'100%', marginBottom:8}} onClick={()=>handleButtonClick('New Poll')}><span>＋</span> New Poll</button>
              <button className="btn btn-secondary" style={{width:'100%'}} onClick={()=>handleButtonClick('Export Data')}>Export Data</button>
            </div>
          </aside>

          <section className="main-content">
            <div className="content-header">
              <h2 className="content-title">Active Polls</h2>
              <div>
                <button className="btn" onClick={()=>handleButtonClick('Create Poll')}>＋ Create Poll</button>
              </div>
            </div>

            <div className="polls-grid">
              {polls.map(poll => (
                <article key={poll.id} className="poll-card">
                  <div className="poll-header">
                    <div className="poll-title">{poll.question}</div>
                    <div className="poll-status" style={{background: poll.status==='Draft' ? 'var(--accent-orange)': undefined}}>{poll.status}</div>
                  </div>
                  <div className="poll-meta">{poll.meta}</div>

                  <div className="poll-options">
                    {poll.options.map((opt, idx) => (
                      <div key={opt.label} className="option" onClick={()=>handleOptionClick(poll.id, idx)}>
                        <div className={`option-radio ${opt.selected? 'selected':''}`} />
                        <span>{opt.label}</span>
                        <div className="option-bar" style={{width: `${opt.pct}%`}} aria-hidden />
                      </div>
                    ))}
                  </div>

                  <div style={{display:'flex', gap:8, marginTop:12}}>
                    <button className="btn btn-secondary" onClick={()=>handleButtonClick('View')}>View</button>
                    <button className="btn btn-secondary" onClick={()=>handleButtonClick('Share')}>Share</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
