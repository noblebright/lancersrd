import React from "react";
import { Link } from "react-router-dom";
import { withStore } from "../services/Store";
import { getDamageText, getRangeText, Tags } from "../util";
import Markdown from "./Markdown";

const generateRenderer = (type, label, custom) => ({store, id, format}) => {
    const entity = store[type][id];
    switch(format) {
        case "text":
            if(entity) {
                return <span><Markdown>{entity.text}</Markdown><Link to={`/${type}/${id}`} className="markdownRef">*</Link></span>
            } else {
                return <span>{`Unknown ${label} ${id}`}</span>
            }
        case "link":
            return entity ? <Link to={`/${type}/${id}`}>{entity.name}</Link> : <span>Unknown ${label}: {id}</span>
        default:
            if(custom) {
                const Renderer = custom[format];
                if(Renderer) {
                    return <Renderer value={entity} id={id}/>
                }
            }
            return <span>${label} tag supports {[...Object.keys(custom || {}), "text"]}, and "link" formats</span>
    }
};

export const Weapon = withStore(generateRenderer("weapons", "Weapons", {
    block: ({value, id}) => {
        if(!value) {
            return <div>Unknown Weapon id: {id}</div>;
        }

        return (
            <table>
                <tbody>
                <tr><td className="label" colSpan="2">{value.name}</td></tr>
                <tr><td className="label">Type:</td><td className="value">{value.size} {value.type}</td></tr>
                <tr><td className="label">Tags:</td><td className="value"><Tags tags={value.tags}/></td></tr>
                <tr><td className="label">Range:</td><td className="value">{getRangeText(value.range, value.threat)}</td></tr>
                <tr><td className="label">Damage:</td><td className="value">{getDamageText(value.damage)}</td></tr>
                { value.text ? <tr><td className="rulesText" colSpan="2"><Markdown>{value.text}</Markdown></td></tr> : null }
                </tbody>
            </table>
        );
    }
}));
export const Action = withStore(generateRenderer("actions", "Actions"));
export const Status = withStore(generateRenderer("statuses", "Statuses"));
export const Tag = withStore(generateRenderer("tagDefs", "Tag Defs"));
