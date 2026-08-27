# Портфолио Бурнашева Равшана

Персональный сайт-портфолио: Next.js + TypeScript + Tailwind CSS + Three.js (React Three Fiber).
Сигнатурный момент — частицы кода собираются в светящуюся монограмму «РБ» внутри рамки чипа.

## Команды

```bash
npm run dev     # разработка → http://localhost:3000
npm run build   # прод-сборка
npm run start   # запуск прод-сборки
npm run lint    # ESLint
```

## Как добавить новый проект (без правок компонентов)

1. Открой `data/projects.json`.
2. Скопируй любой объект и заполни поля:

```jsonc
{
  "id": "my-new-site",            // уникальный slug
  "category": "site",             // "site" | "app" | "study"
  "placeholder": false,           // false = настоящая работа
  "title": "Название проекта",
  "description": "1–2 предложения о проекте.",
  "stack": ["Next.js", "Tailwind CSS"],
  "image": "/images/my-site.png", // скриншот в public/images или null
  "demoUrl": "https://...",       // "#" = кнопка будет неактивна
  "codeUrl": "https://github.com/...",
  "year": "2026"
}
```

3. `git push` → Vercel пересоберёт и опубликует сам.

## Как обновить ссылки и контент

| Что | Где |
| --- | --- |
| Telegram / Instagram / YouTube | `data/site.config.ts` → `socials[].url` (замени `"#"`) |
| Пометить канал «творческим» | `socials[].kind: "creative"` — плашка добавится сама |
| Почта | `data/site.config.ts` → `email` |
| Стек навыков в «Обо мне» | `data/site.config.ts` → `skills` |
| Фото-портрет | положи файл в `public/images/`, покажи его в `components/sections/about.tsx` (сейчас там монограмма-заглушка) |
| Тексты RU / UZ | `locales/ru.json`, `locales/uz.json` |

Все места, требующие твоих данных, помечены `TODO`.

## Форма обратной связи

Сейчас POST `/api/contact` пишет сообщение в лог сервера.
Для реальных писем подключи EmailJS или Resend в `app/api/contact/route.ts` (инструкция в комментарии внутри файла).

## Мультиязычность

RU / UZ переключатель в шапке, выбор запоминается в localStorage.
Тексты лежат в `locales/*.json` — компоненты их не хардкодят.

## Доступность и производительность

- `prefers-reduced-motion`: прелоадер пропускается, сборка частиц отключается, параллакс выключен;
- нет WebGL / слабое устройство: hero рисуется CSS-монограммой без канваса;
- 3D-бандл грузится лениво (`next/dynamic`, `ssr: false`) и не блокирует первую отрисовку;
- клавиатурная навигация, skip-link, aria-метки, alt-описание 3D-сцены.

## Деплой на Vercel

1. Запушь репозиторий на GitHub.
2. На [vercel.com](https://vercel.com) → New Project → импортируй репозиторий → Deploy.
3. После первого деплоя задай переменную `NEXT_PUBLIC_SITE_URL` (например, `https://burnashev.dev`)
   — она включает корректные sitemap, OG-картинки и JSON-LD.
4. Свой домен: Settings → Domains.

## Структура

```
app/                  # страницы, API, SEO (sitemap, robots, og-image)
components/
  three/              # 3D-сцена, монограмма, fallback
  sections/           # Hero, About, Projects, Media, Contact, Footer
data/                 # site.config.ts + projects.json ← контент здесь
locales/              # ru.json / uz.json
hooks/ lib/           # tilt, i18n, smooth scroll, детект возможностей
```
