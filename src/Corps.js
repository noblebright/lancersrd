import React from 'react';
import { withStore } from "./services/Store";
import {Switch, Route, Link} from "react-router-dom";
import { ListView } from "./util";
import Markdown from "./markdown/Markdown";

const CorpIndex = ({store}) => (<ListView data={store.corps} url="corps" name="Corps"/>);

const Corp = ({store, match}) => {
    const corpId = match.params.id;
    const data = store.corps[corpId];
    const licenses = store.licenses[corpId];
    const coreBonuses = [];
    Object.keys(store.coreBonuses).forEach(key => {
        let bonus = store.coreBonuses[key];
        if(bonus.corpId === corpId) {
            coreBonuses.push(bonus);
        }
    });

    if(!data) {
        return <h1>Unknown Identifier</h1>;
    }
    return (
        <article className="Corp Card">
            <header>{data.name}</header>
            <section>
                { data.flavor ? <Markdown>{data.flavor}</Markdown> : null }
            </section>
            <h5>Licenses</h5>
            <ul>
                {Object.keys(licenses).map(key => <li key={key}><Link to={`/licenses/${key || "_"}`}>{licenses[key].name} ({licenses[key].summary})</Link></li>)}
            </ul>
            <h5>Core Bonuses</h5>
            <ul>
                {coreBonuses.map(bonus =>
                    <li key={bonus.id}>
                        <b>{bonus.name}</b>
                        <div><Markdown>{bonus.text}</Markdown></div>
                    </li>)}
            </ul>
            <footer>
                <Link to="/corps">Back to Corps List</Link>
            </footer>
        </article>
    );
};

export const CorpList = withStore(({store}) => (
    <ul>
        { Object.keys(store.corps).map(key => <li key={key}><Link to={`/corps/${key}`}>{store.corps[key].name}</Link></li>) }
    </ul>
));

const ConnectedCorpIndex = withStore(CorpIndex);
const ConnectedCorp = withStore(Corp);

const Corps = () => (
    <Switch>
        <Route exact path="/corps" component={ConnectedCorpIndex}/>
        <Route path="/corps/:id" component={ConnectedCorp}/>
    </Switch>
);

export default Corps;