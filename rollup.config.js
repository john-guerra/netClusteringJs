import ascii from "rollup-plugin-ascii";
import node from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import * as meta from "./package.json";

const copyright = `// ${meta.homepage} v${
  meta.version
} Copyright ${new Date().getFullYear()} ${meta.author.name}`;


export default [
  {
    input: "src/netClustering.js",
    plugins: [
      node({
        jsxnext: true,
        main: true,
        browser: true,
      }),
      ascii(),
    ],
    external: [],
    output: {
      extend: true,
      banner: copyright,
      file: "dist/netClustering.js",
      format: "umd",
      indent: false,
      name: "netClustering",
      globals: {},
    },
  },
  {
    input: "src/netClustering.js",
    plugins: [
      node({
        jsxnext: true,
        main: true,
        browser: true,
      }),
      ascii(),
      terser({output: {preamble: copyright}})
    ],
    external: [],
    output: {
      extend: true,
      banner: copyright,
      file: "dist/netClustering.min.js",
      format: "umd",
      indent: false,
      name: "netClustering",
      globals: {},
    },
  },
  {
    input: "src/netClustering.js",
    plugins: [
      node({
        jsxnext: true,
      }),
      ascii(),
      commonjs(),
    ],
    external: [],
    output: {
      extend: true,
      banner: copyright,
      file: meta.module,
      format: "esm",
      indent: false,
      name: "netClustering",
      globals: {},
    },
  },
];
