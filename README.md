# Ping Tracker

![Ping Tracker logo](https://raw.githubusercontent.com/matronator/PingTracker/main/.github/ping-tracker.png)

![npm version](https://img.shields.io/npm/v/ping-tracker)
![npm TypeScript version](https://img.shields.io/npm/dependency-version/ping-tracker/dev/typescript)
![Tree shaking](https://badgen.net/bundlephobia/tree-shaking/ping-tracker)
![Dependencies](https://badgen.net/bundlephobia/dependency-count/ping-tracker)
![Gzipped](https://badgen.net/bundlephobia/minzip/ping-tracker)
![Commits](https://badgen.net/github/commits/matronator/PingTracker)
![Issues](https://img.shields.io/github/issues/matronator/PingTracker.svg)
![License](https://img.shields.io/github/license/matronator/PingTracker.svg)
<a href="https://github.com/matronator">![Follow](https://img.shields.io/github/followers/matronator.svg?style=social&label=Follow&maxAge=2592000)</a>
<a href="https://github.com/sponsors/matronator/">![GitHub Sponsors](https://img.shields.io/github/sponsors/matronator)</a>

Ping Tracker is a tiny library that adds `ping` attribute to all `<a>` tags on the site with customizable list of URLs.

## Features

-   🏓 Add `ping` attribute to all `<a>` tags automatically
-   👀 Watch for changes using `MutationObserver` to modify newly added links
-   📝 Customize the content of the `ping` tag (list of URLs)
-   ⚡️ Tiny library (**2.5kB** minified, **1.1kB** gzipped)
-   📭 No dependencies
-   🌳 Tree-shakeable
-   🔥 Written in TypeScript

## Installation

```
npm i ping-tracker
```

## Usage

```js
import { PingTracker } from "ping-tracker";

const pt = new PingTracker("https://analytics.example.com");

// Or with options

const pt = new PingTracker("https://analytics.example.com", {
    hrefToQuery: false,
    onlyExternal: false,
    watchDOM: true,
    elementsToWatch: document.body,
});
```
