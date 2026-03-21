import Link from 'next/link';
import { ArrowRight, Clock, Shield, Check, Search, Settings, MessageSquare, Chrome, Zap, Building2, Utensils, Hotel, Scissors, Stethoscope, Car, Copy, Star, TrendingUp, Brain, Eye, Palette, Scale } from 'lucide-react';
import { ExamplesSection } from '@/components/ExamplesSection';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Skip to main content - accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        Перейти к содержимому
      </a>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="MyReply - На главную"
          >
            <Logo className="h-7 sm:h-8 w-auto" />
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/challenge"
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors hidden sm:block"
            >
              Демо
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors hidden sm:block"
            >
              Тарифы
            </Link>
            <ThemeToggle />
            <Link
              href="/auth"
              className="text-sm font-medium px-4 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-white transition-all"
            >
              Войти
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" role="main">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16">
        {/* Background effects */}
        <div className="glow-orb w-[600px] h-[600px] bg-primary/30 -top-40 -right-40" />
        <div className="glow-orb w-[400px] h-[400px] bg-primary/20 bottom-20 -left-32" />
        <div className="absolute inset-0 bg-grid opacity-30" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-ответы на отзывы за 30 секунд</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.08] tracking-tight animate-fade-in">
            Негативный отзыв?
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Больше не проблема.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
            AI генерирует профессиональные ответы на отзывы — а вы спокойно
            занимаетесь бизнесом. 5 вариантов за секунды.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in mt-10">
            <Link
              href="/challenge"
              className="group px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all flex items-center gap-3 shadow-lg shadow-primary/25 btn-glow"
            >
              Попробовать бесплатно
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth"
              className="px-6 py-3 border border-border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-all"
            >
              Войти в кабинет
            </Link>
          </div>
          <p className="text-xs text-muted mt-5 tracking-wide">Без регистрации &middot; 5 вариантов ответа &middot; 30 секунд</p>
        </div>
      </section>

      {/* ─── PAIN POINTS ─── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-xs">
              Знакомо?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Один плохой отзыв — и день испорчен
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                quote: 'Опять негатив...',
                pain: 'Читаешь — и настроение на нуле. Весь день прокручиваешь в голове.',
              },
              {
                quote: 'Что ответить, чтобы не навредить?',
                pain: 'Страх написать лишнее. Каждое слово — как мина.',
              },
              {
                quote: 'Я вообще не виноват!',
                pain: 'Клиент не прав, но извиняться всё равно приходится.',
              },
              {
                quote: 'На это уходит вечность',
                pain: '20 минут на один ответ. А их десять. А ещё бизнес вести.',
              },
              {
                quote: 'Один отзыв — минус 10 клиентов',
                pain: 'Без ответа рейтинг падает. С плохим ответом — ещё хуже.',
              },
              {
                quote: 'Ненавижу это, но надо',
                pain: 'Отвечать на отзывы — не ваша работа. Но без этого никак.',
              },
            ].map((problem, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-danger/30 hover:bg-danger-light/30 transition-all duration-300 card-lift"
              >
                <p className="text-lg font-semibold mb-2">&laquo;{problem.quote}&raquo;</p>
                <p className="text-sm text-muted leading-relaxed">{problem.pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-primary font-medium mb-4 tracking-wide uppercase text-xs">
            Как это работает
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
            Три шага — и вы спокойны.
          </h2>
          <p className="text-muted text-lg mb-16 max-w-2xl leading-relaxed">
            AI берёт удар на себя. Вы получаете готовый профессиональный ответ
            и закрываете отзыв за секунды.
          </p>

          <div className="space-y-8">
            {[
              {
                num: '01',
                icon: Copy,
                title: 'Вставьте отзыв',
                desc: 'Скопируйте текст или загрузите скриншот. Работает с любой площадкой.',
              },
              {
                num: '02',
                icon: Shield,
                title: 'Расскажите свою правду',
                desc: 'Что произошло на самом деле? AI не будет извиняться, если вы не виноваты.',
              },
              {
                num: '03',
                icon: Check,
                title: 'Выберите ответ',
                desc: '5 вариантов — от сочувственного до твёрдого. Скопируйте и отправьте.',
              },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-sm font-mono text-muted step-number">{step.num}</span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SMART PROFILE ─── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-xs">
              Умный профиль
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              AI знает ваш бизнес.<br />Ответы звучат как ваши.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Deep Research найдёт ваш бизнес в интернете и создаст профиль.
              Каждый ответ учитывает вашу специфику.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: 'AI изучит ваш бизнес',
                desc: 'Укажите название и город — за секунды получите готовый профиль с описанием и сильными сторонами',
              },
              {
                icon: Settings,
                title: 'Настройте под себя',
                desc: 'Скорректируйте описание, добавьте правила — не извиняться, не давать скидки, что угодно',
              },
              {
                icon: Palette,
                title: 'Выберите тон',
                desc: 'Дружелюбный, деловой, экспертный — AI запомнит и будет отвечать именно в вашем стиле',
              },
            ].map((step, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border/50 bg-card/50 card-lift">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXAMPLES ─── */}
      <ExamplesSection />

      {/* ─── YOUR TRUTH ─── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-xs">
              Ваша правда
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Клиент не всегда прав.<br />AI это понимает.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Расскажите что произошло на самом деле — AI не будет извиняться
              за то, в чём вы не виноваты.
            </p>
          </div>

          {/* Interactive example */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
              {/* Review */}
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[1].map((s) => (
                      <Star key={s} className="w-4 h-4 text-warning fill-warning" />
                    ))}
                    {[2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-border" />
                    ))}
                  </div>
                  <span className="text-xs text-muted">Яндекс.Карты</span>
                </div>
                <p className="text-sm leading-relaxed">
                  &laquo;Худшее заведение в городе! Пришли отметить день рождения, ждали еду полтора часа.
                  Официант хамил и закатывал глаза. Половину заказа перепутали. Именинница расплакалась.
                  НЕ ХОДИТЕ СЮДА!&raquo;
                </p>
              </div>

              {/* Your truth */}
              <div className="p-6 border-b border-border/50 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Ваша правда</span>
                </div>
                <p className="text-sm text-muted leading-relaxed italic">
                  &laquo;Компания из 12 человек пришла без брони в пятницу вечером. Мы нашли стол за 10 минут.
                  Заказ на 12 персон готовили 40 минут — это нормально для горячего. Одна гостья
                  начала снимать персонал на телефон и оскорблять повара. Мы вежливо попросили прекратить.
                  Перепутали один гарнир — заменили бесплатно за 5 минут.&raquo;
                </p>
              </div>

              {/* AI response */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Ответ MyReply</span>
                </div>
                <p className="text-sm leading-relaxed">
                  &laquo;Здравствуйте! Спасибо за обратную связь, нам важно каждое мнение.
                  Хотим уточнить детали: ваша компания из 12 человек пришла без предварительного
                  бронирования в пятничный вечер — мы нашли столик за 10 минут. Время приготовления
                  горячих блюд на 12 персон составило около 40 минут, что является стандартным.
                  Единственная ошибка — перепутанный гарнир — была исправлена в течение 5 минут.
                  Мы дорожим каждым гостем и всегда готовы к диалогу. Будем рады видеть вас снова
                  — рекомендуем бронировать стол заранее для большой компании.&raquo;
                </p>
              </div>
            </div>
          </div>

          {/* Feature icons */}
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Не извиняется за то, в чём вы не виноваты',
                desc: 'AI не будет унижаться и просить прощения, если вы правы',
              },
              {
                icon: MessageSquare,
                title: 'Излагает вашу позицию',
                desc: 'Факты и контекст — корректно, без эмоций, но твёрдо',
              },
              {
                icon: Scale,
                title: 'Профессиональный тон',
                desc: 'Ответ защищает репутацию и не опускается до уровня конфликта',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ─── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card/50 border-y border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-xs">
              Кому подходит
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Любой бизнес, где есть отзывы клиентов
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Building2,
                title: 'Маркетплейсы',
                desc: 'WB, Ozon, Яндекс.Маркет — ответы на отзывы прямо из кабинета продавца',
              },
              {
                icon: Utensils,
                title: 'Рестораны и кафе',
                desc: 'Яндекс.Карты, 2GIS, Google — один плохой отзыв = минус десяток гостей',
              },
              {
                icon: Hotel,
                title: 'Отели и хостелы',
                desc: 'Booking, Островок, Google — каждый сезон волна негатива, а отвечать некогда',
              },
              {
                icon: Scissors,
                title: 'Услуги и салоны',
                desc: 'Яндекс, Профи, Авито — клиент недоволен, а ты не знаешь что сказать',
              },
              {
                icon: Stethoscope,
                title: 'Клиники и врачи',
                desc: 'ПроДокторов, Яндекс — деликатные ответы, где каждое слово важно',
              },
              {
                icon: Car,
                title: 'Авто и сервисы',
                desc: 'Яндекс, 2GIS, Drive2 — нужен грамотный ответ, не шаблон',
              },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 card-lift">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHROME EXTENSION ─── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card border border-border/50 rounded-3xl p-8 sm:p-12 overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />

            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Chrome className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">Скоро</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                  Chrome-расширение — отвечайте прямо на площадке
                </h2>
                <p className="text-muted mb-6 leading-relaxed">
                  Кнопка MyReply появится рядом с каждым отзывом на Яндекс.Картах,
                  2ГИС, Авито и маркетплейсах. Один клик — ответ готов.
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {['Яндекс.Карты', '2ГИС', 'Авито', 'Wildberries', 'Ozon'].map((mp) => (
                    <span key={mp} className="px-3 py-1.5 bg-primary/10 rounded-lg text-sm font-medium text-primary/80">{mp}</span>
                  ))}
                </div>
                <a
                  href="https://t.me/myreply_ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary font-medium rounded-xl hover:bg-primary/20 transition-colors text-sm"
                >
                  Хочу первым узнать о запуске
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="flex-shrink-0 w-48 h-48 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Chrome className="w-14 h-14 text-primary/60 mx-auto mb-3" />
                  <p className="text-sm font-medium text-primary/70">В разработке</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY MYREPLY ─── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card/50 border-y border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-xs">
              Почему MyReply
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Спокойствие. Репутация. Время.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Негатив — не стресс',
                desc: 'AI берёт удар на себя. Вы больше не пропускаете чужое недовольство через себя.',
              },
              {
                icon: Clock,
                title: 'Секунды, не минуты',
                desc: 'Ответ готов быстрее, чем вы успеете расстроиться.',
              },
              {
                icon: Brain,
                title: 'Звучит как вы',
                desc: 'Умный профиль бизнеса. Ответы персональные, не шаблонные.',
              },
              {
                icon: Eye,
                title: 'Скриншоты тоже',
                desc: 'Загрузите фото отзыва — AI распознает текст и ответит.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-xs">
              Тарифы
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Начните бесплатно. Подключите, когда будете готовы.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Базовые ответы — бесплатно навсегда. Персонализация — от 790 ₽/мес.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Free */}
            <div className="bg-card border border-border/60 rounded-2xl p-6 flex flex-col card-lift">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">Free</h3>
                <p className="text-sm text-muted">Попробовать и оценить</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">0 ₽</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  '5 ответов в месяц',
                  'Базовая генерация AI',
                  'Загрузка скриншотов',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className="w-full py-3 px-4 rounded-xl font-medium text-center border border-border hover:border-primary hover:text-primary transition-all"
              >
                Начать бесплатно
              </Link>
            </div>

            {/* Старт — popular */}
            <div className="relative bg-card border-2 border-primary rounded-2xl p-6 flex flex-col pricing-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                Популярный
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">Старт</h3>
                <p className="text-sm text-muted">Для селлеров и малого бизнеса</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">790 ₽</span>
                <span className="text-muted">/мес</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Безлимитные ответы',
                  'Умный профиль бизнеса',
                  'Deep Research — AI изучит вас',
                  'Настройка тона общения',
                  'Вся история ответов',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className="w-full py-3 px-4 rounded-xl font-semibold text-center bg-primary text-white hover:bg-primary-hover transition-all"
              >
                Начать сейчас
              </Link>
              <p className="text-xs text-center text-muted mt-2">7 дней полного доступа при регистрации</p>
            </div>

            {/* Про */}
            <div className="bg-card border border-border/60 rounded-2xl p-6 flex flex-col card-lift">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">Про</h3>
                <p className="text-sm text-muted">Для команд и сетей магазинов</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">1 990 ₽</span>
                <span className="text-muted">/мес</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Всё из тарифа Старт',
                  'До 5 профилей бизнеса',
                  'До 3 пользователей',
                  'Режим Хардкор',
                  'Экспорт истории (CSV)',
                  'Приоритетная поддержка',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className="w-full py-3 px-4 rounded-xl font-medium text-center border border-border hover:border-primary hover:text-primary transition-all"
              >
                Выбрать Про
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link href="/pricing" className="text-sm text-primary hover:underline">
              Подробное сравнение тарифов →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Star, text: 'Любая площадка с отзывами' },
              { icon: Eye, text: 'Загрузка скриншотов отзывов' },
              { icon: Brain, text: 'Умный профиль бизнеса' },
              { icon: Search, text: 'Deep Research — AI изучит вас' },
              { icon: TrendingUp, text: '5 режимов ответов' },
              { icon: Palette, text: 'Тёмная тема' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-card transition-colors">
                <feature.icon className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6">
        <div className="glow-orb w-[500px] h-[500px] bg-primary/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
            Следующий негативный отзыв —
            <br />
            <span className="text-primary">уже не ваша головная боль.</span>
          </h2>
          <p className="text-muted text-lg mb-10 leading-relaxed">
            Вставьте отзыв — получите 5 вариантов ответа. Без регистрации, без карты.
          </p>
          <Link
            href="/challenge"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 btn-glow"
          >
            Попробовать прямо сейчас
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 px-4 sm:px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo className="h-6 w-auto" />
            </Link>
            <nav className="flex flex-wrap items-center gap-6 text-sm text-muted">
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                Тарифы
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Публичная оферта
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Политика конфиденциальности
              </Link>
              <a href="https://t.me/myreply_ru" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Telegram
              </a>
              <a href="mailto:hello@myreply.ru" className="hover:text-foreground transition-colors">
                Контакты
              </a>
            </nav>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 text-xs text-muted">
            <p>&copy; 2026 MyReply. Сделано для тех, кто ценит время и репутацию.</p>
            <a href="https://t.me/myreply_ru" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              t.me/myreply_ru
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
