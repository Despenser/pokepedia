# React + Vite
# Покедекс - веб-приложение с информацией о покемонах

## Описание

Это веб-приложение, разработанное с использованием React, предоставляющее информацию о покемонах из API PokeAPI. Приложение позволяет просматривать список покемонов, фильтровать их по типам, искать по имени или номеру, а также просматривать подробную информацию о каждом покемоне, включая цепочку эволюции.

## Технологии

- React
- Zustand (для управления состоянием)
- Axios (для HTTP запросов)
- React Router (для маршрутизации)
- PokeAPI (внешний API с данными о покемонах)

## Основные функции

### Главная страница
- Шапка сайта с поисковой строкой
- Фильтрация покемонов по типам
- Бесконечная прокрутка для подгрузки покемонов
- Карточки покемонов с градиентным фоном в зависимости от типа
- Анимации при взаимодействии с элементами интерфейса

### Страница детализации покемона
- Подробная информация о покемоне (характеристики, типы, способности)
- Древо эволюции покемона
- Список похожих покемонов

## Установка и запуск

1. Клонировать репозиторий
```
git clone https://github.com/your-username/pokedex.git
cd pokedex
```

2. Установить зависимости
```
npm install
```

3. Запустить в режиме разработки
```
npm run dev
```

4. Собрать проект для продакшена
```
npm run build
```

## Особенности реализации

- Кеширование данных для уменьшения количества запросов к API
- Адаптивный дизайн для мобильных устройств
- Скелетоны при загрузке для улучшения UX
- Обработка ошибок и соответствующие страницы
- Анимации и переходы для улучшения пользовательского опыта

## Структура проекта

- `/src/api` - Модули для работы с API
- `/src/components` - React компоненты
- `/src/pages` - Страницы приложения
- `/src/store` - Хранилище состояния (Zustand)
- `/src/styles` - CSS стили
- `/src/utils` - Вспомогательные функции

## Авторы

- Ваше Имя - Разработчик

## Лицензия

MIT
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
