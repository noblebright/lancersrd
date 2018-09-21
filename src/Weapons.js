import React from 'react';
import { withStore } from "./services/Store";
import {Switch, Route, Link} from "react-router-dom";

const WeaponIndex = ({store: { weapons }}) => {
    return (
        <section className="index">
            <h1>Weapons List</h1>
            <ul>
                { Object.keys(weapons).map(id => {
                    const weapon = weapons[id];
                    return (
                        <div key={id}>
                            <Link to={`/weapons/${id}`}>{weapon.source} {weapon.name}</Link>
                        </div>
                    );
                })}
            </ul>
        </section>
    );
};

const Weapon = ({store, match}) => {
    const data = store.weapons[match.params.id];
    if(!data) {
        return <h1>Unknown Identifier</h1>;
    }
    return (
        <article className="Weapon">
            <header>{data.name}</header>
            <table>
                <tbody>
                <tr><td className="label">License:</td><td>{data.source}</td></tr>
                <tr><td className="label">Type:</td><td>{data.size} {data.type}</td></tr>
                <tr><td className="label">Tags:</td><td>{getTagText(data.tags)}</td></tr>
                <tr><td className="label">Range:</td><td>{getRangeText(data.range, data.threat)}</td></tr>
                <tr><td className="label">Damage:</td><td>{getDamageText(data.damage)}</td></tr>
                { data.text ? <tr><td className="rulesText" colSpan="1">{data.text}</td></tr> : null }
                { data.flavor ? <tr><td className="flavorText" colSpan="1">{data.flavor}</td></tr> : null }
                </tbody>
            </table>
            <footer>
                <Link to="/weapons">Back to Weapons List</Link>
            </footer>
        </article>
    );
}

function getTagText(tags) {
    const tagList = Object.keys(tags).sort().map(tag => {
        if(tags[tag] === true) {
            return tag;
        } else {
            return `${tag} ${tags[tag]}`;
        }
    });
    return tagList.join(", ");
}

function getRangeText(ranges, threat) {
    const rangeList = Object.keys(ranges).sort().map(range => {
        switch(range) {
            case "target":
                return ranges[range];
            case "line":
                return `Line ${ranges[range][0]}`;
            case "cone":
                return `Cone ${ranges[range][0]}`;
            case "blast":
                return `${ranges[range][0]}, Blast ${ranges[range][1]}`;
            default:
                return `WARNING! Unknown range type: ${range}`;
        }
    });
    rangeList.push(`Threat ${threat || 1}`);
    return rangeList.join(", ");
}

function getDamageText(damages) {
    const damageList = Object.keys(damages).sort().map(type => {
        switch(type) {
            case "choose":
                return `${damages[type]} kinetic, explosive, or energy damage (choose when attacking)`;
            default:
                return `${damages[type]} ${type}`;
        }
    });
    return damageList.join(" + ");
}
const ConnectedWeaponIndex = withStore(WeaponIndex);
const ConnectedWeapon = withStore(Weapon);

const Weapons = () => (
    <Switch>
        <Route exact path="/weapons" component={ConnectedWeaponIndex}/>
        <Route path="/weapons/:id" component={ConnectedWeapon}/>
    </Switch>
);

export default Weapons;