import React from 'react';
import { withStore } from "./services/Store";
import {Switch, Route, Link} from "react-router-dom";
import { ListView, getParent } from "./util";
import Markdown from "./markdown/Markdown";

const TagDefIndex = ({store}) => (<ListView data={store.tagDefs} url="tags" name="Tags" hideSource/>);

const TagDef = ({store, match}) => {
    const data = store.tagDefs[match.params.id];
    const parent = getParent(store, data);
    if(!data) {
        return <h1>Unknown Identifier</h1>;
    }
    return (
        <article className="Tag Card">
            <header>{data.name}</header>
            <table>
                <tbody>
                { parent ? <tr><td className="label">Source:</td><td className="value"><Link to={`/${data.parentType}/${data.parentId}`}>{parent.name}</Link></td></tr> : null }
                { data.text ? <tr><td className="rulesText" colSpan="2"><Markdown>{data.text}</Markdown></td></tr> : null }
                </tbody>
            </table>
            <footer>
                <Link to="/tags">Back to Tags List</Link>
            </footer>
        </article>
    );
};

const ConnectedTagDefIndex = withStore(TagDefIndex);
const ConnectedTagDef = withStore(TagDef);

const TagDefs = () => (
    <Switch>
        <Route exact path="/tags" component={ConnectedTagDefIndex}/>
        <Route path="/tags/:id" component={ConnectedTagDef}/>
    </Switch>
);

export default TagDefs;
