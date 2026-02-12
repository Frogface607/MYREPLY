import Link from 'next/link';
import { ArrowRight, Clock, Shield, Sparkles, Check, Search, Settings, MessageSquare, Chrome, Zap, Crown } from 'lucide-react';
import { ExamplesSection } from '@/components/ExamplesSection';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip to main content - accessibility */}
      <a 
        href="#main" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        Перейти к содержимому
      </a>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="MyReply - На главную"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-semibold text-lg tracking-tight">MyReply</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/challenge"
              className="text-sm font-medium text-danger hover:text-danger/80 transition-colors hidden sm:block"
            >
              🔥 Челлендж
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
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Войти
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main id="main" role="main">
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary font-medium mb-6 tracking-wide uppercase text-sm">
            Для любого бизнеса с отзывами
          </p>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
            Негативный отзыв?
            <br />
            <span className="text-muted">Больше не ваша проблема.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            AI генерирует профессиональные ответы на отзывы за секунды. 
            Вы спокойно занимаетесь бизнесом — а не нервничаете из-за чужого мнения.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['Маркетплейсы', 'Рестораны и кафе', 'Отели', 'Услуги', 'Клиники', 'Авто'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-muted-light text-muted text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth"
              className="group px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-all flex items-center gap-3"
            >
              Попробовать бесплатно
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-sm text-muted">15 ответов в месяц — навсегда бесплатно</span>
          </div>
        </div>
      </section>

      {/* Pain Points — emotional */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              Знакомо?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Один плохой отзыв — и день испорчен
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                quote: '«Опять негатив...»',
                pain: 'Читаешь — и настроение на нуле. Весь день прокручиваешь в голове.',
              },
              {
                quote: '«Что ответить, чтобы не навредить?»',
                pain: 'Страх написать лишнее. Каждое слово — как мина.',
              },
              {
                quote: '«Я вообще не виноват!»',
                pain: 'Клиент не прав, но извиняться всё равно приходится.',
              },
              {
                quote: '«На это уходит вечность»',
                pain: '20 минут на один ответ. А их десять. А ещё бизнес вести.',
              },
              {
                quote: '«Один отзыв — минус 10 клиентов»',
                pain: 'Без ответа рейтинг падает. С плохим ответом — ещё хуже.',
              },
              {
                quote: '«Ненавижу это, но надо»',
                pain: 'Отвечать на отзывы — не ваша работа. Но без этого никак.',
              },
            ].map((problem, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 transition-colors"
              >
                <p className="text-lg font-semibold mb-2">{problem.quote}</p>
                <p className="text-sm text-muted">{problem.pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
            Решение
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
            Три шага — и вы спокойны.
          </h2>
          <p className="text-muted text-lg mb-16 max-w-2xl">
            AI берёт удар на себя. Вы получаете готовый профессиональный ответ и закрываете отзыв за секунды.
          </p>
          
          <div className="space-y-12">
            {[
              {
                num: '01',
                title: 'Вставьте отзыв',
                desc: 'Скопируйте текст или загрузите скриншот. Работает с любой площадкой.',
              },
              {
                num: '02',
                title: 'Расскажите контекст',
                desc: 'Как было на самом деле? AI учтёт вашу позицию и не признает вину, если её нет.',
              },
              {
                num: '03',
                title: 'Выберите ответ',
                desc: '5 вариантов — от сочувственного до твёрдого. Скопируйте и отправьте.',
              },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-8">
                <span className="text-4xl font-bold text-border">{step.num}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Profile */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
            Умный профиль
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            AI знает ваш бизнес. Ответы звучат как ваши.
          </h2>
          <p className="text-muted text-lg mb-16 max-w-2xl">
            Deep Research найдёт ваш бизнес в интернете и создаст профиль. Каждый ответ будет учитывать вашу специфику, сильные стороны и стиль общения.
          </p>
          
          <div className="space-y-12">
            {[
              {
                num: '00',
                icon: Search,
                title: 'AI изучит ваш бизнес',
                desc: 'Укажите название и город — за секунды получите готовый профиль с описанием, специализацией и сильными сторонами',
              },
              {
                num: '01',
                icon: Settings,
                title: 'Настройте под себя',
                desc: 'Скорректируйте описание, добавьте правила (не извиняться, не давать скидки, звать перезвонить — что угодно)',
              },
              {
                num: '02',
                icon: MessageSquare,
                title: 'Выберите тон',
                desc: 'Дружелюбный, деловой, экспертный — AI запомнит и будет отвечать именно в вашем стиле',
              },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-border">{step.num}</span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <ExamplesSection />

      {/* Who it's for */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card border-y border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              Кому подходит
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Любой бизнес, где есть отзывы клиентов
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                emoji: '📦',
                title: 'Маркетплейсы',
                desc: 'WB, Ozon, Яндекс.Маркет — ответы на отзывы прямо из кабинета продавца',
              },
              {
                emoji: '🍽️',
                title: 'Рестораны и кафе',
                desc: 'Яндекс.Карты, 2GIS, Google — один плохой отзыв = минус десяток гостей',
              },
              {
                emoji: '🏨',
                title: 'Отели и хостелы',
                desc: 'Booking, Островок, Google — каждый сезон волна негатива, а отвечать некогда',
              },
              {
                emoji: '✂️',
                title: 'Услуги и салоны',
                desc: 'Яндекс, Профи, Авито — клиент недоволен, а ты не знаешь что сказать',
              },
              {
                emoji: '🏥',
                title: 'Клиники и врачи',
                desc: 'ПроДокторов, Яндекс — деликатные ответы, где каждое слово важно',
              },
              {
                emoji: '🚗',
                title: 'Авто и сервисы',
                desc: 'Яндекс, 2GIS, Drive2 — «сломалось через день» нужен грамотный ответ',
              },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chrome Extension */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
                    <Chrome className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">Chrome-расширение</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                  Отвечайте прямо в кабинете продавца
                </h2>
                <p className="text-muted mb-6 leading-relaxed">
                  Кнопка MyReply появится рядом с каждым отзывом в личном кабинете 
                  маркетплейса. Один клик — ответ готов. 
                  Не нужно переключаться между вкладками.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 bg-muted-light rounded-lg text-sm font-medium">Wildberries</span>
                  <span className="px-3 py-1.5 bg-muted-light rounded-lg text-sm font-medium">Ozon</span>
                  <span className="px-3 py-1.5 bg-muted-light rounded-lg text-sm font-medium">Яндекс.Маркет</span>
                </div>
              </div>
              <div className="flex-shrink-0 w-48 h-48 bg-primary-light rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Chrome className="w-16 h-16 text-primary mx-auto mb-3" />
                  <p className="text-sm font-medium text-primary">Скоро в Chrome Web Store</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits — emotional */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
            Почему MyReply
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-16 leading-tight">
            Спокойствие. Репутация. Время.
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-12">
            <div>
              <Shield className="w-8 h-8 text-primary mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Негатив — больше не стресс</h3>
              <p className="text-muted text-sm leading-relaxed">
                AI берёт удар на себя. Вы больше не пропускаете чужое недовольство через себя.
              </p>
            </div>
            <div>
              <Clock className="w-8 h-8 text-primary mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Секунды, не минуты</h3>
              <p className="text-muted text-sm leading-relaxed">
                Ответ готов быстрее, чем вы успеете расстроиться. Закрыли и забыли.
              </p>
            </div>
            <div>
              <Sparkles className="w-8 h-8 text-primary mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Звучит как вы</h3>
              <p className="text-muted text-sm leading-relaxed">
                Умный профиль бизнеса. Ответы не шаблонные, а персональные — с учётом вашей специфики.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              Тарифы
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Начните бесплатно. Подключите профиль, когда будете готовы.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Базовые ответы — бесплатно и навсегда. Персонализированные ответы с профилем бизнеса — от 490 ₽/мес.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Free */}
            <div className="bg-card border-2 border-border rounded-2xl p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">Free</h3>
                <p className="text-sm text-muted">Попробовать и оценить</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">0 ₽</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  '15 ответов в месяц',
                  '5 режимов ответов',
                  'Загрузка скриншотов',
                  'Базовая генерация',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className="w-full py-3 px-4 rounded-xl font-medium text-center bg-background border border-border hover:border-primary hover:text-primary transition-all"
              >
                Начать бесплатно
              </Link>
            </div>

            {/* Старт */}
            <div className="relative bg-card border-2 border-primary rounded-2xl p-6 flex flex-col shadow-lg shadow-primary/10 scale-[1.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                Популярный
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">Старт</h3>
                <p className="text-sm text-muted">Для селлеров и малого бизнеса</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">490 ₽</span>
                <span className="text-muted">/мес</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Безлимитные ответы',
                  'Умный профиль бизнеса',
                  'Deep Research — AI изучит вас',
                  'Настройка тона общения',
                  'Вся история ответов',
                  'Chrome-расширение',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className="w-full py-3 px-4 rounded-xl font-medium text-center bg-primary text-white hover:bg-primary-hover transition-all"
              >
                Начать сейчас
              </Link>
              <p className="text-xs text-center text-muted mt-2">7 дней полного доступа при регистрации</p>
            </div>

            {/* Про */}
            <div className="bg-card border-2 border-border rounded-2xl p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">Про</h3>
                <p className="text-sm text-muted">Для команд и сетей магазинов</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">1 490 ₽</span>
                <span className="text-muted">/мес</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Всё из тарифа Старт',
                  'До 5 профилей бизнеса',
                  'До 3 пользователей',
                  'Оплата по счёту для юрлиц',
                  'Приоритетная поддержка',
                  'Выделенный менеджер',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className="w-full py-3 px-4 rounded-xl font-medium text-center bg-background border border-border hover:border-primary hover:text-primary transition-all"
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

      {/* Features list */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              'Любая площадка с отзывами',
              'Загрузка скриншотов отзывов',
              'Умный профиль бизнеса',
              'Deep Research — AI изучит вас',
              '5 режимов ответов',
              'Тёмная тема',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — emotional */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
            Следующий негативный отзыв —
            <br />
            <span className="text-primary">уже не ваша головная боль.</span>
          </h2>
          <p className="text-muted text-lg mb-10">
            Начните бесплатно. 15 ответов в месяц — навсегда. Без карты.
          </p>
          <Link
            href="/auth"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-all"
          >
            Попробовать бесплатно
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary" />
              </div>
              <span className="font-medium">MyReply</span>
            </div>
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
              <a href="mailto:hello@myreply.ru" className="hover:text-foreground transition-colors">
                Контакты
              </a>
            </nav>
          </div>
          <div className="text-center sm:text-left text-xs text-muted">
            <p>© 2026 MyReply. Сделано для тех, кто ценит время и репутацию.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
