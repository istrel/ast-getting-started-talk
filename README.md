# Демки и ссылки про AST

### Ссылки

- [esprima](http://esprima.org/) - парсер JS в ESTree вместе с итератором по дереву. Советую посмотреть примеры в гайде
- [babel-eslint](https://github.com/babel/babel-eslint) - парсер JS с учетом самых новых фишек стандарта. К сожалению, там нет своего итератора
- [escope](https://github.com/estools/escope) - анализатор областей видимости
- [csstree](https://github.com/csstree/csstree) - парсер CSS вместе с итератором по дереву
- [estraverse](https://github.com/estools/estraverse) - отдельный инструмент (итератор по дереву), который умеет обходить дерево ESTree
- ["Парсеры - это спарта"](https://www.youtube.com/watch?v=au9_j2NjNaI) - замечательный доклад Алексея Охрименко о том, как написать парсер. В [ссылках](https://gist.github.com/aiboy/1e1d40cf9e077d1f8bab31074990b55c) к докладу много интересных инструментов.

### Демки

Каждая демка представляет собой отдельный проект со своим `package.json`.
Чтобы работали демки с AST, достаточно выполнить `npm install` в корне репозитория.

##### Удаление недостижимых файлов

Находит недостижимые JS-файлы

```
npm run demo1
```

Пример вывода:
```
$ npm run demo1

> ast-getting-started-talk@0.0.1 demo1 /Users/istrel/work/ast-getting-started-talk
> cd demo-1-unreachable-files && node scripts/main.js

Requires found in /Users/istrel/work/ast-getting-started-talk/demo-1-unreachable-files/src/index.js: react, react-dom, ./App, ./index.css
Requires found in /Users/istrel/work/ast-getting-started-talk/demo-1-unreachable-files/src/App.js: react, ./Header, ./App.css
Requires found in /Users/istrel/work/ast-getting-started-talk/demo-1-unreachable-files/src/Header.js: react, ./logo.svg

=======================================

Not required: /Users/istrel/work/ast-getting-started-talk/demo-1-unreachable-files/src/Footer.js
Not required: /Users/istrel/work/ast-getting-started-talk/demo-1-unreachable-files/src/FooterInner.js
Not required: /Users/istrel/work/ast-getting-started-talk/demo-1-unreachable-files/src/registerServiceWorker.js
```

##### Нахождение неиспользуемых CSS-классов

Находит неиспользуемые CSS-классы в проекте

```
npm run demo2
```

Демка выводит:
- используемые CSS-классы `globalUsedClasses`
- объявленные CSS-классы `globalDefinedClasses`
- список объявленных, но не используемых CSS-классов
```
$ npm run demo2

> ast-getting-started-talk@0.0.1 demo2 /Users/istrel/work/ast-getting-started-talk
> cd demo-2-unused-css && node scripts/main.js

globalUsedClasses:
 { '/Users/istrel/work/ast-getting-started-talk/demo-2-unused-css/src/App.css':
   { 'pseudo-used': true,
     App: true,
     'App-intro': true,
     'App-header': true,
     'App-logo': true,
     'App-title': true },
  '/Users/istrel/work/ast-getting-started-talk/demo-2-unused-css/src/index.css': {} }
globalDefinedClasses:
 { '/Users/istrel/work/ast-getting-started-talk/demo-2-unused-css/src/App.css':
   { 'pseudo-used': true,
     App: true,
     'App-intro': true,
     'App-header': true,
     'App-logo': true,
     'App-title': true },
  '/Users/istrel/work/ast-getting-started-talk/demo-2-unused-css/src/index.css': {} }
Not used .App-unused in src/App.css
Not used .unused-class in src/index.css
File src/not-required.css not used at all
```

##### Нахождение неиспользуемых CSS-классов - улучшенная версия

Находит неиспользуемые CSS-классы в проекте, анализируя область видимости переменных

```
npm run demo3
```

Демка выводит:
- используемые CSS-классы `globalUsedClasses`
- объявленные CSS-классы `globalDefinedClasses`
- список объявленных, но не используемых CSS-классов
```
$ npm run demo3

> ast-getting-started-talk@0.0.1 demo3 /Users/istrel/work/ast-getting-started-talk
> cd demo-3-unused-css-improved && node scripts/main.js

globalUsedClasses:
 { '/Users/istrel/work/ast-getting-started-talk/demo-3-unused-css-improved/src/App.css':
   { App: true,
     'App-intro': true,
     'App-header': true,
     'App-logo': true,
     'App-title': true },
  '/Users/istrel/work/ast-getting-started-talk/demo-3-unused-css-improved/src/index.css': {} }
globalDefinedClasses:
 { '/Users/istrel/work/ast-getting-started-talk/demo-3-unused-css-improved/src/App.css':
   { App: true,
     'App-intro': true,
     'App-header': true,
     'App-logo': true,
     'App-title': true },
  '/Users/istrel/work/ast-getting-started-talk/demo-3-unused-css-improved/src/index.css': {} }
Not used .App-unused in src/App.css
Not used .pseudo-used in src/App.css
Not used .unused-class in src/index.css
File src/not-required.css not used at all
```
