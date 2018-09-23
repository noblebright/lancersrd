import React from 'react';
import { withStore } from "./services/Store";
import {Switch, Route, Link} from "react-router-dom";
import { ListView, getLicense, getDamageText, getRangeText, Tags, getParent } from "./util";
import Markdown from "./markdown/Markdown";

const WeaponIndex = ({store}) => (<ListView data={store.weapons} url="weapons" name="Weapons"/>);

const Weapon = ({store, match}) => {
    const data = store.weapons[match.params.id];
    const parent = getParent(store, data);
    if(!data) {
        return <h1>Unknown Identifier</h1>;
    }
    return (
        <article className="Weapon Card">
            <header>{data.name}</header>
            <table>
                <tbody>
                { data.flavor ? <tr><td className="flavorText" colSpan="2">{data.flavor}</td></tr> : null }
                { parent ? <tr><td className="label">Source:</td><td className="value"><Link to={`/${data.parentType}/${data.parentId}`}>{parent.name}</Link></td></tr> : null }
                <tr><td className="label">License:</td><td className="value">{getLicense(data.license, data.source)}</td></tr>
                <tr><td className="label">Type:</td><td className="value">{data.size} {data.type}</td></tr>
                <tr><td className="label">Tags:</td><td className="value"><Tags tags={data.tags}/></td></tr>
                <tr><td className="label">Range:</td><td className="value">{getRangeText(data.range, data.threat)}</td></tr>
                <tr><td className="label">Damage:</td><td className="value">{getDamageText(data.damage)}</td></tr>
                { data.text ? <tr><td className="rulesText" colSpan="2"><Markdown>{data.text}</Markdown></td></tr> : null }
                </tbody>
            </table>
            <footer>
                <Link to="/weapons">Back to Weapons List</Link>
            </footer>
        </article>
    );
};

const ConnectedWeaponIndex = withStore(WeaponIndex);
const ConnectedWeapon = withStore(Weapon);

const Weapons = () => (
    <Switch>
        <Route exact path="/weapons" component={ConnectedWeaponIndex}/>
        <Route path="/weapons/:id" component={ConnectedWeapon}/>
    </Switch>
);

export default Weapons;