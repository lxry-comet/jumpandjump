import { Component } from 'react'
import css from './InstallPrompt.module.css'

// Положи в src/components/InstallPrompt/InstallPrompt.jsx (+ .module.css рядом)

const SNOOZE_KEY = 'jj_install_snooze'
const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000 // после «Позже» не беспокоим 3 дня

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) // iPadOS

const isSnoozed = () => {
  try {
    const ts = Number(localStorage.getItem(SNOOZE_KEY) || 0)
    return Date.now() - ts < SNOOZE_MS
  } catch {
    return false
  }
}

export default class InstallPrompt extends Component {
  // mode: 'native' — Chrome/Edge/Android (есть системный диалог), 'ios' — Safari, только инструкция
  state = { ready: false, mode: null }

  deferred = null
  timer = null

  componentDidMount() {
    if (isStandalone()) return // уже установлено — ничего не показываем

    window.addEventListener('beforeinstallprompt', this.onBeforeInstall)
    window.addEventListener('appinstalled', this.onInstalled)

    if (isIOS()) {
      this.timer = setTimeout(() => this.setState({ ready: true, mode: 'ios' }), 1500)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
    window.removeEventListener('beforeinstallprompt', this.onBeforeInstall)
    window.removeEventListener('appinstalled', this.onInstalled)
  }

  onBeforeInstall = (e) => {
    e.preventDefault() // гасим мини-плашку браузера, показываем свою
    this.deferred = e
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.setState({ ready: true, mode: 'native' }), 1500)
  }

  onInstalled = () => {
    this.deferred = null
    this.setState({ ready: false })
  }

  install = async () => {
    if (!this.deferred) return
    this.deferred.prompt()
    await this.deferred.userChoice
    this.deferred = null // событие одноразовое
    this.setState({ ready: false })
  }

  later = () => {
    try {
      localStorage.setItem(SNOOZE_KEY, String(Date.now()))
    } catch { /* ignore */ }
    this.setState({ ready: false })
  }

  render() {
    const { active, t } = this.props
    const { ready, mode } = this.state
    if (!active || !ready || isSnoozed()) return null

    return (
      <div className={css.banner} role="dialog" aria-label={t('inst_title')}>
        <div className={css.icon}>📲</div>
        <div className={css.body}>
          <b>{t('inst_title')}</b>
          <span>{mode === 'ios' ? t('inst_ios') : t('inst_text')}</span>
          <div className={css.actions}>
            {mode === 'native' && <button className={css.btnMain} onClick={this.install}>{t('inst_btn')}</button>}
            <button className={css.btnGhost} onClick={this.later}>{mode === 'ios' ? t('inst_ok') : t('inst_later')}</button>
          </div>
        </div>
      </div>
    )
  }
}