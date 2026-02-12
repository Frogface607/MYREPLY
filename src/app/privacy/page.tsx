import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Политика конфиденциальности — MyReply',
  description: 'Политика конфиденциальности сервиса MyReply',
};

export default function PrivacyPage() {
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
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">MyReply</span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Политика конфиденциальности</h1>
        <p className="text-muted mb-8">Редакция от 7 февраля 2026 г.</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-foreground/90">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Общие положения</h2>
            <p className="leading-relaxed mb-2">
              Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок
              обработки и защиты персональных данных пользователей сервиса MyReply
              (далее — «Сервис»), расположенного по адресу{' '}
              <a href="https://myreply.vercel.app" className="text-primary hover:underline">
                myreply.vercel.app
              </a>.
            </p>
            <p className="leading-relaxed">
              Оператором персональных данных является ИП Орлов Сергей Артёмович (ИНН: 381019554275).
              Используя Сервис, вы даёте согласие на обработку данных в соответствии
              с настоящей Политикой.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Какие данные мы собираем</h2>

            <h3 className="font-medium mb-2">Данные, предоставленные пользователем:</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Адрес электронной почты (при регистрации)</li>
              <li>Имя и фото профиля (при входе через Google)</li>
              <li>Данные о бизнесе, указанные в профиле (название, сфера, описание)</li>
              <li>Тексты отзывов и загруженные скриншоты для генерации ответов</li>
            </ul>

            <h3 className="font-medium mb-2">Данные, собираемые автоматически:</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>IP-адрес и тип браузера</li>
              <li>Данные об использовании Сервиса (количество генераций, выбранные тарифы)</li>
              <li>Cookies и идентификаторы сессий</li>
              <li>Данные аналитики (Яндекс.Метрика) — обезличенная статистика поведения на сайте</li>
            </ul>

            <h3 className="font-medium mb-2">Платёжные данные:</h3>
            <p className="leading-relaxed">
              Мы <strong>не храним</strong> данные банковских карт. Все платежи обрабатываются
              через сертифицированную платёжную систему ЮKassa (ООО «ЮКасса»), соответствующую
              стандарту PCI DSS. Мы получаем только информацию о статусе платежа и идентификатор
              транзакции.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Цели обработки данных</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Предоставление доступа к функциональности Сервиса</li>
              <li>Генерация ответов на отзывы с учётом контекста бизнеса пользователя</li>
              <li>Обработка платежей и управление подписками</li>
              <li>Техническая поддержка и коммуникация с пользователями</li>
              <li>Улучшение качества Сервиса на основе обезличенной статистики</li>
              <li>Выполнение требований законодательства РФ</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Третьи стороны</h2>
            <p className="leading-relaxed mb-3">
              Мы можем передавать данные следующим сервисам исключительно для обеспечения
              работоспособности Сервиса:
            </p>
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              <div className="p-4">
                <p className="font-medium">Supabase (Supabase Inc., США)</p>
                <p className="text-sm text-muted">
                  Хранение данных аккаунтов, аутентификация. Данные хранятся в защищённой
                  облачной инфраструктуре с шифрованием.
                </p>
              </div>
              <div className="p-4">
                <p className="font-medium">OpenRouter (OpenRouter Inc., США)</p>
                <p className="text-sm text-muted">
                  Обработка запросов на генерацию ответов AI-моделями. Передаются тексты
                  отзывов и контекст бизнеса. Данные не используются для обучения моделей.
                </p>
              </div>
              <div className="p-4">
                <p className="font-medium">ЮKassa (ООО «ЮКасса», Россия)</p>
                <p className="text-sm text-muted">
                  Обработка платежей. Передаются email и сумма платежа. Сертифицирована PCI DSS.
                </p>
              </div>
              <div className="p-4">
                <p className="font-medium">Vercel (Vercel Inc., США)</p>
                <p className="text-sm text-muted">
                  Хостинг веб-приложения. Автоматически обрабатываются IP-адреса и заголовки запросов.
                </p>
              </div>
              <div className="p-4">
                <p className="font-medium">Яндекс.Метрика (ООО «Яндекс», Россия)</p>
                <p className="text-sm text-muted">
                  Веб-аналитика. Собирается обезличенная статистика посещений и поведения
                  на сайте с использованием cookies.
                </p>
              </div>
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
            <p className="leading-relaxed mb-2">
              Сервис использует cookies для:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Аутентификации</strong> — поддержание сессии авторизованного пользователя</li>
              <li><strong>Аналитики</strong> — сбор обезличенной статистики Яндекс.Метрикой</li>
            </ul>
            <p className="leading-relaxed mt-2">
              Вы можете отключить cookies в настройках браузера, однако это может повлиять
              на работоспособность Сервиса.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Срок хранения данных</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Данные аккаунта хранятся на протяжении всего срока использования Сервиса</li>
              <li>История генераций хранится до удаления пользователем или аккаунтом</li>
              <li>
                Загруженные скриншоты обрабатываются в оперативной памяти для распознавания
                текста и не сохраняются на сервере
              </li>
              <li>
                При удалении аккаунта все персональные данные удаляются в течение 30 дней,
                за исключением данных, хранение которых требуется по закону
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Права пользователя</h2>
            <p className="leading-relaxed mb-2">
              В соответствии с Федеральным законом №152-ФЗ «О персональных данных» вы имеете право:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Получить информацию об обрабатываемых персональных данных</li>
              <li>Потребовать уточнения, блокирования или уничтожения данных</li>
              <li>Отозвать согласие на обработку персональных данных</li>
              <li>Удалить свой аккаунт и все связанные данные</li>
            </ul>
            <p className="leading-relaxed mt-2">
              Для реализации этих прав обратитесь на{' '}
              <a href="mailto:hello@myreply.ru" className="text-primary hover:underline">
                hello@myreply.ru
              </a>.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Безопасность данных</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Все соединения защищены протоколом HTTPS (TLS 1.3)</li>
              <li>Пароли не хранятся — используется аутентификация через OAuth и Magic Link</li>
              <li>Доступ к базе данных ограничен политиками Row Level Security</li>
              <li>Платёжные данные обрабатываются исключительно ЮKassa (PCI DSS)</li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Изменение Политики</h2>
            <p className="leading-relaxed">
              Мы можем обновлять Политику конфиденциальности. Актуальная версия всегда
              доступна на данной странице. При существенных изменениях мы уведомим
              пользователей по электронной почте. Продолжение использования Сервиса
              после обновления означает согласие с изменённой Политикой.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Контакты</h2>
            <div className="bg-card border border-border rounded-xl p-6 space-y-2">
              <p><span className="text-muted">Оператор:</span> ИП Орлов Сергей Артёмович</p>
              <p><span className="text-muted">ИНН:</span> 381019554275</p>
              <p><span className="text-muted">Email:</span>{' '}
                <a href="mailto:hello@myreply.ru" className="text-primary hover:underline">
                  hello@myreply.ru
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Links */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Публичная оферта
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
