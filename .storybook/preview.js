import { withLing } from '../src/preset/manager.tsx'

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

export const decorators = [withLing];
