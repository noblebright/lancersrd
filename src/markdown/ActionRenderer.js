import React from "react";
import { Link } from "react-router-dom";
import { withStore } from "../services/Store";

const ActionRenderer = ({store, id, format}) => {
    const action = store.actions[id];
    switch(format) {
        case "text":
            if(action) {
                return <span>{action.text}<Link to={`/actions/${id}`} className="markdownRef">*</Link></span>
            } else {
                return <span>{`Unknown Action ${id}`}</span>
            }
        case "link":
            return action ? <Link to={`/actions/${id}`}>{action.name}</Link> : <span>Unknown Action: {id}</span>
        default:
            return <span>Action tag supports "text" and "link" formats</span>
    }
};

export default withStore(ActionRenderer);