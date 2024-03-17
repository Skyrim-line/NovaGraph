# Novagraph
A WebAssembly Project which uses C++ to deliver high-performance graph analytics.

## Build
TO compile, ensure the igraph library has been built and `build-wasm` includes the correct header files.
```bash
chmod +x build-wasm
./build-wasm
```

Steps to build igraph is located in `src/wasm`.

To run locally, first use `npm i` to install all node packages, then run the server using:
```bash
npm run dev
```


<!---
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
-->
