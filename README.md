# Export to CodeSandbox

This Storybook plugin adds "Open in CodeSandbox" button to each story displayed in Docs mode.

## Installation

This plugin expects a parameter called `exportToCodeSandbox` with property `storyFiles` which maps any `X.stories.tsx` filename to file content. If you are using Webpack, this can be configured by putting the following code to your `preview.js`:

```js
export const parameters = {
  exportToCodeSandbox: {
    getStoryFiles: () => {
      const webpackContext = require.context('!!raw-loader!../', true, /\.stories\.tsx$/);
      const storyFiles = {};

      webpackContext.keys().forEach(filename => {
        storyFiles[filename] = webpackContext(filename).default;
      });

      return storyFiles;
    },
  },
};
```

## Assumptions

Your stories must follow these rules for this plugin to work properly:

- Every story has its own file, which:
  - Has `.stories.tsx` extension
  - Doesn’t have a default export
  - Contains imports only from publicly available packages and are compatible with the latest version
- Every component has a `Component.stories.tsx` file which:
  - has a default export according to Storybook Component Story Format
  - doesn’t include any stories directly
  - re-exports individual story files in the following way: `export { Emphasis } from "./ButtonEmphasis.stories"`
- All story files are located within the folder where `node_modules` is located (TODO: verify)
