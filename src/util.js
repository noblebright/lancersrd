import React from "react";
import {Link} from "react-router-dom";

export const ListView = ({ data, name, url }) => {
    return (
        <section className="index">
            <h1>{name} List</h1>
            <ul>
                { Object.keys(data).map(id => {
                    const current = data[id];
                    return (
                        <div key={id}>
                            <Link to={`/${url}/${id}`}>{current.source} {current.name}</Link>
                        </div>
                    );
                })}
            </ul>
            <Link to="/">Back to Home</Link>
        </section>
    );
};

export function getTagText(tags) {
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

export function getLicense(license, source) {
    const {line, level, talent, shell} = license;
    if((line && level)) {
        return `${line} ${"I".repeat(level * 1)}`;
    }
    if(talent && level) {
        return `${talent} ${"I".repeat(level * 1)}`;
    }
    if(shell) {
        return `${shell} SHELL`;
    }
    return source;
}

export function getStatsText(stats) {
    return Object.keys(stats).sort()
        .map(stat => `${stats[stat] > 0 ? "+" : ""}${stats[stat]} ${stat}`)
        .join(", ");
}