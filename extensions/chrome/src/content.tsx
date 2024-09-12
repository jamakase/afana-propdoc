import { createRoot } from 'react-dom/client';
import App from "./App";
import React from "react";
import "./index.css";

import tailwindcssOutput from './index.css?inline';

const root = document.createElement('div');
root.id = 'propdoc-extension';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

/** Inject styles into shadow dom */
const globalStyleSheet = new CSSStyleSheet();
globalStyleSheet.replaceSync(tailwindcssOutput);
shadowRoot.adoptedStyleSheets = [globalStyleSheet];
/**
 * In the firefox environment, the adoptedStyleSheets bug may prevent style from being applied properly.
 *
 * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
 * @url https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/pull/174
 *
 * Please refer to the links above and try the following code if you encounter the issue.
 *

 * const styleElement = document.createElement('style');
 * styleElement.innerHTML = tailwindcssOutput;
 * shadowRoot.appendChild(styleElement);
 * ```
 */

shadowRoot.appendChild(rootIntoShadow);
createRoot(rootIntoShadow).render(<App />);


// const root = document.createElement("div");
// root.id = "crx-root";
// document.body.appendChild(root);

// createRoot(root).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );