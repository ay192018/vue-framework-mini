import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"

export default [
  {
    input: "packages/vue/src/index.ts",
    output: [
      // ~ 到处iife模式的包
      {
        sourcemap: true,
        file: "./packages/vue/dist/vue.js",
        format: "iife",
        name: "Vue",
      },
    ],
    plugin: [
      typescript({
        sourcemap: true,
      }),
      resolve(),
      commonjs(),
    ],
  },
]
