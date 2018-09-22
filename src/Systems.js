import React from 'react';
import { withStore } from "./services/Store";
import {Switch, Route, Link} from "react-router-dom";
import { ListView, getLicense, getRangeText, getTagText } from "./util";
import Markdown from "./markdown/Markdown";

const SystemIndex = ({store}) => (<ListView data={store.systems} url="systems" name="Systems"/>);

const System = ({store, match}) => {
    const data = store.systems[match.params.id];
    if(!data) {
        return <h1>Unknown Identifier</h1>;
    }
    return (
        <article className="System Card">
            <header>{data.name}</header>
            <table>
                <tbody>
                { data.flavor ? <tr><td className="flavorText" colSpan="2">{data.flavor}</td></tr> : null }
                <tr><td className="label">License:</td><td className="value">{getLicense(data.license, data.source)}</td></tr>
                <tr><td className="label">Tags:</td><td className="value">{getTagText(data.tags)}</td></tr>
                { data.ranges ? <tr><td className="label">Range:</td><td className="value">{getRangeText(data.range, data.threat)}</td></tr> : null}
                { data.text ? <tr><td className="rulesText" colSpan="2"><Markdown>{data.text}</Markdown></td></tr> : null }
                </tbody>
            </table>
            <footer>
                <Link to="/systems">Back to Systems List</Link>
            </footer>
        </article>
    );
};

const ConnectedSystemIndex = withStore(SystemIndex);
const ConnectedSystem = withStore(System);

const Systems = () => (
    <Switch>
        <Route exact path="/systems" component={ConnectedSystemIndex}/>
        <Route path="/systems/:id" component={ConnectedSystem}/>
    </Switch>
);

export default Systems;