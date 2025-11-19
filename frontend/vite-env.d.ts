// This file is used for TypeScript type definitions for Vite's environment variables.
// By default, it includes types for `import.meta.env`.
// Since we are using `define` in vite.config.ts to expose environment variables
// on `process.env`, we need to declare the shape of `process.env` for TypeScript.

// Fix: To resolve the "Cannot redeclare block-scoped variable 'process'" error,
// we augment the existing `NodeJS` global namespace instead of declaring a new `process` variable.
// This merges our environment variable types with the existing `process.env` definition.
declare namespace NodeJS {
  interface ProcessEnv {
    VITE_API_URL: string;
    API_KEY: string;
  }
}
