import { StoryFn as StoryFunction, StoryContext, useEffect, StoryWrapper } from '@storybook/addons';
import { getParameters } from 'codesandbox-import-utils/lib/api/define';
import { indexTs, indexHtml } from './exportTemplates';

export const withCodeSandboxButton: StoryWrapper = (StoryFn: StoryFunction, context: StoryContext) => {
  if (context.viewMode === 'docs') {
    useEffect(() => {
      displayToolState(`#anchor--${context.id} .docs-story`, context);
    });
  }

  return StoryFn(context);
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
  let exportLink = document.createElement('a');
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
  exportLink.setAttribute('target', '_blank');

  // set to error state by default, overwritten later
  exportLink.style.setProperty('color', 'darkred');
  exportLink.innerText = `CodeSandbox Error: See console`;

  const rootElement = document.querySelector(selector);
  rootElement.appendChild(exportLink);

  const storyFile = context.parameters?.fullSource;

  if (!storyFile) {
    console.error(`Export to CodeSandbox: Couldn’t find source for story ${context.story}.`);
    return false;
  }

  if(storyFile.match(/[(import|export)] .* from ['"]\./g)) {
    console.error(`Export to CodeSandbox: Story "${context.story}" contains relative import or export. Please use package imports only.`);
    return false;
  }

  const dependencies = getDependencies(storyFile);

  const defaultFileToPreview = encodeURIComponent('/example.tsx');
  const codeSandboxParameters = getParameters({
    files: {
      'example.tsx': {
        isBinary: false,
        content: storyFile,
      },
      'index.html': {
        isBinary: false,
        content: indexHtml,
      },
      'index.ts': {
        isBinary: false,
        content: indexTs.replace('STORY_NAME', context.story.replaceAll(" ", "")),
      },
      'package.json': {
        isBinary: false,
        content: JSON.stringify({ dependencies: dependencies }),
      },
    },
  });

  exportLink.setAttribute(
    'href',
    `https://codesandbox.io/api/v1/sandboxes/define?parameters=${codeSandboxParameters}&query=file%3D${defaultFileToPreview}`,
  );
  exportLink.style.setProperty('color', '#333333');
  exportLink.innerText = `Open in CodeSandbox`;
};
