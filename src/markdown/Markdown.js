import MarkdownJSX from 'markdown-to-jsx';
import React from "react";

import ActionRenderer from "./ActionRenderer";

const options = {
    overrides: {
        Action: ActionRenderer,
    }
};

const Markdown = ({children}) => (<MarkdownJSX options={options}>{children}</MarkdownJSX>);

export default Markdown;