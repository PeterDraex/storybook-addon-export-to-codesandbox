# Export to CodeSandbox

This Storybook plugin adds "Open in CodeSandbox" button to each story displayed in Docs mode.

## Installation

1. Install the plugin `npm i storybook-addon-export-to-codesandbox`.
2. Register the plugin in `.storybook/main.js` - Add `'storybook-addon-export-to-codesandbox'` to the list of addons.
3. Add a parameter `exportToCodeSandbox` with property `getStoryFiles`. This property is expected to contain a function which returns an object, which maps any `X.stories.tsx` filename to the file content. Use the following snippet (from `preview.js`) for inspiration:
```js
export const parameters = {
  exportToCodeSandbox: {
    getStoryFiles: () => {
      const webpackContext = require.context('!!raw-loader!../packages/', true, /\.stories\.tsx$/);
      const storyFiles = {};

      webpackContext.keys().forEach(filename => {
        storyFiles['.' + filename] = webpackContext(filename).default;
      });

      return storyFiles;
    },
  },
};
```

## Assumptions

Your stories must follow these rules for this plugin to work:

- Every story has its own file, which:
  - Has `.stories.tsx` extension
  - Doesn’t have a default export
  - Contains imports only from publicly available packages and are compatible with the latest version
- All stories are exported from a `Component.stories.tsx` file which:
  - has a default export according to Storybook Component Story Format
  - doesn’t include any stories directly
  - re-exports individual story files in the following way: `export { Emphasis } from "./ButtonEmphasis.stories"`

  If your code doesn’t meet these assumptions, you will see an error instead of "Open in CodeSandbox" button.