import { StoryFn as StoryFunction, StoryContext } from "@storybook/addons";
import { useEffect, useGlobals } from "@storybook/addons";

export const withExportToCodeSandboxButton = (StoryFn: StoryFunction, context: StoryContext) => {

    if(context.viewMode === "docs") {
        useEffect(() => {
            displayToolState(`#anchor--${context.id} .docs-story`, context);
          });
        
          return StoryFn();
    }
};

const displayToolState = (selector: string, state: any) => {
  const rootElement = document.querySelector(selector);
  let exportButton;

  if (!exportButton) {
    exportButton = document.createElement("button");
    
    exportButton.style.setProperty("position", "absolute");
    exportButton.style.setProperty("bottom", "0");
    exportButton.style.setProperty("left", "0");
    exportButton.style.setProperty("border", "none");
    exportButton.style.setProperty("padding", "5px");
    exportButton.style.setProperty("background", "lightgreen");

    rootElement.appendChild(exportButton);
  }

  exportButton.innerText = `Export to CodeSandbox`;
  exportButton.addEventListener("click", () => doExport(state));
}

const doExport = (state: any) => {
    console.log(state)
}