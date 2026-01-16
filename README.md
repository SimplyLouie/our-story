
# Simply Louie - Luxury Wedding Website

A sophisticated, responsive wedding invitation platform built with React, TypeScript, and Vite.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- **npm** (Included with Node.js)

## ⚙️ Installation

1.  **Install Dependencies**
    Open your terminal in the project folder and run:
    ```bash
    npm install
    ```

## 💻 Local Development

To start the development server:

1.  **Run the dev command**
    ```bash
    npm run dev
    ```
    *(Note: If you typed `nvm run dev`, use `npm` instead. `nvm` is for managing Node versions).*

2.  **View in Browser**
    Open the link shown in your terminal (usually `http://localhost:5173`).

## 🚀 GitHub Pages Deployment

To make the site "GitHub Ready":

1.  **Configure Base Path**
    Open `vite.config.ts` and set the `base` URL to match your repository name.
    
    ```typescript
    export default defineConfig({
      base: '/<YOUR-REPO-NAME>/', // e.g. '/simply-louie/'
      plugins: [react()],
      // ...
    })
    ```

2.  **Build the Project**
    ```bash
    npm run build
    ```

3.  **Deploy**
    Push the contents of the `dist` folder to a `gh-pages` branch on your repository.
    
    *Manual Command Line Deployment:*
    ```bash
    git add dist -f
    git commit -m "Deploy"
    git subtree push --prefix dist origin gh-pages
    ```
