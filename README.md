# Afrowave JS Tools

A lightweight, modular JavaScript utility library built for Afrowave and beyond.  
It aims to be simple enough for beginners, yet powerful and extensible for advanced use.

---

## 🧰 Modules Overview

### 📦 `src/api/apiCore.js`

#### ✅ `Result`
A simple class representing the result of an API call.

```js
new Result(success, data, error)
```

#### ✅ `apiRequest(options)`
Universal API wrapper for `fetch`.

```js
await apiRequest({ url, method, data?, headers?, token?, ... });
```

---

### 🚀 `src/api/apiHelpers.js`

Helper functions for common request types:  
`fetchData()`, `postDataWithParams()`, `updateDataWithParamsAndHeaders()` and more.

---

### 🌍 `src/i18n/localize.js`

#### `localize(text, language?)`
Translates a string using a lightweight API (LibreTranslate or custom).  
Defaults to `en` and falls back to browser cookies.

---

### ✅ `src/utils/validators.js`

Modular input validators for common needs:

- **General**: `isEmail`, `isURL`, `isPhoneNumber`, `isNotEmpty`, `isLengthValid`
- **Files**: `isFileType`, `isFileExtension`
- **Dates**: `isDate`, `isISODate`
- **Security**: `escapeHtml`, `isSafeString`, `hasSpecialCharacter`, `hasRepeatedCharacters`

---

### 🕓 `src/utils/dateUtils.js`

Date helpers with SQL-friendly formats:

```js
toSqlDate(date)                  // → 'YYYY-MM-DD'
toSqlDateTime(date)             // → 'YYYY-MM-DD HH:mm:ss'
fromIsoToLocale(iso, locale)    // → Localized format
parseFlexibleDate(input)        // → Auto-detects variants
```

---

### 🍪 `src/storage/cookies.js`

```js
setCookie(name, value, days?)
getCookie(name)
```

---

### 💾 `src/storage/localStorage.js`

```js
setObject(key, value)
getObject(key)
```

---

### 💡 `src/utils/helpers.js`

General helpers:

```js
debounce(fn, onError?, delay?)
```

---

### 🧱 `src/utils/dom.js`

Visual utility functions:

```js
logToHtml(message)
escapeHTML(text)
showLogInElement(message, elementId?, speed?)
typewriter(elementId, html, speed?)
```

---

### ✍️ `src/markdown/editor.js`

Fully-featured Markdown editor:

- **Modes**: `code`, `wysiwyg`, `split`
- **Toolbar**: Bold, Italic, Headings, Code, Horizontal rule
- **Features**:
  - Real-time HTML preview (streaming or static)
  - Synchronization between modes
  - Markdown ↔ HTML with full tag support
  - Editable WYSIWYG (with Markdown-safe output)
  - Configurable toolbar + themes (coming soon)
  - Local saving with `localStorage`
  - Toggle preview visibility

---

### 🔁 `src/markdown/converter.js`

Converts Markdown → HTML.  
Uses customizable mappings from JSON config with fallback support.

---

### ↩️ `src/markdown/htmlToMarkdown.js`

Converts HTML → Markdown.  
Supports:
- Headings
- Lists
- Blockquotes
- Inline/bold/italic/code
- Code blocks (with language)
- Horizontal rules
- Links, images

---

## 🧪 Testing Playground

Located at `/test/index.html`.  
Includes:

- Live preview
- Input/output testing
- Toggle preview visibility
- Split mode evaluation
- Markdown editor demo

---

## 📁 Project Structure

```
src/
├── api/
│   ├── api.js
│   ├── apiCore.js
│   └── apiHelpers.js
│
├── i18n/
│   └── localize.js
│
├── markdown/
│   ├── mappings/
│   │   ├── default.json
│   │   └── user.json
│   ├── styles/
│   │   ├── custom.css
│   │   └── editor.css
│   ├── config.js
│   ├── converter.js
│   ├── editor.js
│   ├── htmlToMarkdown.js
│   └── parser.js
│
├── storage/
│   ├── cookies.js
│   └── localStorage.js
│
├── translate/
│   └── [To Do – translation plugins]
│
├── test/
│   ├── index.html
│   ├── md-editor-demo.html      ← ✅ editor testing
│   ├── test.md                  ← ✅ MD file for testing
│   └── validators.html
│
├── utils/
│   ├── dateUtils.js
│   ├── dom.js
│   ├── helpers.js
│   └── validators.js
│
├── README.md
├── package.json
├── package-lock.json
└── .gitignore

```

---

## ⚙️ Future Ideas

- Configurable themes (light/dark/custom)
- Plugin support for editor (custom buttons, layouts)
- Upload/save Markdown files
- Integrate with Afrowave ID and AI tools
- Live AI-assisted translation
- Export to PDF/HTML from MD

---

## 📜 License

MIT – Use freely, contribute openly 💚  
Made with ☕ and JavaScript for the Afrowave ecosystem.
