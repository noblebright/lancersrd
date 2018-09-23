import React from 'react';
import { withStore } from "./services/Store";
import {Switch, Route, Link} from "react-router-dom";
import { ListView, getParent } from "./util";
import Markdown from "./markdown/Markdown";

const StatusIndex = ({store}) => (<ListView data={store.statuses} url="statuses" name="Statuses" hideSource/>);

const Status = ({store, match}) => {
    const data = store.statuses[match.params.id];
    const parent = getParent(store, data);
    if(!data) {
        return <h1>Unknown Identifier</h1>;
    }
    return (
        <article className="Status Card">
            <header>{data.name}</header>
            <table>
                <tbody>
                { parent ? <tr><td className="label">Source:</td><td className="value"><Link to={`/${data.parentType}/${data.parentId}`}>{parent.name}</Link></td></tr> : null }
                { data.text ? <tr><td className="rulesText" colSpan="2"><Markdown>{data.text}</Markdown></td></tr> : null }
                </tbody>
            </table>
            <footer>
                <Link to="/statuses">Back to Statuses List</Link>
            </footer>
        </article>
    );
};

const ConnectedStatusIndex = withStore(StatusIndex);
const ConnectedStatus = withStore(Status);

const Statuss = () => (
    <Switch>
        <Route exact path="/statuses" component={ConnectedStatusIndex}/>
        <Route path="/statuses/:id" component={ConnectedStatus}/>
    </Switch>
);

export default Statuss;
