import React from "react";
import { Alert, Button, Modal, ListGroup, ListGroupItem, ModalHeader, ModalBody } from "reactstrap";
import { addSource, getSources, deleteSource } from "./LocalStorage";
import { withStore } from "../services/Store";

const CloseIcon = ({size}) => (
    <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img" style={{width: size, height: size}}>
        <path d="M19.41,18l8.29-8.29a1,1,0,0,0-1.41-1.41L18,16.59,9.71,8.29A1,1,0,0,0,8.29,9.71L16.59,18,8.29,26.29a1,1,0,1,0,1.41,1.41L18,19.41l8.29,8.29a1,1,0,0,0,1.41-1.41Z"/>
    </svg>
);

class ManageModal extends React.Component {
    state = {
        src: ""
    };

    handleChange = (e) => { this.setState({ src: e.target.value })};

    handleAdd = () => {
        const { onClose: handleClose, store, updateStore } = this.props;
        const { src } = this.state;
        this.setState({ err: null });
        return addSource(src, store).then(store => {
            console.log("post AddSource", store);
            updateStore(store);
            handleClose();
        }).catch(err => {
            this.setState({ err: `Unable to load data source: ${src}` });
        });
    };

    handleClose = () => {
        this.setState({ err: null, src: "" });
        this.props.onClose();
    };

    handleDelete = (e) => {
        const { onClose: handleClose, store, updateStore } = this.props;
        const src = e.currentTarget.getAttribute("data-source");
        console.log('deleting source', src);
        return deleteSource(src, store).then(store => {
            updateStore(store);
            handleClose();
        });
    };

    render() {
        const {isOpen, className} = this.props;
        const {err} = this.state;
        return (
            <Modal isOpen={isOpen} toggle={this.handleClose} className={className} backdrop="static">
                <ModalHeader toggle={this.handleClose}>Manage Data Sources</ModalHeader>
                <ModalBody className="AddModalBody">
                    { err ? <Alert color="danger">{this.state.err}</Alert> : null }
                    <section className="AddSource">
                        <label>Source URL:</label>
                        <input value={this.state.src} onChange={this.handleChange}/>
                        <Button onClick={ this.handleAdd }>Add</Button>
                    </section>
                    <ListGroup>
                        { getSources().map(source =>
                            <ListGroupItem key={source} className="Source">
                                <span title={source}>{source}</span>
                                <button className="deleteButton" data-source={source} onClick={this.handleDelete}><CloseIcon size="24px"/></button>
                            </ListGroupItem>) }
                    </ListGroup>
                </ModalBody>
            </Modal>
        );
    }
}

export default withStore(ManageModal);