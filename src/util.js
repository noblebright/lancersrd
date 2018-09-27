import React from "react";
import {Link} from "react-router-dom";
import {withStore} from "./services/Store";

export const ListView = ({ data, name, url, hideSource }) => {
    return (
        <section className="index">
            <h1>{name} List</h1>
            <ul>
                { Object.keys(data).map(id => {
                    const current = data[id];
                    return (
                        <div key={id}>
                            <Link to={`/${url}/${id}`}>{ hideSource ? current.name : `${current.corpId} ${current.name}`}</Link>
                        </div>
                    );
                })}
            </ul>
            <Link to="/">Back to Home</Link>
        </section>
    );
};

const TagList = ({store, tags}) => {
    let tagList = Object.keys(tags).sort();
    let elementList = [];
    for(let i = 0; i < tagList.length; i++) {
        let tag = tagList[i];
        if(i !== 0) {
            elementList.push(<span key={2*i - 1}>, </span>);
        }
        if(store.tagDefs[tag]) {
            const name = store.tagDefs[tag].name;
            elementList.push(<Link key={2*i} to={`/tags/${tag}`}>{tags[tag] === true ? name : `${name} ${tags[tag]}`}</Link>);
        } else {
            elementList.push(<span key={2*i}>{tag}</span>);
        }
    }
    return (
        <React.Fragment>
            {elementList}
        </React.Fragment>
    );
};

export const Tags = withStore(TagList);

const DumbLicense = ({store, license, corpId}) => {
    const {line, level, talent, shell} = license;
    if((line && level)) {
        return <Link to={`/licenses/${line}`}>{`${store.licenses[corpId][line].name} ${"I".repeat(level * 1)}`}</Link>;
    }
    if(talent && level) {
        return <span>{`${talent} ${"I".repeat(level * 1)}`}</span>;
    }
    if(shell) {
        return <Link to={`/shells/${shell}`}>{`${shell} SHELL`}</Link>;
    }
    return <Link to={`/corps/${corpId}`}>{store.corps[corpId].name}</Link>;
};

export const License = withStore(DumbLicense);

export function getTagText(store, tags) {
    const tagList = Object.keys(tags).sort().map(tag => {
        if(tags[tag] === true) {
            return tag;
        } else {
            return `${tag} ${tags[tag]}`;
        }
    });
    return tagList.join(", ");
}

export function getRangeText(ranges, threat) {
    let rangeList;
    if(!ranges) {
        return null;
    }
    if(ranges.special) {
        rangeList = ["Special"];
    } else {
        rangeList = Object.keys(ranges).sort().map(range => {
            switch(range) {
                case "target":
                    return ranges[range];
                case "line":
                    return `Line ${ranges[range][0]}`;
                case "cone":
                    return `Cone ${ranges[range][0]}`;
                case "blast":
                    return `${ranges[range][0]}, Blast ${ranges[range][1]}`;
                case "burst":
                    return `Burst ${ranges[range]}`;
                default:
                    return `WARNING! Unknown range type: ${range}`;
            }
        });
        if(threat !== null) {
            rangeList.push(`Threat ${threat || 1}`);
        }
    }

    return rangeList.join(", ");
}

export function getDamageText(damages) {
    const damageList = Object.keys(damages).sort().map(type => {
        switch(type) {
            case "special":
                return "Special";
            case "choose":
                return `${damages[type]} kinetic, explosive, or energy damage (choose when attacking)`;
            default:
                return `${damages[type]} ${type}`;
        }
    });
    return damageList.join(" + ");
}

export function getStatsText(stats) {
    return Object.keys(stats).sort()
        .map(stat => `${stats[stat] > 0 ? "+" : ""}${stats[stat]} ${stat}`)
        .join(", ");
}

export function getParent(store, data) {
    return data && data.parentType && data.parentId ? store[data.parentType][data.parentId] : null;
}

const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
export function convertToRoman(num) {
    let  str = '';
    for (let i of Object.keys(roman)) {
        let q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
    }
    return str;
}