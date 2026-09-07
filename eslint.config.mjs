// ESLint 9 flat config. Next 16 usunął `next lint`, a stary .eslintrc.json
// nie jest już czytany — stąd ten plik i zmiana skryptu w package.json.
import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import ts from 'typescript-eslint';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      'scripts/**',
      // Katalog roboczy: HTML i pliki czekające na port do app/. Importują ze
      // swoich przyszłych lokalizacji, więc nie da się ich sprawdzać w miejscu.
      'design/**',
      // Jednorazowe skrypty deweloperskie, wszystkie w .gitignore.
      'add-components-import.js',
      'fix-code-blocks.js',
      'debug-*.js',
      'test-*.js',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    plugins: { '@next/next': next },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Skrypt strony głównej przeniesiony 1:1 z design/production/index.html.
    // Jego wartością jest to, że przeszedł QA wizualne — zamiana `var` na
    // `let` i domykanie pustego `catch` to przepisywanie przetestowanego kodu
    // dla kosmetyki. Wyjątek jest celowo zawężony do tego jednego pliku.
    files: ['app/audit-runtime.js'],
    languageOptions: {
      // Plik jest zwyklym .js, wiec nie obejmuje go wylaczenie no-undef dla TS.
      // Zamiast wylaczac regule, deklarujemy globale przegladarki, ktorych
      // ten skrypt faktycznie uzywa.
      globals: {
        document: 'readonly', window: 'readonly', navigator: 'readonly',
        location: 'readonly', console: 'readonly',
        setTimeout: 'readonly', clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly', fetch: 'readonly',
        URLSearchParams: 'readonly', AbortController: 'readonly',
      },
    },
    rules: { 'no-var': 'off', 'no-empty': 'off' },
  },
  {
    // `no-undef` nie ma sensu w TypeScripcie — kompilator sprawdza to lepiej
    // i bez fałszywych alarmów na `console`/`process`. Zalecenie samego
    // typescript-eslint. Bez tego flat config sypał 158 błędów widmo.
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: { 'no-undef': 'off' },
  },
];
