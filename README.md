# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Environment Variables

This app can use Google Gemini for complaint analysis through LangChain. Keep your real API key in a local `.env` file and do not commit it to GitHub.

1. Copy [.env.example](.env.example) to `.env`
2. Replace `VITE_GOOGLE_API_KEY` with your own Google Gemini API key
3. Restart the dev server after changing the env file

If `VITE_GOOGLE_API_KEY` is missing, the app falls back to the built-in simulation mode.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
