import React from 'react';
import { withStore } from "./services/Store";
import {Switch, Route, Link} from "react-router-dom";
import { ListView, getParent } from "./util";
import Markdown from "./markdown/Markdown";

const CoreBonusIndex = ({store}) => (<ListView data={store.coreBonuses} url="coreBonuses" name="Core Bonuses"/>);

const CoreBonus = ({store, match}) => {
    const data = store.coreBonuses[match.params.id];
    const parent = getParent(store, data);
    if(!data) {
        return <h1>Unknown Identifier</h1>;
    }
    return (
        <article className="CoreBonus Card">
            <header>{data.name}</header>
            <table>
                <tbody>
                { parent ? <tr><td className="label">Source:</td><td className="value"><Link to={`/${data.parentType}/${data.parentId}`}>{parent.name}</Link></td></tr> : null }
                { data.text ? <tr><td className="rulesText" colSpan="2"><Markdown>{data.text}</Markdown></td></tr> : null }
                </tbody>
            </table>
            <footer>
                <Link to="/coreBonuses">Back to Core Bonuses List</Link>
            </footer>
        </article>
    );
};

const ConnectedCoreBonusIndex = withStore(CoreBonusIndex);
const ConnectedCoreBonus = withStore(CoreBonus);

const CoreBonuses = () => (
    <Switch>
        <Route exact path="/coreBonuses" component={ConnectedCoreBonusIndex}/>
        <Route path="/coreBonuses/:id" component={ConnectedCoreBonus}/>
    </Switch>
);

export default CoreBonuses;
