import Link from 'next/link';
import { 
  Sparkles, 
  MessageSquareText, 
  Shield, 
  Zap, 
  Heart,
  ArrowRight,
  Check
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">MyReply</span>
          </div>
          <Link
            href="/auth"
            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            Войти
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-light text-primary rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-помощник для ответов на отзывы
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Отвечайте на отзывы<br />
            <span className="text-primary">без стресса</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8">
            MyReply анализирует отзыв и предлагает идеальные ответы. 
            Вы просто копируете готовый текст и идёте дальше заниматься бизнесом.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 text-lg"
            >
              Попробовать бесплатно
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <p className="text-sm text-muted mt-4">
            Без привязки карты • Бесплатный старт
          </p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Знакомые проблемы?
          </h2>
          <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
            Мы создали MyReply, потому что сами устали от этого
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '😰',
                title: '«Не знаю, что ответить»',
                desc: 'Страх написать лишнее, сомнения в формулировках',
              },
              {
                icon: '😤',
                title: '«Это отнимает нервы»',
                desc: 'Негатив портит настроение на весь день',
              },
              {
                icon: '🤔',
                title: '«Боюсь выглядеть виноватым»',
                desc: 'Лишние извинения, самоунижение',
              },
              {
                icon: '💸',
                title: '«Давать промокод или нет?»',
                desc: 'Непонятно, как правильно решать конфликты',
              },
              {
                icon: '⏰',
                title: '«Нет времени на это»',
                desc: 'Каждый ответ — это 10-15 минут',
              },
              {
                icon: '🔄',
                title: '«Одни и те же проблемы»',
                desc: 'Отзывы есть, но выводов нет',
              },
            ].map((pain, i) => (
              <div key={i} className="bg-background rounded-xl p-6 border border-border">
                <span className="text-3xl mb-4 block">{pain.icon}</span>
                <h3 className="font-semibold mb-2">{pain.title}</h3>
                <p className="text-muted text-sm">{pain.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Как работает MyReply
          </h2>
          <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
            3 простых шага — и вы спокойны
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: <MessageSquareText className="w-8 h-8" />,
                title: 'Вставьте отзыв',
                desc: 'Скопируйте текст отзыва с любой площадки и вставьте в MyReply',
              },
              {
                step: '2',
                icon: <Zap className="w-8 h-8" />,
                title: 'Получите 3 варианта',
                desc: 'AI анализирует отзыв и генерирует идеальные ответы в вашем стиле',
              },
              {
                step: '3',
                icon: <Check className="w-8 h-8" />,
                title: 'Скопируйте и готово',
                desc: 'Выберите лучший вариант, скопируйте и опубликуйте',
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                  {step.icon}
                </div>
                <div className="text-sm text-primary font-medium mb-2">Шаг {step.step}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Почему MyReply?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Защита репутации</h3>
                <p className="text-muted">
                  Ответы не признают вину там, где её нет. Держат баланс уважения и позиции бизнеса.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Ваш стиль</h3>
                <p className="text-muted">
                  Система запоминает ваш тон и правила. Ответы звучат как от вас, а не от робота.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-warning-light rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Мгновенно</h3>
                <p className="text-muted">
                  3 варианта ответа за секунды. Никаких шаблонов — каждый ответ уникален.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-muted-light rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquareText className="w-6 h-6 text-muted" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Любая площадка</h3>
                <p className="text-muted">
                  Яндекс, Google, 2ГИС, Ozon, Wildberries — работает везде, где есть отзывы.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Готовы отвечать без стресса?
          </h2>
          <p className="text-muted text-lg mb-8">
            Попробуйте MyReply прямо сейчас — это бесплатно
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all text-lg"
          >
            Начать бесплатно
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted text-sm">
          <p>© 2026 MyReply. Сделано с ❤️ для владельцев бизнеса.</p>
        </div>
      </footer>
    </div>
  );
}
