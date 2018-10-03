import React from 'react';
import { withStore } from "./services/Store";
import {Switch, Route, Link} from "react-router-dom";
import { ListView, convertToRoman } from "./util";
import Markdown from "./markdown/Markdown";

const TalentIndex = ({store}) => (<ListView data={store.talents} url="talents" name="Talents" hideSource/>);

const Talent = ({store, match}) => {
    const data = store.talents[match.params.id];
    if(!data) {
        return <h1>Unknown Identifier</h1>;
    }
    return (
        <article className="Talent Card">
            <header>{data.name}</header>
            <table>
                <tbody>
                { data.flavor ? <tr><td className="flavorText" colSpan="2"><Markdown>{data.flavor}</Markdown></td></tr> : null }
                { data.levels.map((level, idx) => <TalentLevel key={idx} level={idx + 1} data={level} />)}
                </tbody>
            </table>
            <footer>
                <Link to="/talents">Back to Talents List</Link>
            </footer>
        </article>
    );
};

const TalentLevel = ({level, data}) => (
    <tr className="TalentLevel"><td>{ `${data.name} ` }(Rank {convertToRoman(level)})</td><td><Markdown>{data.text}</Markdown></td></tr>
);

const ConnectedTalentIndex = withStore(TalentIndex);
const ConnectedTalent = withStore(Talent);

const Talents = () => (
    <Switch>
        <Route exact path="/talents" component={ConnectedTalentIndex}/>
        <Route path="/talents/:id" component={ConnectedTalent}/>
    </Switch>
);

export default Talents;