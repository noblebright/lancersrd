import React from 'react';
import { withStore } from "./services/Store";
import {Switch, Route, Link} from "react-router-dom";
import { convertToRoman } from "./util";
import Markdown from "./markdown/Markdown";

const LicenseIndex = ({store}) => {
    const licenses = store.licenses;
    return (
        <section className="index">
            <h1>Licenses List</h1>
            {
                Object.keys(licenses).map(corp => {
                    return (
                        <div key={corp}>
                            <header>{corp}</header>
                            <ul>
                                { Object.keys(licenses[corp]).map(id => {
                                    const current = licenses[corp][id];
                                    return (
                                        <div key={id}>
                                            <Link to={`/licenses/${id}`}>{ current.name }</Link>
                                        </div>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })
            }
            <Link to="/">Back to Home</Link>
        </section>
    );
};

const License = ({store, match}) => {
    const licenseId = match.params.id === "_" ? "" : match.params.id;
    const index = store.licenseIndex[licenseId];

    if(!index) {
        return <h1>Unknown Identifier</h1>;
    }

    const data = store.licenses[index.corp][licenseId];
    const corp = store.corps[index.corp];

    return (
        <article className="License Card">
            <header>{data.name}</header>
            <table>
                <tbody>
                { data.flavor ? <tr><td className="flavorText" colSpan="2"><Markdown>{data.flavor}</Markdown></td></tr> : null }
                <tr><td className="label">Corp:</td><td className="value"><Link to={`/corps/${index.corp}`}>{corp.name}</Link></td></tr>
                <tr><td className="rulesText" colSpan="2">
                    {index.starter ? <Starter store={store} data={index}/> : <LicenseLevels store={store} data={index} /> }
                </td></tr>
                </tbody>
            </table>
            <footer>
                <Link to="/licenses">Back to Licenses List</Link>
            </footer>
        </article>
    );
};

const Starter = ({store, data}) => (
    <React.Fragment>
        <h1>Starter Gear</h1>
        <ul>
            { data.starter.map(item => <li key={item.id}><Link to={`/${item.componentType}/${item.id}`}>{store[item.componentType][item.id].name}</Link></li>) }
        </ul>
    </React.Fragment>
);

const LicenseLevels = ({store, data}) => {
    let levels = [];
    for(let i = 0; i < data.levels.length; i++ ) {
        const level = data.levels[i];

        if(!level) { //gap in licensing
            levels.push(<li key={i}>{convertToRoman(i + 1)}</li>);
        } else {
            let elementList = [];
            for(let j = 0; j < level.length; j++) {
                let item = level[j];
                if(j !== 0) {
                    elementList.push(<span key={2*j - 1}>, </span>);
                }
                const name = store[item.componentType][item.id].name;
                elementList.push(<Link key={2*j} to={`/${item.componentType}/${item.id}`}>{name}</Link>);
            }
            levels.push(<li key={i}>{convertToRoman(i + 1)} {elementList}</li>);
        }
    }
    return <ul>{levels}</ul>;
};

const ConnectedLicenseIndex = withStore(LicenseIndex);
const ConnectedLicense = withStore(License);

const Licenses = () => (
    <Switch>
        <Route exact path="/licenses" component={ConnectedLicenseIndex}/>
        <Route path="/licenses/:id" component={ConnectedLicense}/>
    </Switch>
);

export default Licenses;