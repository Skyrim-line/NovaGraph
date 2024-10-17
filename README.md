# Novagraph
A WebAssembly Project which uses C++ to deliver high-performance graph analytics.

This project is part of my UNSW Honours Thesis and the description can be found at [TMS](https://thesis.cse.unsw.edu.au/topic/767).

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

## Adding New Algorithms
Currently, adding another algorithm requires a lot of file modification. The steps are:
1. Create the function in C++
    - the algorithm should be in a file located at `src/wasm/algorithms`
    - takes in input passed from JavaScript
    - return a `val` object with necessary fields for rendering output
2. Add this function to `EMSCRIPTEN_BINDINGS` in `src/wasm/graph.cpp`
3. Add the algorithm enum to `src/algorithms.js`
4. Add the input button to `src/App.jsx`
    - the button should be of type `AlgorithmInput`
    - the button should fall in the relevant accordian (collapsible)
5. Add algorithm explanation (hover text)
    - `src/components/AlgorithmExplanation`
6. Create the algorithm output file in `src/components/algorithmOutputs/NewAlgorithm.jsx`
7. Add to `src/components/algorithmOutputs/AlgorithmOutput.jsx` in the `components` list

> Work is currently being done to make this easier with the new `algorithm-config.jsx` file. As of October 2024, this has been completed for Path Finding & Search algorithms. These steps will be updated once finished with all algorithms.

<!---
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
-->
