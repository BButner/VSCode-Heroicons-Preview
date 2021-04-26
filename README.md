# VSCode Heroicons Preview

Previews for Heroicons right alongside their definition, inline in your code!

## 👋 Introduction

This project aims to recreate the [VSCode MaterialDesignIcons Intellisense](https://github.com/lukas-tr/vscode-materialdesignicons-intellisense) by [@lukas-tr](https://github.com/lukas-tr). I personally use the aforementioned library when I'm working with Material Design Icons in my projects. I recently started using Heroicons, and couldn't find a similar extension in existence. VSCode Heroicons Preview is not as feature-rich as MDI Intellisense, however there are more planned features in the future!

## 🧠 How does it work?
The library will attempt to detect your `node_modules` folder and parse the data from the icons on an ad-hoc basis, then cache that data to lower the amount of disk reads during that session. This allows the extension to be independent of Heroicons updates, and prevent potential confusion.

For instance, lets say Heroicons v1.2 adds a "CuteCatIcon". If you open up a project with a Heroicons version below 1.2, that icon will not be rendered, but if you open up a 1.2 version it will be rendered as it is detected. Why would it render an icon that isn't in the version you're using?

## 🎨 Features
- [x] Inline Icon Previews
- [ ] Configure which files should render icons
- [ ] Solid/Outline detection, with default fallback
  - For instance, if you have `import { ChevronUpIcon } from '@heroicons/react/solid'` it will render the Solid variant, else it will render whatever the fallback style is. (Default: Outline)
- [ ] React and Vue library support
= [ ] Configuration options for `node_modules` locations