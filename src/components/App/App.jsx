import { Component } from 'react'
import css from './App.module.css'

import GameArea from '../GameArea/GameArea.jsx'
import InstallPrompt from '../InstallPrompt/InstallPrompt.jsx'
import { LANGS, detectLang, saveLang, makeT } from '../../i18n.js'

import defaultSkin from '../images/player/default_player.png'
import goldSkin from '../images/player/gold_player.png'
import purpleSkin from '../images/player/purple_player.png'
import grassSprite from '../images/platforms/grass.png'
import crumbleSprite from '../images/platforms/ground_rest.png'

/* ============================ КОНФИГ ============================ */

// Чтобы добавить новый скин — положи картинку и допиши объект сюда
const SKINS = [
  { id: 'default', name: 'skin_default', price: 0, img: defaultSkin },
  { id: 'gold', name: 'skin_gold', price: 150, img: goldSkin },
  { id: 'purple', name: 'skin_purple', price: 300, img: purpleSkin },
]

const UPGRADES = [
  { key: 'magnet', icon: '🧲', name: 'up_magnet', max: 5, costs: [60, 120, 200, 320, 500], desc: (t, l) => t('up_magnet_d', { n: 6 + l * 2 }) },
  { key: 'rocket', icon: '🚀', name: 'up_rocket', max: 5, costs: [80, 150, 250, 400, 650], desc: (t, l) => t('up_rocket_d', { n: (3 + l * 0.6).toFixed(1) }) },
  { key: 'shield', icon: '🛡️', name: 'up_shield', max: 1, costs: [250], desc: (t, l) => t(l ? 'up_shield_on' : 'up_shield_off') },
]

const getConfig = (u) => ({
  magnetSec: 6 + u.magnet * 2,
  rocketSec: 3 + u.rocket * 0.6,
  startShield: u.shield > 0,
})

// Ежедневные задания: mode 'sum' — копится за день, 'max' — лучший результат за один забег
const MISSION_POOL = [
  { id: 'm_height', icon: '🧗', stat: 'score', mode: 'max', target: 300, reward: 30 },
  { id: 'm_coins', icon: '🪙', stat: 'coins', mode: 'sum', target: 40, reward: 25 },
  { id: 'm_stomps', icon: '👾', stat: 'stomps', mode: 'sum', target: 5, reward: 30 },
  { id: 'm_springs', icon: '🍄', stat: 'springs', mode: 'sum', target: 10, reward: 25 },
  { id: 'm_crumbles', icon: '🧱', stat: 'crumbles', mode: 'sum', target: 12, reward: 25 },
  { id: 'm_rockets', icon: '🚀', stat: 'rockets', mode: 'sum', target: 2, reward: 35 },
  { id: 'm_magnets', icon: '🧲', stat: 'magnets', mode: 'sum', target: 2, reward: 25 },
  { id: 'm_gems', icon: '💎', stat: 'gems', mode: 'sum', target: 3, reward: 30 },
  { id: 'm_games', icon: '🎮', stat: 'games', mode: 'sum', target: 5, reward: 20 },
  { id: 'm_jumps', icon: '🦘', stat: 'jumps', mode: 'sum', target: 150, reward: 20 },
]

// Достижения (навсегда). get — текущее значение, target — цель
const ACHIEVEMENTS = [
  { id: 'a_first', icon: '🐣', d: 'd_games', target: 1, reward: 10, get: (s) => s.stats.games },
  { id: 'a_h100', icon: '🏃', d: 'd_height', target: 100, reward: 10, get: (s) => s.best },
  { id: 'a_h500', icon: '🧗', d: 'd_height', target: 500, reward: 30, get: (s) => s.best },
  { id: 'a_h1000', icon: '🏔️', d: 'd_height', target: 1000, reward: 60, get: (s) => s.best },
  { id: 'a_h2500', icon: '🌌', d: 'd_height', target: 2500, reward: 150, get: (s) => s.best },
  { id: 'a_c100', icon: '🪙', d: 'd_coinsTotal', target: 100, reward: 15, get: (s) => s.stats.coins },
  { id: 'a_c1000', icon: '💰', d: 'd_coinsTotal', target: 1000, reward: 75, get: (s) => s.stats.coins },
  { id: 'a_c5000', icon: '🏦', d: 'd_coinsTotal', target: 5000, reward: 200, get: (s) => s.stats.coins },
  { id: 'a_run50', icon: '🤑', d: 'd_runCoins', target: 50, reward: 40, get: (s) => s.stats.bestRunCoins },
  { id: 'a_stomp10', icon: '👾', d: 'd_stomps', target: 10, reward: 25, get: (s) => s.stats.stomps },
  { id: 'a_stomp50', icon: '🦖', d: 'd_stomps', target: 50, reward: 80, get: (s) => s.stats.stomps },
  { id: 'a_rocket5', icon: '🚀', d: 'd_rockets', target: 5, reward: 30, get: (s) => s.stats.rockets },
  { id: 'a_magnet5', icon: '🧲', d: 'd_magnets', target: 5, reward: 30, get: (s) => s.stats.magnets },
  { id: 'a_spring50', icon: '🍄', d: 'd_springs', target: 50, reward: 40, get: (s) => s.stats.springs },
  { id: 'a_crumble100', icon: '🧱', d: 'd_crumbles', target: 100, reward: 50, get: (s) => s.stats.crumbles },
  { id: 'a_gems25', icon: '💎', d: 'd_gems', target: 25, reward: 60, get: (s) => s.stats.gems },
  { id: 'a_shield10', icon: '🛡️', d: 'd_shields', target: 10, reward: 30, get: (s) => s.stats.shields },
  { id: 'a_super10', icon: '⭐', d: 'd_supers', target: 10, reward: 30, get: (s) => s.stats.superjumps },
  { id: 'a_jumps1000', icon: '🦘', d: 'd_jumps', target: 1000, reward: 70, get: (s) => s.stats.jumps },
  { id: 'a_games50', icon: '🎮', d: 'd_games', target: 50, reward: 60, get: (s) => s.stats.games },
  { id: 'a_skins', icon: '🎨', d: 'd_skins', target: SKINS.length, reward: 50, get: (s) => s.ownedSkins.length },
]

const LEGEND = [
  { sprite: grassSprite, text: 'leg_normal' },
  { sprite: crumbleSprite, text: 'leg_crumble' },
  { sprite: grassSprite, filter: 'hue-rotate(150deg) saturate(1.5)', text: 'leg_moving' },
  { sprite: grassSprite, emoji: '🍄', text: 'leg_spring' },
  { sprite: grassSprite, filter: 'grayscale(1) brightness(2.2)', opacity: 0.7, text: 'leg_cloud' },
]

const ITEMS_HELP = [
  ['🪙', 'it_coin'], ['💎', 'it_gem'], ['🚀', 'it_rocket'], ['🧲', 'it_magnet'],
  ['⭐', 'it_star'], ['🛡️', 'it_shield'], ['👾', 'it_enemy'],
]

/* ============================ СОХРАНЕНИЕ ============================ */

const SAVE_KEY = 'jj_save_v1'
const STAT_KEYS = ['jumps', 'coins', 'stomps', 'springs', 'crumbles', 'rockets', 'magnets', 'gems', 'shields', 'superjumps']

const today = () => new Date().toISOString().slice(0, 10)

const defaultSave = () => ({
  coins: 0,
  best: 0,
  ownedSkins: ['default'],
  skin: 'default',
  upgrades: { magnet: 0, rocket: 0, shield: 0 },
  stats: { games: 0, bestRunCoins: 0, ...Object.fromEntries(STAT_KEYS.map((k) => [k, 0])) },
  achievements: [],
  daily: { date: today(), counters: {}, done: [] },
})

const ensureDaily = (save) =>
  save.daily.date === today() ? save : { ...save, daily: { date: today(), counters: {}, done: [] } }

const loadSave = () => {
  const def = defaultSave()
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return def
    const s = JSON.parse(raw)
    return ensureDaily({
      ...def,
      ...s,
      stats: { ...def.stats, ...s.stats },
      upgrades: { ...def.upgrades, ...s.upgrades },
      daily: { ...def.daily, ...s.daily },
    })
  } catch {
    return def
  }
}

const getTodayMissions = (date) => {
  const day = Math.floor(new Date(date).getTime() / 86400000)
  const n = MISSION_POOL.length
  const start = day % n
  return [start, (start + 3) % n, (start + 7) % n].map((i) => MISSION_POOL[i])
}

const applyAchievements = (save) => {
  const unlocked = []
  let coins = save.coins
  const list = [...save.achievements]
  for (const a of ACHIEVEMENTS) {
    if (!list.includes(a.id) && a.get(save) >= a.target) {
      list.push(a.id)
      coins += a.reward
      unlocked.push(a)
    }
  }
  return { save: { ...save, coins, achievements: list }, unlocked }
}

/* ============================ APP ============================ */

export class App extends Component {
  state = {
    screen: 'menu', // menu | game | shop | quests
    tab: 'skins',
    save: loadSave(),
    toast: null,
    runKey: 0,
    lang: detectLang(),
  }

  toastTimer = null

  setLang = (code) => {
    saveLang(code)
    this.setState({ lang: code })
  }

  componentWillUnmount() {
    clearTimeout(this.toastTimer)
  }

  persist = (save) => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save))
    } catch {
      /* localStorage недоступен — играем без сохранения */
    }
    this.setState({ save })
  }

  showToast = (text) => {
    clearTimeout(this.toastTimer)
    this.setState({ toast: text })
    this.toastTimer = setTimeout(() => this.setState({ toast: null }), 2800)
  }

  go = (screen) => this.setState({ screen })

  startGame = () => this.setState((p) => ({ screen: 'game', runKey: p.runKey + 1 }))

  /* ---------- конец забега: статистика, задания, достижения ---------- */
  finishRun = (result) => {
    let s = ensureDaily(this.state.save)

    const stats = { ...s.stats, games: s.stats.games + 1 }
    for (const k of STAT_KEYS) stats[k] += result[k] || 0
    stats.bestRunCoins = Math.max(stats.bestRunCoins, result.coins)

    const newBest = result.score > s.best

    const counters = { ...s.daily.counters }
    const src = { ...result, games: 1 }
    for (const m of MISSION_POOL) {
      const cur = counters[m.stat] || 0
      counters[m.stat] = m.mode === 'max' ? Math.max(cur, src[m.stat] || 0) : cur + (src[m.stat] || 0)
    }

    const done = [...s.daily.done]
    const completedMissions = []
    let missionReward = 0
    for (const m of getTodayMissions(s.daily.date)) {
      if (!done.includes(m.id) && counters[m.stat] >= m.target) {
        done.push(m.id)
        missionReward += m.reward
        completedMissions.push(m)
      }
    }

    s = {
      ...s,
      coins: s.coins + result.coins + missionReward,
      best: Math.max(s.best, result.score),
      stats,
      daily: { ...s.daily, counters, done },
    }

    const { save, unlocked } = applyAchievements(s)
    this.persist(save)

    return {
      newBest,
      missions: completedMissions,
      achievements: unlocked,
      bonus: missionReward + unlocked.reduce((a, x) => a + x.reward, 0),
    }
  }

  /* ---------- магазин ---------- */
  buySkin = (skin) => {
    const { save } = this.state
    if (save.coins < skin.price || save.ownedSkins.includes(skin.id)) return
    const next = { ...save, coins: save.coins - skin.price, ownedSkins: [...save.ownedSkins, skin.id], skin: skin.id }
    const { save: withAch, unlocked } = applyAchievements(next)
    this.persist(withAch)
    if (unlocked.length) this.showToast(`🏆 ${makeT(this.state.lang)(unlocked[0].id)} +${unlocked[0].reward}🪙`)
  }

  selectSkin = (id) => this.persist({ ...this.state.save, skin: id })

  buyUpgrade = (up) => {
    const { save } = this.state
    const lvl = save.upgrades[up.key]
    if (lvl >= up.max) return
    const cost = up.costs[lvl]
    if (save.coins < cost) return
    this.persist({ ...save, coins: save.coins - cost, upgrades: { ...save.upgrades, [up.key]: lvl + 1 } })
  }

  /* ---------- экраны ---------- */
  renderMenu(t) {
    const { save, lang } = this.state
    const skin = SKINS.find((s) => s.id === save.skin) || SKINS[0]
    return (
      <div className={css.screen}>
        <div className={css.topBar}>
          <div className={css.chip}>🪙 {save.coins}</div>
          <div className={css.chip}>🏆 {save.best} {t('unit')}</div>
        </div>

        <div className={css.hero}>
          <h1 className={css.title}>JUMP<span>&</span>JUMP</h1>
          <div className={css.heroSkin}>
            <img src={skin.img} alt="" className={css.pix} />
          </div>
          <img src={grassSprite} alt="" className={`${css.pix} ${css.heroPlat}`} />
        </div>

        <button className={css.btnPlay} onClick={this.startGame}>{t('play')}</button>
        <div className={css.langRow} aria-label={t('lang')}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={`${css.langBtn} ${lang === l.code ? css.langActive : ''}`}
              onClick={() => this.setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className={css.navRow}>
          <button className={css.btn} onClick={() => this.go('shop')}>{t('shop')}</button>
          <button className={css.btn} onClick={() => this.go('quests')}>{t('quests')}</button>
        </div>
      </div>
    )
  }

  renderShop(t) {
    const { save, tab } = this.state
    return (
      <div className={css.screen}>
        <div className={css.topBar}>
          <button className={css.btnSmall} onClick={() => this.go('menu')}>{t('back')}</button>
          <div className={css.chip}>🪙 {save.coins}</div>
        </div>
        <h2 className={css.h2}>{t('shopTitle')}</h2>

        <div className={css.tabs}>
          <button className={`${css.tab} ${tab === 'skins' ? css.tabActive : ''}`} onClick={() => this.setState({ tab: 'skins' })}>{t('skins')}</button>
          <button className={`${css.tab} ${tab === 'upgrades' ? css.tabActive : ''}`} onClick={() => this.setState({ tab: 'upgrades' })}>{t('upgrades')}</button>
        </div>

        <div className={css.list}>
          {tab === 'skins' &&
            SKINS.map((sk) => {
              const owned = save.ownedSkins.includes(sk.id)
              const sel = save.skin === sk.id
              return (
                <div key={sk.id} className={`${css.card} ${sel ? css.cardSel : ''}`}>
                  <div className={css.skinBox}><img src={sk.img} alt="" className={css.pix} /></div>
                  <div className={css.cardInfo}>
                    <b>{t(sk.name)}</b>
                    <span>{owned ? (sel ? t('selected') : t('owned')) : `🪙 ${sk.price}`}</span>
                  </div>
                  {sel ? (
                    <button className={css.btnSmall} disabled>✔</button>
                  ) : owned ? (
                    <button className={css.btnSmall} onClick={() => this.selectSkin(sk.id)}>{t('choose')}</button>
                  ) : (
                    <button className={css.btnSmall} disabled={save.coins < sk.price} onClick={() => this.buySkin(sk)}>{t('buy')}</button>
                  )}
                </div>
              )
            })}

          {tab === 'upgrades' &&
            UPGRADES.map((up) => {
              const lvl = save.upgrades[up.key]
              const maxed = lvl >= up.max
              const cost = up.costs[lvl]
              return (
                <div key={up.key} className={css.card}>
                  <div className={css.skinBox}><span className={css.bigEmoji}>{up.icon}</span></div>
                  <div className={css.cardInfo}>
                    <b>{t(up.name)}</b>
                    <span>{up.desc(t, lvl)}</span>
                    <div className={css.pips}>
                      {Array.from({ length: up.max }).map((_, i) => (
                        <i key={i} className={`${css.pip} ${i < lvl ? css.pipOn : ''}`} />
                      ))}
                    </div>
                  </div>
                  {maxed ? (
                    <button className={css.btnSmall} disabled>MAX</button>
                  ) : (
                    <button className={css.btnSmall} disabled={save.coins < cost} onClick={() => this.buyUpgrade(up)}>🪙 {cost}</button>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    )
  }

  renderQuests(t) {
    const { save } = this.state
    const s = ensureDaily(save)
    const missions = getTodayMissions(s.daily.date)
    return (
      <div className={css.screen}>
        <div className={css.topBar}>
          <button className={css.btnSmall} onClick={() => this.go('menu')}>{t('back')}</button>
          <div className={css.chip}>🪙 {save.coins}</div>
        </div>

        <div className={css.list}>
          <h2 className={css.h2}>{t('daily')}</h2>
          {missions.map((m) => {
            const cur = Math.min(m.target, s.daily.counters[m.stat] || 0)
            const done = s.daily.done.includes(m.id)
            return (
              <div key={m.id} className={`${css.card} ${done ? css.cardDone : ''}`}>
                <div className={css.skinBox}><span className={css.bigEmoji}>{m.icon}</span></div>
                <div className={css.cardInfo}>
                  <b>{t(m.id, { n: m.target })}</b>
                  <div className={css.bar}><div className={css.barFill} style={{ width: `${(cur / m.target) * 100}%` }} /></div>
                  <span>{done ? t('done') : `${cur} / ${m.target}`} · {t('reward')} 🪙 {m.reward}</span>
                </div>
              </div>
            )
          })}

          <h2 className={css.h2}>{t('ach')} {save.achievements.length}/{ACHIEVEMENTS.length}</h2>
          {ACHIEVEMENTS.map((a) => {
            const got = save.achievements.includes(a.id)
            const cur = Math.min(a.target, a.get(save))
            return (
              <div key={a.id} className={`${css.card} ${got ? css.cardDone : css.cardLocked}`}>
                <div className={css.skinBox}><span className={css.bigEmoji}>{got ? a.icon : '🔒'}</span></div>
                <div className={css.cardInfo}>
                  <b>{t(a.id)}</b>
                  <span>{t(a.d, { n: a.target })}</span>
                  {!got && <div className={css.bar}><div className={css.barFill} style={{ width: `${(cur / a.target) * 100}%` }} /></div>}
                  <span>{got ? t('got') : `${cur} / ${a.target}`} · 🪙 {a.reward}</span>
                </div>
              </div>
            )
          })}

          <h2 className={css.h2}>{t('guide')}</h2>
          <div className={css.legend}>
            {LEGEND.map((l, i) => (
              <div key={i} className={css.legendRow}>
                <div className={css.legendPlat}>
                  <img src={l.sprite} alt="" className={css.pix} style={{ filter: l.filter, opacity: l.opacity }} />
                  {l.emoji && <span className={css.legendEmoji}>{l.emoji}</span>}
                </div>
                <span>{t(l.text)}</span>
              </div>
            ))}
            {ITEMS_HELP.map(([icon, text]) => (
              <div key={icon} className={css.legendRow}>
                <div className={css.legendPlat}><span className={css.legendItem}>{icon}</span></div>
                <span>{t(text)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { screen, save, toast, runKey, lang } = this.state
    const t = makeT(lang)
    const skin = SKINS.find((s) => s.id === save.skin) || SKINS[0]

    return (
      <div className={css.app}>
        {screen === 'menu' && this.renderMenu(t)}
        {screen === 'shop' && this.renderShop(t)}
        {screen === 'quests' && this.renderQuests(t)}
        {screen === 'game' && (
          <GameArea
            key={runKey}
            skin={skin.img}
            best={save.best}
            config={getConfig(save.upgrades)}
            onGameOver={this.finishRun}
            onExit={() => this.go('menu')}
            t={t}
          />
        )}
        <InstallPrompt active={screen === 'menu'} t={t} />
        {toast && <div className={css.toast}>{toast}</div>}
      </div>
    )
  }
}

export default App