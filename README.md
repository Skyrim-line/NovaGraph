# Novagraph
A WebAssembly Project which uses C++ to deliver high-performance graph analytics.

This project is part of my UNSW Honours Thesis and the description can be found at [TMS](https://thesis.cse.unsw.edu.au/topic/767).

## Setup Environment 

### 1. git clone 

After you git cloned **Novagraph**, git clone three repositories: **igraph**, **rapidjson**,**pugixml**. 

First clone **pugixml** and **rapidjson**

#### pugximl

```shell
cd src/wasm
git clone https://github.com/zeux/pugixml.git
# Then set up build dir
cd pugixml
mkdir build
cd build
# Using Emscripten(emcmake + emmake):
emcmake cmake ..
emmake make
```

After finish this step you will get the result like this

![image-20250225230433665](/Users/skyrim/Library/Application Support/typora-user-images/image-20250225230433665.png)

#### rapidjson

```shell
cd src/wasm
git clone https://github.com/Tencent/rapidjson.git
```

#### igraph

NovaGraph uses the igraph C library for graph analytics and computations. To build, the igraph library needs to be built locally. The igraph library is not being tracked but can be built for WebAssembly with Emscripten and cmake installed:

```bash
cd src/wasm
git clone https://github.com/igraph/igraph.git
cd igraph
mkdir build
cd build
emcmake cmake ..
cmake --build . # or emmake make
```

One of the problems I ran into was the "TestEndianess" check. To fix this, I had to add the line `SET(CMAKE_16BIT_TYPE "unsigned short")` in the file "/usr/share/cmake-3.28/Modules/TestBigEndian.cmake".

Other problems may also pop up during the build which may require certain programs to be installed or small file modifications like the above to bypass. These will depend on what has been written in the library's `CMakeLists.txt` file.

#### Problems you might meet

if you run   npm run dev directly in src directory you will be warned that graph.js can not be found

```shell
npm run dev
```

so that you need to fix these problems before you run 

```shell
./build-wasm
```



##### Problem 1

![Problem1](/Users/skyrim/UNSW/2024-Summer-Project/Set-Up/Problem1.jpg)

This issue is related to Emscripten and igraph’s build configuration, specifically because the IEEE754 floating-point endianness test does not run correctly in the Emscripten environment. This is a known problem since igraph’s CMakeLists.txt assumes it is being executed in a local build environment rather than a cross-compilation environment.

**Detailed Steps to Resolve the Issue:**

**1. Modify ieee754_endianness.cmake File**

The problem originates from the test logic in etc/cmake/ieee754_endianness.cmake. Modify the file to skip the IEEE754 endianness check because Emscripten is always little-endian by default.

**2. Edit the File**

Open the ieee754_endianness.cmake file:

```shell
src/wasm/igraph/etc/cmake/ieee754_endianness.cmake
```

**3. Locate the Following Code (around line 38):**

```shell
message(FATAL_ERROR "IEEE754 double endianness test terminated abnormally.")
```

**4. Replace It with the Following Code to Force Little-Endian Mode:**

```shell
set(IEEE754_DOUBLE_BIG_ENDIAN FALSE)
set(IEEE754_DOUBLE_LITTLE_ENDIAN TRUE)
```

This modification ensures that the build process does not fail due to the IEEE754 endianness test when compiling with Emscripten.

**5. After finish all of steps below try to run build up commands again**

```shell
# assume you are at src/wasm/igraph dir
cd build
emcmake cmake ..
```

##### Problem 2

After you solved problem 1 Step5 you might meet problem like this

 ![Problem2](/Users/skyrim/UNSW/2024-Summer-Project/Set-Up/Problem2.jpg)

The issue occurs because the igraph configuration script detected an inconsistency between the endianness of floating-point (double) values and uint64_t. This is a known issue, especially when cross-compiling to WebAssembly (WASM), since WebAssembly inherently uses little-endian format.

**Solution**

Below are the steps to bypass this limitation:

**1. Modify ieee754_endianness.cmake File**

Open the file etc/cmake/ieee754_endianness.cmake:

```shell
src/wasm/igraph/etc/cmake/ieee754_endianness.cmake
```

Locate the following code (around line 54):

```shell
message(FATAL_ERROR "igraph only supports platforms where IEEE754 doubles have the same endianness as uint64_t.")
```

Comment out this line or replace it with logic to skip the check:

```shell
# message(FATAL_ERROR "igraph only supports platforms where IEEE754 doubles have the same endianness as uint64_t.")
set(IEEE754_DOUBLE_BIG_ENDIAN FALSE)
set(IEEE754_DOUBLE_LITTLE_ENDIAN TRUE)
```

**2. Force Little-Endian Mode**

Modify the CMakeLists.txt file:

```shell
nano src/wasm/igraph/CMakeLists.txt
```

Find the line that includes ieee754_endianness.cmake (around line 125):

```shell
include(etc/cmake/ieee754_endianness.cmake)
```

Before this line, add the following:

```shell
set(IEEE754_DOUBLE_BIG_ENDIAN FALSE)
set(IEEE754_DOUBLE_LITTLE_ENDIAN TRUE)
```

**3. Clean and Reconfigure the Build**

Remove the previous build directory:

```shell
cd src/wasm/igraph
rm -rf build
mkdir build && cd build
```

Re-run the CMake configuration:

```
emcmake cmake ..
```

**4. Build the Project**

If the configuration succeeds, proceed with building the project:

```
emmake make
```

This should allow igraph to compile successfully in the WebAssembly environment.

##### Problem 3

After you finished these steps and problems above if you run 

```shell
chmod +x build-wasm
./build-wasm
```

you might get the same result as mine:

![Problem3](/Users/skyrim/UNSW/2024-Summer-Project/Set-Up/Problem3.jpg)

Based on the error log, this is a **Node.js environment issue**, rather than a direct problem with the igraph build. Specifically, the arithchk.js script is using require, but since your project’s package.json specifies "type": "module", Node.js interprets .js files as **ES Modules**, which do not support require.

**Solution to Fix the Issue**

**1. Modify package.json Configuration**

Change the type field from "module" to "commonjs" to allow Node.js to use require.

Open the package.json file:

```shell
nano /Users/skyrim/UNSW/2024-Summer-Project/NovaGraph/package.json
```

Locate the following line:

```shell
"type": "module"
```

Modify it to:

```shell
"type": "commonjs"
```

After making this change, save the file and try running your build process again.

### Final Step

TO compile, ensure the igraph library has been built and `build-wasm` includes the correct header files.
```bash
chmod +x build-wasm
./build-wasm
```

Steps to build igraph is located in `src/wasm`.

### Successful installed all modules

if you followed the steps above you should get the result like this and then you can successfully run the website in local

![problem6](/Users/skyrim/UNSW/2024-Summer-Project/Set-Up/problem6.jpg)

![sucessful](/Users/skyrim/UNSW/2024-Summer-Project/Set-Up/sucessful.jpg)

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
