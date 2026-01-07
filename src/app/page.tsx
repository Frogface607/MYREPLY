import Link from 'next/link';
import { 
  Sparkles, 
  MessageSquareText, 
  Shield, 
  Zap, 
  ArrowRight,
  Check,
  Camera,
  Star,
  Building2,
  MessageCircle,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">MyReply</span>
          </div>
          <Link
            href="/quick-reply"
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            Попробовать
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-light text-success rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Ваша правда — достойный ответ
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Ответы на отзывы<br />
            <span className="text-primary">без стресса и унижений</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8">
            Расскажите как было на самом деле — AI превратит вашу правду в достойный ответ, 
            который защитит репутацию и не признает вину там, где её нет.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/quick-reply"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 text-base sm:text-lg"
            >
              Попробовать бесплатно
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <p className="text-sm text-muted mt-4">
            Без регистрации • 3 варианта ответа за секунды
          </p>
        </div>
      </section>

      {/* Key Feature - Your Truth */}
      <section className="py-16 bg-card">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-6 sm:p-10 border border-primary/20">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="text-4xl sm:text-5xl mb-4">💬</div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  «Расскажите, как было на самом деле»
                </h2>
                <p className="text-muted mb-6">
                  Клиент написал неправду? Вы знаете реальную ситуацию? 
                  Расскажите — AI учтёт вашу версию и сформулирует ответ, 
                  который защитит вас, а не оправдается.
                </p>
                <div className="space-y-3">
                  {[
                    'Ваша правда учитывается при генерации',
                    'AI не извиняется там, где вы не виноваты',
                    'Достоинство бизнеса сохраняется',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-80 bg-background rounded-2xl p-4 border border-border">
                <div className="text-xs text-muted mb-2 uppercase tracking-wide">Пример</div>
                <div className="text-sm mb-3 p-3 bg-danger-light/50 rounded-xl">
                  <strong>Отзыв:</strong> "Ждали час, еда холодная!"
                </div>
                <div className="text-sm mb-3 p-3 bg-primary-light/50 rounded-xl">
                  <strong>Ваша правда:</strong> "Гости пришли без брони в час пик, 
                  отказались от столика у окна, ждали конкретный стол 40 мин по своему желанию"
                </div>
                <div className="text-sm p-3 bg-success-light/50 rounded-xl">
                  <strong>Ответ AI:</strong> "Благодарим за визит! Действительно, 
                  в субботу вечером у нас высокая загрузка. Мы предлагали свободный столик, 
                  но вы предпочли дождаться конкретное место..."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Всё что нужно для работы с отзывами
          </h2>
          <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
            Не чат-бот, не шаблоны — умный инструмент
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: <Camera className="w-6 h-6" />,
                title: 'Скриншоты отзывов',
                desc: 'Вставьте скриншот — AI сам извлечёт текст и рейтинг',
                color: 'bg-primary-light text-primary',
              },
              {
                icon: <Building2 className="w-6 h-6" />,
                title: 'Профиль бизнеса',
                desc: 'Один раз настройте — AI запомнит ваш стиль и правила',
                color: 'bg-success-light text-success',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: '3 варианта ответа',
                desc: 'Нейтральный, эмпатичный и с решением — выбирайте',
                color: 'bg-warning-light text-warning',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Ваши правила',
                desc: 'Можно/нельзя извиняться, промокоды, компенсации',
                color: 'bg-danger-light text-danger',
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: 'Знает ваши сильные стороны',
                desc: 'Упомянет преимущества когда уместно',
                color: 'bg-primary-light text-primary',
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: 'Быстрая корректировка',
                desc: '«Короче», «Мягче», «Без извинений» — в один клик',
                color: 'bg-success-light text-success',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-card rounded-xl p-5 border border-border hover:border-primary/50 transition-colors">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Знакомо?
          </h2>
          <p className="text-muted text-center mb-12 max-w-xl mx-auto">
            MyReply создан для тех, кто устал
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { emoji: '😰', text: '«Не знаю что ответить»' },
              { emoji: '😤', text: '«Негатив портит настроение»' },
              { emoji: '🤔', text: '«Боюсь выглядеть виноватым»' },
              { emoji: '💸', text: '«Давать скидку или нет?»' },
              { emoji: '⏰', text: '«На каждый ответ 15 минут»' },
              { emoji: '😩', text: '«Не хочу этим заниматься»' },
            ].map((pain, i) => (
              <div key={i} className="bg-background rounded-xl p-4 border border-border text-center">
                <span className="text-2xl sm:text-3xl mb-2 block">{pain.emoji}</span>
                <p className="text-sm font-medium">{pain.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Как это работает
          </h2>

          <div className="space-y-6">
            {[
              { step: '1', title: 'Вставьте отзыв', desc: 'Текст или скриншот с любой площадки', icon: '📋' },
              { step: '2', title: 'Расскажите правду', desc: 'Как было на самом деле (опционально)', icon: '💬' },
              { step: '3', title: 'Выберите ответ', desc: '3 варианта — копируйте лучший', icon: '✨' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span>{step.icon}</span>
                    {step.title}
                  </h3>
                  <p className="text-muted text-sm">{step.desc}</p>
                </div>
                {i < 2 && <ChevronRight className="w-5 h-5 text-muted hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-card">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Простая цена
          </h2>
          <p className="text-muted mb-8">
            Для тех, кто ценит своё время и нервы
          </p>
          
          <div className="bg-background rounded-2xl p-6 sm:p-8 border-2 border-primary">
            <div className="text-4xl sm:text-5xl font-bold mb-2">
              2 990 ₽<span className="text-lg sm:text-xl text-muted font-normal">/мес</span>
            </div>
            <p className="text-muted mb-6">Безлимитные ответы</p>
            
            <div className="space-y-3 text-left mb-8">
              {[
                'Любое количество отзывов',
                'Все площадки',
                'Скриншоты и текст',
                'Профиль бизнеса',
                'История ответов',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <Link
              href="/quick-reply"
              className="block w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors"
            >
              Попробовать бесплатно
            </Link>
            <p className="text-xs text-muted mt-3">
              Сначала попробуйте — потом решите
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Хватит тратить нервы на отзывы
          </h2>
          <p className="text-muted text-lg mb-8">
            Вставьте первый отзыв прямо сейчас
          </p>
          <Link
            href="/quick-reply"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all text-base sm:text-lg"
          >
            Попробовать MyReply
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted text-sm">
          <p>© 2026 MyReply • Сделано для владельцев бизнеса 🇷🇺</p>
        </div>
      </footer>
    </div>
  );
}
