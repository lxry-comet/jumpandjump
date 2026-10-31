import { Component, createRef } from 'react'
import css from './GameArea.module.css'

import platformSprite from '../../components/images/platforms/grass.png'
import crumbleSprite from '../../components/images/platforms/ground_rest.png'

/* ============================ КОНСТАНТЫ ============================ */

const PW = 40 // ширина игрока
const PH = 40 // высота игрока
const PLAT_H = 20
const JUMP = 15
const GRAVITY = 0.6
const MAX_FALL = 22

// Иконки предметов — обычные эмодзи. Заменишь на спрайты — правь только здесь.
const ICONS = { coin: '🪙', gem: '💎', rocket: '🚀', magnet: '🧲', star: '⭐', shield: '🛡️' }

const SOLID = ['normal', 'moving', 'spring']

/*
  Типы платформ:
  normal  — обычная (grass.png)
  crumble — рассыпается после приземления (ground_rest.png)
  moving  — ездит влево-вправо (синяя + стрелка ↔)
  spring  — пружина 🍄, прыжок в 1.75 раза выше
  cloud   — серое облако ☁️, исчезает после первого прыжка
*/

export default class GameArea extends Component {
  state = { phase: 'play', summary: null, result: null } // play | paused | over

  boxRef = createRef()
  g = null
  raf = null
  running = false
  paused = false
  last = 0
  keys = { left: false, right: false }
  pointerDown = false
  pointerDir = 0

  /* ============================ ЖИЗНЕННЫЙ ЦИКЛ ============================ */

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('resize', this.measure)
    document.addEventListener('visibilitychange', this.handleVisibility)
    this.startGame()
  }

  componentWillUnmount() {
    this.running = false
    cancelAnimationFrame(this.raf)
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('resize', this.measure)
    document.removeEventListener('visibilitychange', this.handleVisibility)
  }

  measure = () => {
    const el = this.boxRef.current
    if (el && this.g) {
      this.g.W = el.clientWidth
      this.g.H = el.clientHeight
    }
  }

  handleVisibility = () => {
    if (document.hidden) this.pause()
  }

  /* ============================ УПРАВЛЕНИЕ ============================ */

  handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
      this.state.phase === 'paused' ? this.resume() : this.pause()
    }
  }

  handleKeyUp = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false
  }

  setPointerDir = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    this.pointerDir = e.clientX - r.left < r.width / 2 ? -1 : 1
  }

  onPointerDown = (e) => {
    this.pointerDown = true
    this.setPointerDir(e)
  }

  onPointerMove = (e) => {
    if (this.pointerDown) this.setPointerDir(e)
  }

  onPointerUp = () => {
    this.pointerDown = false
  }

  pause = () => {
    if (this.state.phase !== 'play') return
    this.paused = true
    this.pointerDown = false
    this.setState({ phase: 'paused' })
  }

  resume = () => {
    this.paused = false
    this.last = performance.now()
    this.setState({ phase: 'play' })
  }

  exitRun = () => {
    // выход из паузы: монеты и статистика забега всё равно сохраняются
    this.running = false
    cancelAnimationFrame(this.raf)
    if (this.g && !this.g.dead) this.props.onGameOver(this.buildResult())
    this.props.onExit()
  }

  /* ============================ СТАРТ / КОНЕЦ ============================ */

  startGame = () => {
    const el = this.boxRef.current
    cancelAnimationFrame(this.raf)
    this.g = this.createGame(el.clientWidth, el.clientHeight)
    this.running = true
    this.paused = false
    this.pointerDown = false
    this.last = performance.now()
    this.setState({ phase: 'play', summary: null, result: null })
    this.raf = requestAnimationFrame(this.loop)
  }

  buildResult = () => ({ score: this.g.score, coins: this.g.coins, ...this.g.run })

  die = () => {
    const g = this.g
    g.dead = true
    this.running = false
    cancelAnimationFrame(this.raf)
    const result = this.buildResult()
    const summary = this.props.onGameOver(result) || {}
    this.setState({ phase: 'over', summary, result })
  }

  createGame(W, H) {
    const { config } = this.props
    const g = {
      W, H, time: 0, frame: 0, dist: 0, score: 0, coins: 0, face: 1,
      player: { x: W / 2 - PW / 2, y: H - 100 - PH, vx: 0, vy: 0 },
      plats: [{ id: 1, x: W / 2 - 40, y: H - 100, w: 80, type: 'normal' }],
      items: [], enemies: [], parts: [],
      topY: H - 100, lastType: 'normal', prevCx: W / 2, nextId: 2,
      rocket: 0, magnet: 0, shield: !!config.startShield, superJump: false,
      run: { jumps: 0, stomps: 0, springs: 0, crumbles: 0, rockets: 0, magnets: 0, gems: 0, shields: 0, superjumps: 0 },
      dead: false,
    }
    while (g.topY > -250) this.spawnRow(g)
    return g
  }

  /* ============================ ГЕНЕРАЦИЯ УРОВНЯ ============================ */

  spawnRow(g) {
    const diff = Math.min(1, g.score / 2500) // сложность растёт до 2500 м
    const gap = 70 + Math.random() * (35 + diff * 45) // максимум ~150 (прыжок достаёт ~187)
    const y = g.topY - gap
    const w = Math.round(80 - diff * 16)
    const x = Math.random() * (g.W - w)
    const cx = x + w / 2
    const prevSolid = SOLID.includes(g.lastType)
    const r = Math.random()

    // после хрупкой/облачной платформы всегда идёт надёжная — уровень проходим
    let type = 'normal'
    if (!prevSolid) {
      type = r < 0.7 ? 'normal' : r < 0.88 ? 'moving' : 'spring'
    } else {
      const c = 0.1 + diff * 0.18
      const m = c + 0.12 + diff * 0.15
      const cl = m + 0.06 + diff * 0.08
      const s = cl + 0.07
      type = r < c ? 'crumble' : r < m ? 'moving' : r < cl ? 'cloud' : r < s ? 'spring' : 'normal'
    }

    const plat = { id: g.nextId++, x, y, w, type }
    if (type === 'moving') plat.vx = (Math.random() < 0.5 ? -1 : 1) * (1 + diff * 1.6)
    if (type === 'crumble') Object.assign(plat, { breaking: false, timer: 0, falling: false, fvy: 0 })
    g.plats.push(plat)

    // предметы
    const addItem = (kind, ix, iy) => g.items.push({ id: g.nextId++, kind, x: ix, y: iy })
    if (type !== 'moving') {
      const roll = Math.random()
      const iy = y - 34
      if (roll < 0.012) addItem('rocket', cx - 14, iy - 6)
      else if (roll < 0.03) addItem('magnet', cx - 14, iy)
      else if (roll < 0.05) addItem('star', cx - 14, iy)
      else if (roll < 0.065) addItem('shield', cx - 14, iy)
      else if (roll < 0.1) addItem('gem', cx - 14, iy)
      else if (roll < 0.38) addItem('coin', cx - 14, iy)
    }
    // дорожка монет между платформами
    if (Math.random() < 0.2) {
      for (let i = 1; i <= 3; i++) {
        const t = i / 4
        addItem('coin', g.prevCx + (cx - g.prevCx) * t - 14, g.topY - gap * t - 14)
      }
    }

    // монстры (после 300 м)
    if (g.score > 300 && prevSolid && Math.random() < 0.07 + diff * 0.12) {
      const ex = 10 + Math.random() * (g.W - 60)
      g.enemies.push({
        id: g.nextId++, baseX: ex, x: ex, y: y + gap / 2 - 18,
        range: 20 + Math.random() * 50, speed: 0.03 + Math.random() * 0.03, phase: Math.random() * 6.28,
      })
    }

    g.topY = y
    g.lastType = type
    g.prevCx = cx
  }

  fx(g, x, y, text, life = 45, vy = -1.2) {
    g.parts.push({ id: g.nextId++, x, y, text, life, max: life, vy })
  }

  /* ============================ ИГРОВОЙ ЦИКЛ ============================ */

  loop = (t) => {
    if (!this.running) return
    const dt = Math.min((t - this.last) / 16.667, 2.5) // нормируем под 60 FPS
    this.last = t
    if (!this.paused) {
      this.step(dt)
      if (!this.running) return
      this.forceUpdate()
    }
    this.raf = requestAnimationFrame(this.loop)
  }

  land(pl) {
    const g = this.g
    const p = g.player
    let v = JUMP
    g.run.jumps++

    if (g.superJump) {
      v = JUMP * 1.9
      g.superJump = false
      g.run.superjumps++
      this.fx(g, p.x - 10, p.y - 20, this.props.t('fx_superhit'), 50)
    }
    if (pl.type === 'spring') {
      v = Math.max(v, JUMP * 1.75)
      g.run.springs++
    }
    if (pl.type === 'crumble') {
      pl.breaking = true
      pl.timer = 12 // ~0.2 c до обрушения
      g.run.crumbles++
    }
    if (pl.type === 'cloud') pl.gone = true

    p.vy = -v
    p.y = pl.y - PH
  }

  collect(it) {
    const g = this.g
    const cfg = this.props.config
    const x = it.x
    const y = it.y
    switch (it.kind) {
      case 'coin': g.coins += 1; this.fx(g, x, y, '+1'); break
      case 'gem': g.coins += 5; g.run.gems++; this.fx(g, x, y, '+5 💎'); break
      case 'rocket': g.rocket = cfg.rocketSec * 60; g.run.rockets++; this.fx(g, x - 10, y, this.props.t('fx_rocket'), 50); break
      case 'magnet': g.magnet = cfg.magnetSec * 60; g.run.magnets++; this.fx(g, x - 10, y, this.props.t('fx_magnet'), 50); break
      case 'star': g.superJump = true; this.fx(g, x - 20, y, this.props.t('fx_super'), 50); break
      case 'shield': g.shield = true; g.run.shields++; this.fx(g, x - 6, y, this.props.t('fx_shield'), 50); break
      default: break
    }
  }

  killEnemy(e) {
    const g = this.g
    e.dead = true
    g.run.stomps++
    g.coins += 3
    this.fx(g, e.x, e.y, '+3 💥', 40)
  }

  step(dt) {
    const g = this.g
    const p = g.player
    g.time += dt
    g.frame++

    // --- горизонтальное управление ---
    const dir = this.pointerDown ? this.pointerDir : (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0)
    p.vx += (dir * 5.5 - p.vx) * Math.min(1, 0.4 * dt)
    if (Math.abs(p.vx) > 0.5) g.face = p.vx < 0 ? -1 : 1

    // --- таймеры бонусов ---
    if (g.rocket > 0) {
      g.rocket -= dt
      if (g.rocket <= 0) { g.rocket = 0; p.vy = -6 }
    }
    if (g.magnet > 0) g.magnet = Math.max(0, g.magnet - dt)

    // --- физика ---
    const prevBottom = p.y + PH
    if (g.rocket > 0) p.vy = -18
    else p.vy = Math.min(MAX_FALL, p.vy + GRAVITY * dt)
    p.y += p.vy * dt
    p.x += p.vx * dt
    if (p.x < -PW / 2) p.x = g.W - PW / 2
    if (p.x > g.W - PW / 2) p.x = -PW / 2

    // --- платформы ---
    for (const pl of g.plats) {
      if (pl.type === 'moving') {
        pl.x += pl.vx * dt
        if (pl.x < 0) { pl.x = 0; pl.vx *= -1 }
        if (pl.x + pl.w > g.W) { pl.x = g.W - pl.w; pl.vx *= -1 }
      }
      if (pl.type === 'crumble' && pl.breaking && !pl.falling) {
        pl.timer -= dt
        if (pl.timer <= 0) pl.falling = true
      }
      if (pl.falling) {
        pl.fvy += 0.5 * dt
        pl.y += pl.fvy * dt
      }
    }

    // --- приземление ---
    if (p.vy > 0 && g.rocket <= 0) {
      const bottom = p.y + PH
      for (const pl of g.plats) {
        if (pl.falling || pl.gone) continue
        if (prevBottom <= pl.y + 8 && bottom >= pl.y && p.x + PW - 8 > pl.x && p.x + 8 < pl.x + pl.w) {
          this.land(pl)
          break
        }
      }
    }

    // --- предметы и магнит ---
    const pcx = p.x + PW / 2
    const pcy = p.y + PH / 2
    for (const it of g.items) {
      const ix = it.x + 14
      const iy = it.y + 14
      if (g.magnet > 0 && (it.kind === 'coin' || it.kind === 'gem')) {
        const dx = pcx - ix
        const dy = pcy - iy
        const d = Math.hypot(dx, dy)
        if (d < 200 && d > 1) {
          const sp = Math.min(d, 10 * dt)
          it.x += (dx / d) * sp
          it.y += (dy / d) * sp
        }
      }
      if (Math.hypot(pcx - (it.x + 14), pcy - (it.y + 14)) < 30) {
        it.taken = true
        this.collect(it)
      }
    }
    g.items = g.items.filter((i) => !i.taken)

    // --- монстры ---
    for (const e of g.enemies) {
      e.x = Math.max(0, Math.min(g.W - 36, e.baseX + Math.sin(g.time * e.speed + e.phase) * e.range))
      if (e.dead) continue
      const ex = e.x + 4
      const ey = e.y + 4
      const hit = p.x + 8 < ex + 28 && p.x + PW - 8 > ex && p.y + 6 < ey + 28 && p.y + PH > ey
      if (!hit) continue
      if (g.rocket > 0) {
        this.killEnemy(e)
      } else if (p.vy > 0 && prevBottom <= ey + 14) {
        this.killEnemy(e)
        p.vy = -JUMP * 0.9
      } else if (g.shield) {
        g.shield = false
        this.killEnemy(e)
      } else {
        return this.die()
      }
    }

    // --- скролл камеры ---
    const line = g.H * 0.4
    if (p.y < line) {
      const off = line - p.y
      p.y = line
      g.dist += off
      g.score = Math.floor(g.dist / 10)
      for (const arr of [g.plats, g.items, g.enemies, g.parts]) for (const o of arr) o.y += off
      g.topY += off
    }

    // --- эффекты ракеты и частицы ---
    if (g.rocket > 0 && g.frame % 2 === 0) this.fx(g, p.x + PW / 2 - 8 + (Math.random() * 10 - 5), p.y + PH + 14, '🔥', 14, 2.5)
    for (const o of g.parts) { o.y += o.vy * dt; o.life -= dt }
    g.parts = g.parts.filter((o) => o.life > 0)

    // --- очистка и новые платформы ---
    g.plats = g.plats.filter((pl) => !pl.gone && pl.y < g.H + 300)
    g.items = g.items.filter((i) => i.y < g.H + 60)
    g.enemies = g.enemies.filter((e) => !e.dead && e.y < g.H + 60)
    while (g.topY > -250) this.spawnRow(g)

    // --- падение: щит спасает один раз ---
    if (p.y > g.H) {
      if (g.shield) {
        g.shield = false
        p.vy = -JUMP * 1.6
        p.y = g.H - PH
        this.fx(g, p.x, p.y - 30, this.props.t('fx_saved'), 50)
      } else {
        return this.die()
      }
    }
  }

  /* ============================ РЕНДЕР ============================ */

  renderPlatform(pl) {
    const sprite = pl.type === 'crumble' ? crumbleSprite : platformSprite
    return (
      <div
        key={pl.id}
        className={css.plat}
        style={{ width: pl.w, height: PLAT_H, transform: `translate(${pl.x}px, ${pl.y}px)` }}
      >
        <img
          src={sprite}
          alt=""
          draggable={false}
          className={`${css.platImg} ${css['t_' + pl.type]} ${pl.breaking ? css.shake : ''}`}
        />
        {pl.type === 'moving' && <span className={css.badge}>↔</span>}
        {pl.type === 'cloud' && <span className={css.badge}>☁️</span>}
        {pl.type === 'spring' && <span className={css.springIcon}>🍄</span>}
      </div>
    )
  }

  render() {
    const g = this.g
    const { skin, best, config, t } = this.props
    const { phase, summary, result } = this.state

    if (!g) return <div className={css.gameArea}><div className={css.gameContainer} ref={this.boxRef} /></div>

    const p = g.player
    const h = Math.min(1, g.score / 3000)
    const bg = `hsl(${205 + h * 55}, ${60 - h * 10}%, ${58 - h * 50}%)`

    const speed = Math.abs(p.vy)
    const scaleY = 1 + speed * 0.02
    const scaleX = (1 - speed * 0.01) * g.face

    const effects = []
    if (g.rocket > 0) effects.push({ k: 'r', icon: '🚀', pct: g.rocket / (config.rocketSec * 60) })
    if (g.magnet > 0) effects.push({ k: 'm', icon: '🧲', pct: g.magnet / (config.magnetSec * 60) })
    if (g.shield) effects.push({ k: 's', icon: '🛡️', pct: 1 })
    if (g.superJump) effects.push({ k: 'j', icon: '⭐', pct: 1 })

    return (
      <div className={css.gameArea}>
        <div className={css.gameContainer} ref={this.boxRef} style={{ background: bg }}>
          <div className={css.stars} style={{ opacity: Math.max(0, (h - 0.2) * 1.4), backgroundPositionY: `${g.dist * 0.15}px` }} />

          {g.plats.map((pl) => this.renderPlatform(pl))}

          {g.items.map((it) => (
            <div key={it.id} className={css.item} style={{ transform: `translate(${it.x}px, ${it.y}px)` }}>
              <span className={css.bob}>{ICONS[it.kind]}</span>
            </div>
          ))}

          {g.enemies.map((e) => (
            <div key={e.id} className={css.enemy} style={{ transform: `translate(${e.x}px, ${e.y}px)` }}>
              <span className={css.bob}>👾</span>
            </div>
          ))}

          {/* ИГРОК */}
          <div className={css.player} style={{ width: PW, height: PH, transform: `translate(${p.x}px, ${p.y}px)` }}>
            {g.rocket > 0 && <div className={css.rocketIcon}>🚀</div>}
            {g.shield && <div className={css.shieldRing} />}
            {g.magnet > 0 && <div className={css.magnetRing} />}
            <div
              className={css.playerInner}
              style={{
                transform: `scale(${scaleX}, ${scaleY})`,
                filter: g.superJump ? 'drop-shadow(0 0 6px gold) drop-shadow(0 0 10px gold)' : undefined,
              }}
            >
              <img src={skin} alt="player" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          {g.parts.map((o) => (
            <div
              key={o.id}
              className={css.fx}
              style={{ transform: `translate(${o.x}px, ${o.y}px)`, opacity: o.life / o.max }}
            >
              {o.text}
            </div>
          ))}

          {/* Зона управления: левая/правая половина экрана */}
          <div
            className={css.touch}
            onPointerDown={this.onPointerDown}
            onPointerMove={this.onPointerMove}
            onPointerUp={this.onPointerUp}
            onPointerCancel={this.onPointerUp}
            onPointerLeave={this.onPointerUp}
          />

          {/* HUD */}
          <div className={css.hud}>
            <div className={css.hudLeft}>
              <div className={css.score}>{g.score}<small> {t('unit')}</small></div>
              <div className={css.bestBox}>🏆 {Math.max(best, g.score)}</div>
            </div>
            <div className={css.hudRight}>
              <div className={css.coinsBox}>🪙 {g.coins}</div>
              <button className={css.pauseBtn} onClick={this.pause}>⏸</button>
            </div>
          </div>
          <div className={css.effects}>
            {effects.map((ef) => (
              <div key={ef.k} className={css.effect}>
                <span>{ef.icon}</span>
                <div className={css.effBar}><div className={css.effFill} style={{ width: `${ef.pct * 100}%` }} /></div>
              </div>
            ))}
          </div>

          {phase === 'paused' && (
            <div className={css.overlay}>
              <div className={css.panel}>
                <h2>{t('g_pause')}</h2>
                <button className={css.btn} onClick={this.resume}>{t('g_resume')}</button>
                <button className={css.btnGhost} onClick={this.exitRun}>{t('g_menu')}</button>
              </div>
            </div>
          )}

          {phase === 'over' && result && (
            <div className={css.overlay}>
              <div className={css.panel}>
                <h2>{t('g_over')}</h2>
                <div className={css.bigScore}>{result.score} {t('unit')}</div>
                {summary?.newBest && <div className={css.newBest}>{t('g_newbest')}</div>}
                <div className={css.row}>{t('g_coins')} <b>{result.coins}</b></div>
                {result.stomps > 0 && <div className={css.row}>{t('g_stomps')} <b>{result.stomps}</b></div>}

                {summary?.missions?.length > 0 && (
                  <div className={css.rewards}>
                    {summary.missions.map((m) => (
                      <div key={m.id}>🎯 {t(m.id, { n: m.target })} <b>+{m.reward}🪙</b></div>
                    ))}
                  </div>
                )}
                {summary?.achievements?.length > 0 && (
                  <div className={css.rewards}>
                    {summary.achievements.map((a) => (
                      <div key={a.id}>{a.icon} {t('g_ach', { title: t(a.id) })} <b>+{a.reward}🪙</b></div>
                    ))}
                  </div>
                )}

                <button className={css.btn} onClick={this.startGame}>{t('g_again')}</button>
                <button className={css.btnGhost} onClick={this.props.onExit}>{t('g_menu')}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}