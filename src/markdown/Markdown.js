import MarkdownJSX from 'markdown-to-jsx';
import React from "react";

import * as renderers from "./LinkRenderers";

export const options = {
    overrides: { ...renderers }
};

const Markdown = ({children}) => (<MarkdownJSX options={options}>{children}</MarkdownJSX>);

export default Markdown;