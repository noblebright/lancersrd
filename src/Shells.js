import React from 'react';
import { withStore } from "./services/Store";
import {Switch, Route, Link} from "react-router-dom";
import { ListView, getLicense, getStatsText, getParent } from "./util";
import Markdown from "./markdown/Markdown";

const ShellIndex = ({store}) => (<ListView data={store.shells} url="shells" name="Shells"/>);

const Shell = ({store, match}) => {
    const data = store.shells[match.params.id];
    const parent = getParent(store, data);
    if(!data) {
        return <h1>Unknown Identifier</h1>;
    }
    return (
        <article className="Shell Card">
            <header>{data.name}</header>
            <table>
                <tbody>
                { data.flavor ? <tr><td className="flavorText" colSpan="2"><Markdown>{data.flavor}</Markdown></td></tr> : null }
                { parent ? <tr><td className="label">Source:</td><td className="value"><Link to={`/${data.parentType}/${data.parentId}`}>{parent.name}</Link></td></tr> : null }
                <tr><td className="label">License:</td><td className="value">{getLicense(data.license, data.source)}</td></tr>
                <tr><td className="label">Size:</td><td className="value">{data.size}</td></tr>
                <tr><td className="label">Armor:</td><td className="value">{data.armor}</td></tr>
                <tr><td className="label">SP:</td><td className="value">{data.sp}</td></tr>
                { data.stats ? <tr><td className="label">Bonuses:</td><td className="value">{getStatsText(data.stats)}</td></tr> : null }
                <tr><td className="label">Mounts:</td><td className="value">{data.mounts.join(", ")}</td></tr>
                <tr><td className="rulesText" colSpan="2"><Ultimate name={data.ultName} passive={data.ultPassive} active={data.ultActive}/></td></tr>
                </tbody>
            </table>
            <footer>
                <Link to="/shells">Back to Shells List</Link>
            </footer>
        </article>
    );
};

const Ultimate = ({name, passive, active}) => (
    <React.Fragment>
        <div style={{textAlign: "center", fontWeight: "bold"}}>{name}</div>
        <div><b>Passive: </b><Markdown>{passive}</Markdown></div>
        <div><b>Active (requires 1 core power): </b><Markdown>{active}</Markdown></div>
    </React.Fragment>
);

const ConnectedShellIndex = withStore(ShellIndex);
const ConnectedShell = withStore(Shell);

const Shells = () => (
    <Switch>
        <Route exact path="/shells" component={ConnectedShellIndex}/>
        <Route path="/shells/:id" component={ConnectedShell}/>
    </Switch>
);

export default Shells;