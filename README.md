# Export to CodeSandbox

This Storybook plugin adds "Open in CodeSandbox" button to each story displayed in Docs mode.

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
