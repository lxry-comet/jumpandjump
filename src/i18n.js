// Положи файл в src/i18n.js (или рядом с App — тогда поправь импорты)
// Чтобы добавить язык: скопируй блок, переведи значения, добавь в LANGS.

export const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'pl', label: 'PL' },
  { code: 'uk', label: 'UA' },
  { code: 'ru', label: 'RU' },
]

const dict = {
  ru: {
    play: '▶ ИГРАТЬ', shop: '🛒 Магазин', quests: '🎯 Задания', back: '← Назад',
    skins: '🎨 Скины', upgrades: '⚡ Улучшения', shopTitle: 'Магазин',
    daily: 'Задания дня', ach: 'Достижения', guide: 'Справочник',
    selected: 'Выбран', owned: 'Куплен', buy: 'Купить', choose: 'Выбрать',
    done: '✔ Выполнено', got: '✔ Получено', reward: 'награда', unit: 'м', lang: 'Язык',

    skin_default: 'Классика', skin_gold: 'Золотой', skin_purple: 'Фиолетовый',

    up_magnet: 'Магнит', up_rocket: 'Ракета', up_shield: 'Стартовый щит',
    up_magnet_d: 'Длительность: {n} с', up_rocket_d: 'Длительность: {n} с',
    up_shield_on: 'Каждый забег начинается со щитом', up_shield_off: 'Начинай забег со щитом',

    m_height: 'Поднимись на {n} м за одну игру', m_coins: 'Собери {n} монет',
    m_stomps: 'Победи {n} монстров прыжком', m_springs: 'Используй пружины {n} раз',
    m_crumbles: 'Рассыпь {n} хрупких платформ', m_rockets: 'Взлети на ракете: {n} раз',
    m_magnets: 'Подбери магнитов: {n}', m_gems: 'Найди кристаллов: {n}',
    m_games: 'Сыграй игр: {n}', m_jumps: 'Прыгни {n} раз',

    d_height: 'Высота {n} м', d_coinsTotal: 'Собери {n} монет всего', d_runCoins: '{n} монет за один забег',
    d_stomps: 'Победи монстров: {n}', d_rockets: 'Используй ракету {n} раз', d_magnets: 'Подбери магнитов: {n}',
    d_springs: 'Используй пружины {n} раз', d_crumbles: 'Рассыпь платформ: {n}', d_gems: 'Найди кристаллов: {n}',
    d_shields: 'Подбери щитов: {n}', d_supers: 'Супер-прыжков: {n}', d_jumps: 'Сделай прыжков: {n}',
    d_games: 'Сыграй игр: {n}', d_skins: 'Купи все скины',

    a_first: 'Первый прыжок', a_h100: 'Разминка', a_h500: 'Альпинист', a_h1000: 'Покоритель вершин',
    a_h2500: 'Космонавт', a_c100: 'Копилка', a_c1000: 'Богач', a_c5000: 'Магнат', a_run50: 'Жадность',
    a_stomp10: 'Охотник', a_stomp50: 'Истребитель', a_rocket5: 'Пилот', a_magnet5: 'Притяжение',
    a_spring50: 'Пружинка', a_crumble100: 'Лёгкая поступь', a_gems25: 'Ювелир', a_shield10: 'Неуязвимый',
    a_super10: 'Супергерой', a_jumps1000: 'Кенгуру', a_games50: 'Залип', a_skins: 'Модник',

    leg_normal: 'Обычная платформа', leg_crumble: 'Рассыпается после прыжка', leg_moving: 'Движется влево-вправо ↔',
    leg_spring: 'Пружина — мощный прыжок', leg_cloud: 'Облако — исчезает сразу ☁️',
    it_coin: 'Монета (+1)', it_gem: 'Кристалл (+5)', it_rocket: 'Ракета — полёт вверх',
    it_magnet: 'Магнит — притягивает монеты', it_star: 'Супер-прыжок',
    it_shield: 'Щит — спасает от врага или падения', it_enemy: 'Монстр — прыгни сверху!',

    g_pause: 'Пауза', g_resume: '▶ Продолжить', g_menu: 'В меню', g_over: 'Игра окончена',
    g_newbest: '🎉 Новый рекорд!', g_coins: '🪙 Собрано монет:', g_stomps: '👾 Монстров побеждено:',
    g_again: '↻ Ещё раз', g_ach: 'Достижение «{title}»',
    fx_rocket: 'РАКЕТА!', fx_magnet: 'МАГНИТ!', fx_super: 'СУПЕР-ПРЫЖОК', fx_superhit: '⭐ СУПЕР!',
    fx_shield: 'ЩИТ', fx_saved: '🛡️ СПАСЕН',

    inst_title: 'Установи игру',
    inst_text: 'Для более удобной и качественной игры добавь приложение на главный экран — полный экран и работа без интернета.',
    inst_btn: 'Установить', inst_later: 'Позже', inst_ok: 'Понятно',
    inst_ios: 'Нажми «Поделиться» ⎙ и выбери «На экран Домой».',
  },

  en: {
    play: '▶ PLAY', shop: '🛒 Shop', quests: '🎯 Quests', back: '← Back',
    skins: '🎨 Skins', upgrades: '⚡ Upgrades', shopTitle: 'Shop',
    daily: 'Daily quests', ach: 'Achievements', guide: 'Guide',
    selected: 'Equipped', owned: 'Owned', buy: 'Buy', choose: 'Equip',
    done: '✔ Done', got: '✔ Unlocked', reward: 'reward', unit: 'm', lang: 'Language',

    skin_default: 'Classic', skin_gold: 'Golden', skin_purple: 'Purple',

    up_magnet: 'Magnet', up_rocket: 'Rocket', up_shield: 'Starting shield',
    up_magnet_d: 'Duration: {n} s', up_rocket_d: 'Duration: {n} s',
    up_shield_on: 'Every run starts with a shield', up_shield_off: 'Start every run with a shield',

    m_height: 'Climb {n} m in one run', m_coins: 'Collect {n} coins',
    m_stomps: 'Stomp {n} monsters', m_springs: 'Use springs {n} times',
    m_crumbles: 'Crumble {n} fragile platforms', m_rockets: 'Fly a rocket {n} times',
    m_magnets: 'Pick up {n} magnets', m_gems: 'Find {n} gems',
    m_games: 'Play {n} games', m_jumps: 'Jump {n} times',

    d_height: 'Height {n} m', d_coinsTotal: 'Collect {n} coins in total', d_runCoins: '{n} coins in one run',
    d_stomps: 'Defeat {n} monsters', d_rockets: 'Use a rocket {n} times', d_magnets: 'Pick up {n} magnets',
    d_springs: 'Use springs {n} times', d_crumbles: 'Crumble {n} platforms', d_gems: 'Find {n} gems',
    d_shields: 'Pick up {n} shields', d_supers: '{n} super jumps', d_jumps: 'Make {n} jumps',
    d_games: 'Play {n} games', d_skins: 'Buy all skins',

    a_first: 'First jump', a_h100: 'Warm-up', a_h500: 'Climber', a_h1000: 'Peak conqueror',
    a_h2500: 'Astronaut', a_c100: 'Piggy bank', a_c1000: 'Rich', a_c5000: 'Tycoon', a_run50: 'Greed',
    a_stomp10: 'Hunter', a_stomp50: 'Exterminator', a_rocket5: 'Pilot', a_magnet5: 'Attraction',
    a_spring50: 'Springy', a_crumble100: 'Light steps', a_gems25: 'Jeweler', a_shield10: 'Invincible',
    a_super10: 'Superhero', a_jumps1000: 'Kangaroo', a_games50: 'Hooked', a_skins: 'Fashionista',

    leg_normal: 'Normal platform', leg_crumble: 'Crumbles after landing', leg_moving: 'Moves left and right ↔',
    leg_spring: 'Spring — big jump', leg_cloud: 'Cloud — vanishes at once ☁️',
    it_coin: 'Coin (+1)', it_gem: 'Gem (+5)', it_rocket: 'Rocket — fly upward',
    it_magnet: 'Magnet — pulls coins', it_star: 'Super jump',
    it_shield: 'Shield — saves from a monster or a fall', it_enemy: 'Monster — jump on its head!',

    g_pause: 'Pause', g_resume: '▶ Resume', g_menu: 'Menu', g_over: 'Game over',
    g_newbest: '🎉 New record!', g_coins: '🪙 Coins collected:', g_stomps: '👾 Monsters defeated:',
    g_again: '↻ Again', g_ach: 'Achievement “{title}”',
    fx_rocket: 'ROCKET!', fx_magnet: 'MAGNET!', fx_super: 'SUPER JUMP', fx_superhit: '⭐ SUPER!',
    fx_shield: 'SHIELD', fx_saved: '🛡️ SAVED',

    inst_title: 'Install the game',
    inst_text: 'For smoother, better play add the app to your home screen — fullscreen and works offline.',
    inst_btn: 'Install', inst_later: 'Later', inst_ok: 'Got it',
    inst_ios: 'Tap the Share button ⎙ and choose “Add to Home Screen”.',
  },

  pl: {
    play: '▶ GRAJ', shop: '🛒 Sklep', quests: '🎯 Zadania', back: '← Wstecz',
    skins: '🎨 Skórki', upgrades: '⚡ Ulepszenia', shopTitle: 'Sklep',
    daily: 'Zadania dnia', ach: 'Osiągnięcia', guide: 'Poradnik',
    selected: 'Wybrana', owned: 'Kupiona', buy: 'Kup', choose: 'Wybierz',
    done: '✔ Ukończone', got: '✔ Zdobyte', reward: 'nagroda', unit: 'm', lang: 'Język',

    skin_default: 'Klasyczna', skin_gold: 'Złota', skin_purple: 'Fioletowa',

    up_magnet: 'Magnes', up_rocket: 'Rakieta', up_shield: 'Tarcza na start',
    up_magnet_d: 'Czas działania: {n} s', up_rocket_d: 'Czas działania: {n} s',
    up_shield_on: 'Każda gra zaczyna się z tarczą', up_shield_off: 'Zaczynaj grę z tarczą',

    m_height: 'Wejdź na {n} m w jednej grze', m_coins: 'Zbierz monet: {n}',
    m_stomps: 'Pokonaj potworów skokiem: {n}', m_springs: 'Skocz na sprężynach: {n} razy',
    m_crumbles: 'Rozsyp kruchych platform: {n}', m_rockets: 'Użyj rakiety: {n} razy',
    m_magnets: 'Zbierz magnesów: {n}', m_gems: 'Znajdź kryształów: {n}',
    m_games: 'Zagraj gier: {n}', m_jumps: 'Wykonaj skoków: {n}',

    d_height: 'Wysokość {n} m', d_coinsTotal: 'Zbierz łącznie monet: {n}', d_runCoins: 'Monet w jednej grze: {n}',
    d_stomps: 'Pokonaj potworów: {n}', d_rockets: 'Użyj rakiety: {n} razy', d_magnets: 'Zbierz magnesów: {n}',
    d_springs: 'Użyj sprężyn: {n} razy', d_crumbles: 'Rozsyp platform: {n}', d_gems: 'Znajdź kryształów: {n}',
    d_shields: 'Zbierz tarcz: {n}', d_supers: 'Super skoków: {n}', d_jumps: 'Wykonaj skoków: {n}',
    d_games: 'Zagraj gier: {n}', d_skins: 'Kup wszystkie skórki',

    a_first: 'Pierwszy skok', a_h100: 'Rozgrzewka', a_h500: 'Alpinista', a_h1000: 'Zdobywca szczytów',
    a_h2500: 'Kosmonauta', a_c100: 'Skarbonka', a_c1000: 'Bogacz', a_c5000: 'Magnat', a_run50: 'Chciwość',
    a_stomp10: 'Łowca', a_stomp50: 'Pogromca', a_rocket5: 'Pilot', a_magnet5: 'Przyciąganie',
    a_spring50: 'Sprężynka', a_crumble100: 'Lekki krok', a_gems25: 'Jubiler', a_shield10: 'Niezniszczalny',
    a_super10: 'Superbohater', a_jumps1000: 'Kangur', a_games50: 'Uzależniony', a_skins: 'Modniś',

    leg_normal: 'Zwykła platforma', leg_crumble: 'Rozsypuje się po skoku', leg_moving: 'Porusza się na boki ↔',
    leg_spring: 'Sprężyna — mocny skok', leg_cloud: 'Chmurka — znika od razu ☁️',
    it_coin: 'Moneta (+1)', it_gem: 'Kryształ (+5)', it_rocket: 'Rakieta — lot w górę',
    it_magnet: 'Magnes — przyciąga monety', it_star: 'Super skok',
    it_shield: 'Tarcza — chroni przed potworem lub upadkiem', it_enemy: 'Potwór — skocz na niego z góry!',

    g_pause: 'Pauza', g_resume: '▶ Wznów', g_menu: 'Do menu', g_over: 'Koniec gry',
    g_newbest: '🎉 Nowy rekord!', g_coins: '🪙 Zebrane monety:', g_stomps: '👾 Pokonane potwory:',
    g_again: '↻ Jeszcze raz', g_ach: 'Osiągnięcie „{title}”',
    fx_rocket: 'RAKIETA!', fx_magnet: 'MAGNES!', fx_super: 'SUPER SKOK', fx_superhit: '⭐ SUPER!',
    fx_shield: 'TARCZA', fx_saved: '🛡️ URATOWANY',

    inst_title: 'Zainstaluj grę',
    inst_text: 'Dla wygodniejszej i płynniejszej gry dodaj aplikację do ekranu głównego — pełny ekran i działanie offline.',
    inst_btn: 'Zainstaluj', inst_later: 'Później', inst_ok: 'Rozumiem',
    inst_ios: 'Stuknij „Udostępnij” ⎙ i wybierz „Do ekranu początkowego”.',
  },

  uk: {
    play: '▶ ГРАТИ', shop: '🛒 Магазин', quests: '🎯 Завдання', back: '← Назад',
    skins: '🎨 Скіни', upgrades: '⚡ Покращення', shopTitle: 'Магазин',
    daily: 'Завдання дня', ach: 'Досягнення', guide: 'Довідник',
    selected: 'Обрано', owned: 'Куплено', buy: 'Купити', choose: 'Обрати',
    done: '✔ Виконано', got: '✔ Отримано', reward: 'нагорода', unit: 'м', lang: 'Мова',

    skin_default: 'Класика', skin_gold: 'Золотий', skin_purple: 'Фіолетовий',

    up_magnet: 'Магніт', up_rocket: 'Ракета', up_shield: 'Стартовий щит',
    up_magnet_d: 'Тривалість: {n} с', up_rocket_d: 'Тривалість: {n} с',
    up_shield_on: 'Кожен забіг починається зі щитом', up_shield_off: 'Починай забіг зі щитом',

    m_height: 'Піднімись на {n} м за одну гру', m_coins: 'Збери монет: {n}',
    m_stomps: 'Переможи монстрів стрибком: {n}', m_springs: 'Використай пружини {n} разів',
    m_crumbles: 'Розсип крихких платформ: {n}', m_rockets: 'Злети на ракеті: {n} разів',
    m_magnets: 'Підбери магнітів: {n}', m_gems: 'Знайди кристалів: {n}',
    m_games: 'Зіграй ігор: {n}', m_jumps: 'Стрибни {n} разів',

    d_height: 'Висота {n} м', d_coinsTotal: 'Збери монет загалом: {n}', d_runCoins: 'Монет за один забіг: {n}',
    d_stomps: 'Переможи монстрів: {n}', d_rockets: 'Використай ракету {n} разів', d_magnets: 'Підбери магнітів: {n}',
    d_springs: 'Використай пружини {n} разів', d_crumbles: 'Розсип платформ: {n}', d_gems: 'Знайди кристалів: {n}',
    d_shields: 'Підбери щитів: {n}', d_supers: 'Супер-стрибків: {n}', d_jumps: 'Зроби стрибків: {n}',
    d_games: 'Зіграй ігор: {n}', d_skins: 'Купи всі скіни',

    a_first: 'Перший стрибок', a_h100: 'Розминка', a_h500: 'Альпініст', a_h1000: 'Підкорювач вершин',
    a_h2500: 'Космонавт', a_c100: 'Скарбничка', a_c1000: 'Багатій', a_c5000: 'Магнат', a_run50: 'Жадібність',
    a_stomp10: 'Мисливець', a_stomp50: 'Винищувач', a_rocket5: 'Пілот', a_magnet5: 'Тяжіння',
    a_spring50: 'Пружинка', a_crumble100: 'Легка хода', a_gems25: 'Ювелір', a_shield10: 'Невразливий',
    a_super10: 'Супергерой', a_jumps1000: 'Кенгуру', a_games50: 'Залип', a_skins: 'Модник',

    leg_normal: 'Звичайна платформа', leg_crumble: 'Розсипається після стрибка', leg_moving: 'Рухається вліво-вправо ↔',
    leg_spring: 'Пружина — потужний стрибок', leg_cloud: 'Хмарка — зникає одразу ☁️',
    it_coin: 'Монета (+1)', it_gem: 'Кристал (+5)', it_rocket: 'Ракета — політ угору',
    it_magnet: 'Магніт — притягує монети', it_star: 'Супер-стрибок',
    it_shield: 'Щит — рятує від монстра або падіння', it_enemy: 'Монстр — стрибни зверху!',

    g_pause: 'Пауза', g_resume: '▶ Продовжити', g_menu: 'У меню', g_over: 'Гру закінчено',
    g_newbest: '🎉 Новий рекорд!', g_coins: '🪙 Зібрано монет:', g_stomps: '👾 Монстрів переможено:',
    g_again: '↻ Ще раз', g_ach: 'Досягнення «{title}»',
    fx_rocket: 'РАКЕТА!', fx_magnet: 'МАГНІТ!', fx_super: 'СУПЕР-СТРИБОК', fx_superhit: '⭐ СУПЕР!',
    fx_shield: 'ЩИТ', fx_saved: '🛡️ ВРЯТОВАНО',

    inst_title: 'Встанови гру',
    inst_text: 'Для зручнішої та якіснішої гри додай застосунок на головний екран — повний екран і робота без інтернету.',
    inst_btn: 'Встановити', inst_later: 'Пізніше', inst_ok: 'Зрозуміло',
    inst_ios: 'Натисни «Поділитися» ⎙ і вибери «На початковий екран».',
  },
}

const STORAGE_KEY = 'jj_lang'

export const detectLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && dict[saved]) return saved
  } catch { /* ignore */ }
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase()
  return dict[nav] ? nav : 'en' // ua-локаль браузера = 'uk'
}

export const saveLang = (code) => {
  try { localStorage.setItem(STORAGE_KEY, code) } catch { /* ignore */ }
}

export const makeT = (lang) => (key, params = {}) => {
  const str = dict[lang]?.[key] ?? dict.en[key] ?? key
  return str.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? params[k] : `{${k}}`))
}