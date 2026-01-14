import Link from 'next/link';
import { ArrowRight, Clock, Shield, Sparkles, Check, Search, Settings, MessageSquare, Star, Flame, Snowflake } from 'lucide-react';
import { ExamplesSection } from '@/components/ExamplesSection';

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
          <Link
            href="/quick-reply"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Войти
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main id="main" role="main">
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary font-medium mb-6 tracking-wide uppercase text-sm">
            Для бизнеса с отзывами
          </p>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
            Отзывы под контролем.
            <br />
            <span className="text-muted">Нервы в порядке.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
            Профессиональные ответы на отзывы за секунды. 
            Вы занимаетесь бизнесом — мы заботимся о репутации.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/quick-reply"
              className="group px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-all flex items-center gap-3"
            >
              Попробовать бесплатно
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-sm text-muted">Без регистрации</span>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              Знакомо?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Каждый отзыв — это стресс
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                quote: '«Не знаю, что ответить»',
                pain: 'Страх написать лишнее и сделать только хуже',
              },
              {
                quote: '«Боюсь выглядеть виноватым»',
                pain: 'Лишние извинения там, где ты не виноват',
              },
              {
                quote: '«Негатив портит весь день»',
                pain: 'Один злой отзыв — и настроение на нуле',
              },
              {
                quote: '«На это уходит вечность»',
                pain: '15 минут на ответ, который никто не оценит',
              },
              {
                quote: '«Давать скидку или нет?»',
                pain: 'Каждый раз заново решать одну и ту же дилемму',
              },
              {
                quote: '«Не хочу этим заниматься»',
                pain: 'Но приходится, потому что репутация важна',
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-16 leading-tight">
            Три шага — и вы спокойны.
          </h2>
          
          <div className="space-y-12">
            {[
              {
                num: '01',
                title: 'Вставьте отзыв',
                desc: 'Скопируйте текст или загрузите скриншот с любой площадки',
              },
              {
                num: '02',
                title: 'Расскажите контекст',
                desc: 'Как было на самом деле — AI учтёт вашу позицию',
              },
              {
                num: '03',
                title: 'Выберите ответ',
                desc: 'Три варианта — нейтральный, эмпатичный, с решением',
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
            Настройка один раз — идеальные ответы всегда.
          </h2>
          <p className="text-muted text-lg mb-16 max-w-2xl">
            Создайте умный профиль бизнеса, и AI будет учитывать ваши особенности при генерации ответов
          </p>
          
          <div className="space-y-12">
            {[
              {
                num: '00',
                icon: Search,
                title: 'Найдём ваш бизнес',
                desc: 'Укажите название и город — AI изучит информацию о вашем бизнесе, проанализирует специфику и предложит оптимальные настройки',
              },
              {
                num: '01',
                icon: Settings,
                title: 'Проверьте и дополните профиль',
                desc: 'Просмотрите найденную информацию, скорректируйте описание, добавьте сильные стороны и известные особенности вашего бизнеса',
              },
              {
                num: '02',
                icon: MessageSquare,
                title: 'Настройте тон общения',
                desc: 'Выберите стиль ответов: дружелюбный или официальный, с эмпатией или по делу, кратко или развёрнуто. AI запомнит ваш выбор',
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

      {/* Benefits */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
            Почему MyReply
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-16 leading-tight">
            Спокойствие и контроль.
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-12">
            <div>
              <Clock className="w-8 h-8 text-primary mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Секунды, не минуты</h3>
              <p className="text-muted text-sm leading-relaxed">
                Готовый ответ быстрее, чем вы успеете расстроиться
              </p>
            </div>
            <div>
              <Shield className="w-8 h-8 text-primary mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Репутация защищена</h3>
              <p className="text-muted text-sm leading-relaxed">
                Ответы не признают вину там, где её нет
              </p>
            </div>
            <div>
              <Sparkles className="w-8 h-8 text-primary mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Ваш стиль</h3>
              <p className="text-muted text-sm leading-relaxed">
                Настройте тон и правила — AI их соблюдает
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features list */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              'Работает с любой площадкой',
              'Загрузка скриншотов',
              'Профиль бизнеса',
              'История ответов',
              'Быстрая корректировка',
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

      {/* CTA */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
            Попробуйте сейчас.
          </h2>
          <p className="text-muted text-lg mb-10">
            Вставьте первый отзыв и убедитесь сами.
          </p>
          <Link
            href="/quick-reply"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-all"
          >
            Начать бесплатно
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <span>MyReply</span>
          </div>
          <p>© 2026. Сделано для тех, кто ценит время и репутацию.</p>
        </div>
      </footer>
    </div>
  );
}
