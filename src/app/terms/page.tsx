import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Публичная оферта — MyReply',
  description: 'Условия использования сервиса MyReply',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">На главную</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/favicon.svg" alt="" className="w-5 h-5" />
            <span className="font-semibold">My<span className="text-primary">Reply</span></span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Публичная оферта</h1>
        <p className="text-muted mb-8">Редакция от 7 февраля 2026 г.</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-foreground/90">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Общие положения</h2>
            <p className="leading-relaxed mb-2">
              Настоящая публичная оферта (далее — «Оферта») является официальным предложением
              ИП Орлов Сергей Артёмович (ИНН: 381019554275, ОГРНИП: 314385006500046), именуемого в дальнейшем
              «Исполнитель», адресованным неограниченному кругу лиц (далее — «Пользователь»),
              заключить договор на условиях, изложенных ниже.
            </p>
            <p className="leading-relaxed mb-2">
              Акцептом Оферты является регистрация в сервисе MyReply и/или оплата подписки.
              С момента акцепта Оферта считается заключённым договором между Исполнителем и
              Пользователем.
            </p>
            <p className="leading-relaxed">
              Сервис MyReply (далее — «Сервис») — это онлайн-платформа для автоматизированной
              генерации профессиональных ответов на отзывы клиентов с использованием технологий
              искусственного интеллекта. Сервис доступен по адресу{' '}
              <a href="https://my-reply.ru" className="text-primary hover:underline">
                my-reply.ru
              </a>.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Предмет оферты</h2>
            <p className="leading-relaxed mb-2">
              Исполнитель предоставляет Пользователю доступ к функциональности Сервиса в соответствии
              с выбранным тарифным планом, а Пользователь обязуется оплачивать услуги в соответствии
              с условиями выбранного тарифа.
            </p>
            <p className="leading-relaxed">Функциональность Сервиса включает:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Генерация ответов на отзывы клиентов с помощью AI</li>
              <li>Анализ отзывов, включая распознавание текста со скриншотов</li>
              <li>Настройка профиля бизнеса и тона ответов</li>
              <li>Deep Research — автоматический анализ информации о бизнесе</li>
              <li>Хранение истории сгенерированных ответов</li>
              <li>Расширение для браузера Google Chrome</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Тарифные планы и стоимость</h2>
            <p className="leading-relaxed mb-3">
              Актуальные тарифные планы и цены размещены на странице{' '}
              <Link href="/pricing" className="text-primary hover:underline">
                Тарифы
              </Link>.
            </p>
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Free</span>
                <span>Бесплатно — 15 ответов/мес, базовая генерация</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Старт</span>
                <span>490 ₽/мес — безлимитные ответы, профиль бизнеса</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Про</span>
                <span>1 490 ₽/мес — до 5 профилей, до 3 пользователей</span>
              </div>
            </div>
            <p className="text-sm text-muted mt-2">
              Все цены указаны в российских рублях и включают НДС (при применимости).
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Порядок оплаты</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Оплата производится в рублях Российской Федерации через платёжную систему
                ЮKassa (ООО «ЮКасса», НКО).
              </li>
              <li>
                Подписка оформляется на ежемесячной основе. Списание происходит автоматически
                каждые 30 дней с момента оплаты.
              </li>
              <li>
                Доступные способы оплаты: банковские карты (Visa, MasterCard, МИР),
                электронные кошельки, СБП, и другие способы, доступные в интерфейсе ЮKassa.
              </li>
              <li>
                Доступ к оплаченному тарифу предоставляется немедленно после успешной оплаты.
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Пробный период</h2>
            <p className="leading-relaxed">
              При регистрации Пользователю предоставляется бесплатный пробный период сроком 7 дней
              с доступом к функциональности тарифного плана «Старт» (100 ответов). По истечении
              пробного периода Пользователь переводится на бесплатный тариф «Free» (10 ответов
              в месяц) до момента оформления платной подписки.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Возврат средств</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Пользователь вправе запросить полный возврат средств в течение 14 календарных дней
                с момента оплаты, обратившись на{' '}
                <a href="mailto:hello@myreply.ru" className="text-primary hover:underline">
                  hello@myreply.ru
                </a>.
              </li>
              <li>
                Возврат осуществляется тем же способом, которым была произведена оплата,
                в срок до 10 рабочих дней.
              </li>
              <li>
                Пользователь может отменить подписку в любой момент. При отмене доступ
                сохраняется до конца оплаченного периода.
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Права и обязанности сторон</h2>
            <h3 className="font-medium mb-2">Исполнитель обязуется:</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Обеспечивать работоспособность Сервиса (доступность не менее 99% времени)</li>
              <li>Обеспечивать конфиденциальность данных Пользователя</li>
              <li>Оказывать техническую поддержку</li>
              <li>Уведомлять об изменении условий и цен не менее чем за 30 дней</li>
            </ul>
            <h3 className="font-medium mb-2">Пользователь обязуется:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Предоставлять достоверные данные при регистрации</li>
              <li>Не передавать доступ к аккаунту третьим лицам (если иное не предусмотрено тарифом)</li>
              <li>Не использовать Сервис для генерации противоправного или вводящего в заблуждение контента</li>
              <li>Своевременно оплачивать выбранный тарифный план</li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Ограничение ответственности</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Сервис предоставляет сгенерированные ответы как рекомендации. Пользователь
                самостоятельно принимает решение о публикации ответа и несёт за это ответственность.
              </li>
              <li>
                Исполнитель не несёт ответственности за последствия публикации сгенерированных
                ответов, включая реакцию клиентов и изменение рейтингов.
              </li>
              <li>
                Исполнитель не гарантирует бесперебойную работу Сервиса и не несёт ответственности
                за временные перерывы, вызванные техническими причинами.
              </li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Интеллектуальная собственность</h2>
            <p className="leading-relaxed">
              Все права на Сервис, включая дизайн, код, алгоритмы и торговое обозначение «MyReply»,
              принадлежат Исполнителю. Пользователь получает неисключительную лицензию на
              использование Сервиса в рамках оплаченного тарифа. Сгенерированные ответы
              являются собственностью Пользователя.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Изменение условий</h2>
            <p className="leading-relaxed">
              Исполнитель вправе изменять условия настоящей Оферты, уведомив Пользователей
              не менее чем за 30 дней путём размещения обновлённой версии на данной странице
              и/или уведомления по электронной почте. Продолжение использования Сервиса
              после вступления изменений в силу означает согласие с обновлёнными условиями.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">11. Расторжение договора</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Пользователь вправе расторгнуть договор в любое время, отменив подписку
                в настройках аккаунта или обратившись в поддержку.
              </li>
              <li>
                Исполнитель вправе приостановить или прекратить доступ Пользователя в случае
                нарушения условий Оферты, в том числе при использовании Сервиса в противоправных целях.
              </li>
            </ul>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">12. Применимое право</h2>
            <p className="leading-relaxed">
              Настоящая Оферта регулируется законодательством Российской Федерации.
              Все споры разрешаются путём переговоров, а при недостижении согласия —
              в суде по месту нахождения Исполнителя.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">13. Реквизиты Исполнителя</h2>
            <div className="bg-card border border-border rounded-xl p-6 space-y-2">
              <p><span className="text-muted">Исполнитель:</span> ИП Орлов Сергей Артёмович</p>
              <p><span className="text-muted">ИНН:</span> 381019554275</p>
              <p><span className="text-muted">ОГРНИП:</span> 314385006500046</p>
              <p><span className="text-muted">Email:</span>{' '}
                <a href="mailto:hello@myreply.ru" className="text-primary hover:underline">
                  hello@myreply.ru
                </a>
              </p>
            </div>
            <p className="text-sm text-muted mt-4">
              Если у вас есть вопросы по условиям использования, напишите на{' '}
              <a href="mailto:hello@myreply.ru" className="text-primary hover:underline">
                hello@myreply.ru
              </a>.
            </p>
          </section>
        </div>

        {/* Links */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Политика конфиденциальности
          </Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Тарифы
          </Link>
          <Link href="/" className="hover:text-foreground transition-colors">
            На главную
          </Link>
        </div>
      </main>
    </div>
  );
}
