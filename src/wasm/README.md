# Contains C++ files and libraries

## igraph
NovaGraph uses the igraph C library for graph analytics and computations. To build, the igraph library needs to be built locally. The igraph library is not being tracked but can be built for WebAssembly with Emscripten and cmake installed:

```bash
cd src/wasm
git clone https://github.com/igraph/igraph.git
mkdir igraph/build
cd igraph/build
emcmake cmake ..
cmake --build .
```