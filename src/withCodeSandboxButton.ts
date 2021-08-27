import { StoryFn as StoryFunction, StoryContext } from '@storybook/addons';
import { useEffect } from '@storybook/addons';
import { getParameters } from 'codesandbox/lib/api/define';
import indexTs from '!!raw-loader!../../src/exportTemplates/index.ts';
import indexHtml from '!!raw-loader!../../src/exportTemplates/index.html';

const storyFiles: { [key: string]: string } = {};

export const withCodeSandboxButton = (StoryFn: StoryFunction, context: StoryContext) => {
  var webpackContext = require.context('!!raw-loader!../../', true, /\.stories\.tsx$/);
  webpackContext.keys().forEach(filename => {
    storyFiles[filename] = webpackContext(filename).default;
  });

  if (context.viewMode === 'docs') {
    useEffect(() => {
      displayToolState(`#anchor--${context.id} .docs-story`, context);
    });

    return StoryFn();
  }
};

const getStoryFile = (storyName: string, allStoriesFileName: string) => {
  const allStoriesFile = storyFiles[allStoriesFileName];
  const exportRegex = new RegExp(`export { ${storyName} } from ['"](.*?)['"]`);
  let storyFileRelative = allStoriesFile.match(exportRegex)[1];

  if (!storyFileRelative.endsWith('.tsx') && !storyFileRelative.endsWith('.ts')) storyFileRelative += '.tsx';

  return resolveRelativePath(allStoriesFileName, storyFileRelative);
};

const resolveRelativePath = (base: string, relative: string) => {
  var stack = base.split('/'),
    parts = relative.split('/');
  stack.pop();

  for (var i = 0; i < parts.length; i++) {
    if (parts[i] == '.') continue;
    if (parts[i] == '..') stack.pop();
    else stack.push(parts[i]);
  }
  return stack.join('/');
};

const getDependencies = (fileContent: string) => {
  const matches = fileContent.matchAll(/import .* from ['"](.*?)['"];/g);
  const dependencies = new Set<string>();
  dependencies.add('react-scripts').add('react-dom');

  for (const match of matches) {
    if (!match[1].startsWith('react/')) dependencies.add(match[1]);
  }

  const dependenciesWithVersions: { [dependencyName: string]: string } = {};
  for (const dependency of dependencies) {
    dependenciesWithVersions[dependency] = 'latest';
  }

  return dependenciesWithVersions;
};

const displayToolState = (selector: string, context: any) => {
  const storyFile = getStoryFile(context.story, context.parameters.fileName);
  const dependencies = getDependencies(storyFiles[storyFile]);

  const defaultFileToPreview = encodeURIComponent('/example.tsx');
  const codeSandboxParameters = getParameters({
    files: {
      'example.tsx': {
        isBinary: false,
        content: storyFiles[storyFile],
      },
      'index.html': {
        isBinary: false,
        content: indexHtml,
      },
      'index.ts': {
        isBinary: false,
        content: indexTs.replace('STORY_NAME', context.story),
      },
      'package.json': {
        isBinary: false,
        content: JSON.stringify({ dependencies: dependencies }),
      },
    },
  });

  let exportLink = document.createElement('a');
  exportLink.innerText = `Open in CodeSandbox`;
  exportLink.setAttribute(
    'href',
    `https://codesandbox.io/api/v1/sandboxes/define?parameters=${codeSandboxParameters}&query=file%3D${defaultFileToPreview}`,
  );
  exportLink.setAttribute('target', '_blank');

  exportLink.style.setProperty('position', 'absolute');
  exportLink.style.setProperty('bottom', '0');
  exportLink.style.setProperty('right', '90px');
  exportLink.style.setProperty('border', '1px solid rgba(0,0,0,.1)');
  exportLink.style.setProperty('border-bottom', 'none');
  exportLink.style.setProperty('border-radius', '4px 4px 0 0');
  exportLink.style.setProperty('padding', '4px 10px');
  exportLink.style.setProperty('background', 'white');
  exportLink.style.setProperty(
    'font-family',
    '"Nunito Sans",-apple-system,".SFNSText-Regular","San Francisco",BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif',
  );
  exportLink.style.setProperty('font-weight', '700');
  exportLink.style.setProperty('font-size', '12px');
  exportLink.style.setProperty('text-decoration', 'none');
  exportLink.style.setProperty('line-height', '16px');
  exportLink.style.setProperty('color', '#333333');

  const rootElement = document.querySelector(selector);
  rootElement.appendChild(exportLink);
};
