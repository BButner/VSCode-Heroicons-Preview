<p align="center">
<img src="img/icon.png" alt="VSCode Heroicons Logo">
</p>

<h1 align="center">VSCode Heroicons Preview</h1>
<h3 align="center">Previews for Heroicons right alongside their definition, inline in your code.</h3>

## 👋 Introduction

This project aims to recreate the [VSCode MaterialDesignIcons Intellisense](https://github.com/lukas-tr/vscode-materialdesignicons-intellisense) by [@lukas-tr](https://github.com/lukas-tr) for Heroicons. I personally use the aforementioned library when I'm working with Material Design Icons in my projects. I recently started using [Heroicons](https://heroicons.com/), and couldn't find a similar extension in existence. VSCode Heroicons Preview is not as feature-rich as MDI Intellisense, however there are more planned in the future!

## 🧠 How does it work?
The library will attempt to detect your `node_modules` folder and parse the data from the icons on an ad-hoc basis, then cache that data to lower the amount of disk reads during that session. This allows the extension to be independent of Heroicons updates, and prevent potential confusion.

For instance, lets say Heroicons v1.2 adds a "CuteCatIcon". If you open up a project with a Heroicons version below 1.2, that icon will not be rendered, but if you open up a 1.2 version it will be rendered as it is detected. Why would it render an icon that isn't in the version you're using?

### Inline Preview
![Inline Preview](/img/inline_preview.png)

### Typing Preview
![Typing Preview](/img/typing_preview.gif)

## 🎨 Features
- Inline Icon Previews
- Configure which files should render icons
- Solid/Outline detection, with default fallback
  - For instance, if you have `import { ChevronUpIcon } from '@heroicons/react/solid'` it will render the Solid variant, else it will render whatever the fallback style is. (Default: Outline)
- React and Vue library support
- Configuration options for per-project `node_modules` location in the event HIP cannot detect the `node_modules` directory location
- Configure Icon color
- Configure Icon size

## ⚙ Settings
- `hip.iconColor`: Color to render your Icons. Accepts anything that a \"fill\" attribute would accept in HTML.
- `hip.iconSize`: Size of the inline icon. Default is 1em.
- `hip.nodeModulesPath`: Specify a per-workspace node_modules path, relative to the top level directory. ex: `/project/frontend/node_modules`
- `hip.fileDecorationExtensions`: Array of file extensions to search for Icons to decorate. Example: `[".tsx", ".jsx"]`
- `hip.iconStyleFallback`: If HIP cannot detect a style from an import, it will fall back to this style. (Options are `solid` and `outline`)

###### ⚠ Please note this is in its early stages, and I expect there to be issues. If you come across any, please feel free to [open an issue on the GitHub repo](https://github.com/BButner/VSCode-Heroicons-Preview/issues).