import React from 'react';
import { withStore } from "./services/Store";
import {Switch, Route, Link} from "react-router-dom";
import { ListView, getDamageText, getRangeText, getTagText } from "./util";
import Markdown from "./markdown/Markdown";

const ActionIndex = ({store}) => (<ListView data={store.actions} url="actions" name="Actions"/>);

const Action = ({store, match}) => {
    const data = store.actions[match.params.id];
    const parent = store[data.parentType][data.parentId];
    if(!data) {
        return <h1>Unknown Identifier</h1>;
    }
    return (
        <article className="Action Card">
            <header>{data.name}</header>
            <table>
                <tbody>
                { data.flavor ? <tr><td className="flavorText" colSpan="2">{data.flavor}</td></tr> : null }
                <tr><td className="label">Source:</td><td className="value"><Link to={`/${data.parentType}/${data.parentId}`}>{parent.name}</Link></td></tr>
                <tr><td className="label">Type:</td><td className="value">{data.type}</td></tr>
                <tr><td className="label">Tags:</td><td className="value">{getTagText(data.tags)}</td></tr>
                { data.range ? <tr><td className="label">Range:</td><td className="value">{getRangeText(data.range, null)}</td></tr> : null}
                { data.damage ? <tr><td className="label">Damage:</td><td>{getDamageText(data.damage)}</td></tr> : null }
                { data.text ? <tr><td className="rulesText" colSpan="2"><Markdown>{data.text}</Markdown></td></tr> : null }
                </tbody>
            </table>
            <footer>
                <Link to="/actions">Back to Actions List</Link>
            </footer>
        </article>
    );
};

const ConnectedActionIndex = withStore(ActionIndex);
const ConnectedAction = withStore(Action);

const Actions = () => (
    <Switch>
        <Route exact path="/actions" component={ConnectedActionIndex}/>
        <Route path="/actions/:id" component={ConnectedAction}/>
    </Switch>
);

export default Actions;