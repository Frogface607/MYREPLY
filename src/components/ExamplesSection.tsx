'use client';

import { useState } from 'react';
import { Star, Snowflake, Flame, MessageSquare, Heart, Wrench, Shield } from 'lucide-react';

const examples = [
  {
    id: 'negative',
    type: 'Неадекватный клиент',
    rating: 1,
    platform: 'Яндекс.Карты',
    review: 'Худшее заведение в городе! Пришли отметить день рождения, ждали еду полтора часа. Официант хамил и закатывал глаза. Половину заказа перепутали. Именинница расплакалась. НЕ ХОДИТЕ СЮДА!',
    truth: 'Компания из 12 человек пришла без брони в пятницу вечером. Нашли стол за 10 минут. Горячее на 12 персон готовили 40 минут — стандарт. Одна гостья начала снимать персонал и оскорблять повара. Перепутали один гарнир — заменили бесплатно за 5 минут.',
    responses: {
      neutral: 'Здравствуйте! Приносим извинения за долгое ожидание и перепутанный заказ. Это не соответствует нашим стандартам. Обязательно разберёмся в ситуации и примем меры. Будем рады видеть вас снова.',
      empathetic: 'Здравствуйте! Нам очень жаль, что день рождения был испорчен. Понимаем, как это обидно. Мы обязательно разберёмся с каждым пунктом и сделаем всё, чтобы такое не повторилось.',
      'solution-focused': 'Здравствуйте! Благодарим за обратную связь. Мы уже выясняем причины задержки, проведём работу с персоналом и пересмотрим процесс обслуживания больших компаний. Напишите нам — предложим компенсацию.',
      'passive-aggressive': 'Здравствуйте. Зафиксировали. Приготовление горячих блюд на большую компанию занимает 30-50 минут — это стандартное время. По остальным пунктам — нужны детали для объективной проверки.',
      hardcore: 'День рождения на 12 человек без брони в пятницу — это экстрим-спорт, а не поход в ресторан. Мы-то стол нашли за 10 минут, но чудеса на кухне требуют хотя бы 40 минут. Один гарнир перепутали — исправили за 5 минут. Но «худшее заведение в городе»? Серьёзно?',
    },
    responsesWithTruth: {
      neutral: 'Здравствуйте! Спасибо за обратную связь. Хотим уточнить: ваша компания из 12 человек пришла без бронирования в пятничный вечер — мы нашли столик за 10 минут. Горячее на 12 персон готовилось 40 минут, что является стандартным временем. Единственная ошибка — перепутанный гарнир — была исправлена за 5 минут.',
      empathetic: 'Здравствуйте! Понимаем, что хотелось идеального праздника. Уточним детали: мы приняли компанию из 12 гостей без брони в пятницу и нашли стол за 10 минут. Горячее на 12 персон — 40 минут, это норма для любого ресторана. Один гарнир перепутали — заменили бесплатно за 5 минут. Будем рады видеть вас снова — рекомендуем бронировать заранее.',
      'solution-focused': 'Здравствуйте! Хотим уточнить ситуацию: компания из 12 человек была принята без брони за 10 минут. Время приготовления горячего на 12 персон — 40 минут (стандарт). Перепутанный гарнир заменили за 5 минут. Для больших компаний рекомендуем бронь — это гарантирует быстрое обслуживание.',
      'passive-aggressive': 'Здравствуйте. Уточним факты: 12 гостей без бронирования в пятницу — стол за 10 минут. Горячее на 12 — 40 минут (норма). Одна ошибка в гарнире — исправлена за 5 минут. Съёмка и оскорбления персонала — это, к сожалению, тоже факт вечера.',
      hardcore: 'Итак, факты: 12 человек без брони в пятницу — стол за 10 минут. 40 минут на горячее для 12 — это физика, не саботаж. Один гарнир перепутали — заменили за 5 минут. А вот снимать поваров на телефон и оскорблять — это уже не к нам претензия.',
    },
  },
  {
    id: 'manipulative',
    type: 'Шантаж отзывом',
    rating: 1,
    platform: 'Wildberries',
    review: 'Товар ПОЛНОЕ БАРАХЛО!!! Ставлю 1 звезду пока не вернёте деньги и не дадите скидку 50% на следующий заказ. Иначе напишу ещё 10 таких отзывов!!!',
    truth: 'Клиент получил товар, использовал 2 недели, потом потребовал полный возврат. Товар без дефектов. Клиент уже 3 раза делал так с другими продавцами — видно по истории.',
    responses: {
      neutral: 'Здравствуйте! Нам жаль, что товар вас не устроил. Мы готовы рассмотреть возврат согласно правилам площадки. Пожалуйста, оформите заявку через личный кабинет.',
      empathetic: 'Здравствуйте! Понимаем ваше разочарование. Нам искренне жаль, что покупка не оправдала ожиданий. Напишите нам — постараемся найти решение.',
      'solution-focused': 'Здравствуйте! Мы готовы помочь. Оформите возврат через личный кабинет WB — мы обработаем его в кратчайшие сроки. Если есть вопросы по товару — напишите нам.',
      'passive-aggressive': 'Здравствуйте. Все возвраты обрабатываются в рамках правил площадки. Угрозы негативными отзывами — не основание для компенсаций.',
      hardcore: 'Шантаж отзывами — это не «обратная связь», это давление. Возврат — по правилам WB. Скидка 50% за угрозы? Нет, спасибо, мы так не работаем.',
    },
    responsesWithTruth: {
      neutral: 'Здравствуйте! Спасибо за обращение. Наш товар прошёл контроль качества, дефектов при отправке не было. Возврат возможен в рамках правил Wildberries — оформите заявку через ЛК. Мы ценим каждого покупателя и работаем только в правовом поле.',
      empathetic: 'Здравствуйте! Понимаем, что иногда товар не оправдывает ожиданий. При этом хотим отметить: товар был отправлен без дефектов и прошёл проверку качества. Готовы рассмотреть возврат по правилам площадки — оформите заявку в ЛК.',
      'solution-focused': 'Здравствуйте! Товар отправлен без дефектов. Если он вам не подошёл — оформите возврат через ЛК Wildberries, мы обработаем по правилам площадки. Скидки за угрозы отзывами мы не предоставляем — работаем честно.',
      'passive-aggressive': 'Здравствуйте. Товар без дефектов, проверен перед отправкой. Возврат — по регламенту WB. Угрозы массовыми отзывами нарушают правила площадки и могут быть обжалованы.',
      hardcore: 'Товар без дефектов, вы его использовали 2 недели. «10 отзывов» — это нарушение правил WB, модерация это видит. Возврат — через ЛК по правилам. Скидка за шантаж? Мы работаем иначе.',
    },
  },
  {
    id: 'mixed',
    type: 'Враньё клиента',
    rating: 2,
    platform: '2ГИС',
    review: 'Записался на стрижку к мастеру Ане, она опоздала на 30 минут! Потом ещё и стрижку испортила — пришлось идти в другой салон переделывать. Никому не рекомендую!',
    truth: 'Клиент сам опоздал на 15 минут. Мастер Аня подождала и приняла. Стрижка выполнена по запросу клиента. Фото до/после есть. Клиент ушёл довольный и даже оставил чаевые. Отзыв появился после того, как отказали в бесплатной процедуре.',
    responses: {
      neutral: 'Здравствуйте! Нам жаль, что визит вас разочаровал. Мы передадим информацию мастеру и разберёмся в ситуации. Будем рады видеть вас снова.',
      empathetic: 'Здравствуйте! Понимаем, как обидно, когда результат не совпадает с ожиданиями. Извините за причинённые неудобства. Мы обязательно поговорим с мастером.',
      'solution-focused': 'Здравствуйте! Благодарим за отзыв. Мы проведём внутреннюю проверку и свяжемся с вами, чтобы обсудить ситуацию и предложить решение.',
      'passive-aggressive': 'Здравствуйте. Примем к сведению. Однако наши записи показывают другую картину. Готовы обсудить детали — обратитесь к администратору.',
      hardcore: 'Хм, интересная версия событий. А можно ещё раз, но ближе к реальности? Мастер Аня обычно получает только 5 звёзд. Что-то тут не сходится...',
    },
    responsesWithTruth: {
      neutral: 'Здравствуйте! Хотим уточнить: по нашим записям, вы опоздали на 15 минут, и мастер Аня вас всё равно приняла. Стрижка выполнена по вашему запросу — у нас есть фото до и после. Вы остались довольны результатом. Мы открыты к диалогу, но просим придерживаться фактов.',
      empathetic: 'Здравствуйте! Нам важна каждая обратная связь, но хотим уточнить ситуацию. По нашим данным, мастер Аня приняла вас, несмотря на опоздание с вашей стороны. Стрижка была сделана по вашему запросу, и есть фото результата. Будем рады обсудить, если что-то не устроило.',
      'solution-focused': 'Здравствуйте! Уточним факты: по записи вы опоздали на 15 минут — мастер приняла. Стрижка по вашему запросу, фото результата сохранены. Если есть конкретные претензии к работе — обратитесь к администратору, разберёмся.',
      'passive-aggressive': 'Здравствуйте. Наши камеры фиксируют время прихода — вы опоздали на 15 минут, не мастер. Стрижка выполнена по запросу, фото до/после имеются. Чаевые мастеру вы тоже оставили. Отзыв появился после отказа в бесплатной процедуре — совпадение?',
      hardcore: 'Давайте по фактам: опоздали вы, не мастер — у нас есть запись. Аня вас приняла, постригла как просили, и вы ушли довольный (с чаевыми, кстати). Отзыв появился после того, как мы отказали в бесплатной процедуре. Фото до/после — в наличии.',
    },
  },
];

const modes = [
  { id: 'neutral', label: 'Нейтральный', icon: MessageSquare, color: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' },
  { id: 'empathetic', label: 'Эмпатичный', icon: Heart, color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' },
  { id: 'solution-focused', label: 'С решением', icon: Wrench, color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' },
  { id: 'passive-aggressive', label: 'Твёрдый', icon: Snowflake, color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' },
  { id: 'hardcore', label: 'Дерзкий', icon: Flame, color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800' },
];

export function ExamplesSection() {
  const [activeExample, setActiveExample] = useState(0);
  const [activeMode, setActiveMode] = useState('neutral');
  const [withTruth, setWithTruth] = useState(false);

  const example = examples[activeExample];
  const currentMode = modes.find(m => m.id === activeMode)!;
  const responses = withTruth ? example.responsesWithTruth : example.responses;

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-card border-y border-border/50">
      <div className="max-w-5xl mx-auto">
        <p className="text-primary font-medium mb-4 tracking-wide uppercase text-xs">
          Примеры ответов
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
          Один отзыв — пять стратегий.
        </h2>
        <p className="text-muted text-lg mb-12 max-w-2xl">
          Выберите тон, который подходит ситуации. Расскажите свою правду — и AI защитит вашу репутацию.
        </p>

        {/* Example Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {examples.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => { setActiveExample(i); setWithTruth(false); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeExample === i
                  ? 'bg-primary text-white'
                  : 'bg-muted-light text-muted hover:bg-muted-light/80'
              }`}
            >
              {ex.type}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Review + Truth */}
          <div className="space-y-4">
            {/* Review Card */}
            <div className="bg-background border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= example.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted">{example.platform}</span>
              </div>
              <p className="text-foreground leading-relaxed">{example.review}</p>
            </div>

            {/* Truth toggle */}
            <button
              onClick={() => setWithTruth(!withTruth)}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                withTruth
                  ? 'border-primary bg-primary/10'
                  : 'border-primary/20 bg-primary/5 hover:bg-primary/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  withTruth ? 'bg-primary text-white' : 'bg-primary/10'
                }`}>
                  <Shield className={`w-5 h-5 ${withTruth ? 'text-white' : 'text-primary'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{withTruth ? 'Ваша правда учтена' : 'Расскажите свою правду'}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {withTruth ? 'AI защищает вашу позицию, не извиняется за то, в чём вы не виноваты' : 'Нажмите — и увидите, как изменится ответ'}
                  </p>
                </div>
              </div>
              {withTruth && (
                <p className="text-sm text-muted leading-relaxed mt-3 pl-12 italic">
                  &laquo;{example.truth}&raquo;
                </p>
              )}
            </button>
          </div>

          {/* Right: Response Card */}
          <div className="bg-background border border-border rounded-2xl p-6">
            {/* Mode Selector */}
            <div className="flex flex-wrap gap-2 mb-4">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    activeMode === mode.id
                      ? mode.color
                      : 'bg-card text-muted border-border hover:border-primary/30'
                  }`}
                >
                  <mode.icon className="w-3.5 h-3.5" />
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Response */}
            <div className={`p-4 rounded-xl ${currentMode.color} border transition-all`}>
              <p className="text-sm leading-relaxed">
                {responses[activeMode as keyof typeof responses]}
              </p>
            </div>

            {/* Truth indicator */}
            {withTruth && (
              <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                <Shield className="w-3.5 h-3.5" />
                <span>Ответ учитывает вашу версию событий</span>
              </div>
            )}

            {/* Hardcore Warning */}
            {activeMode === 'hardcore' && (
              <p className="mt-3 text-xs text-orange-600 flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Только для развлечения! Не публикуйте от имени бизнеса.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
