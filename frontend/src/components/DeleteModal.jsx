import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteModal(props) {

  const handleConfirmDelete = () => {
    props.onDelete();
    props.onHide();
}

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            Attention
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Do you really want to delete your pin? This is unrecoverable!!
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>No</Button>
            <Button variant="danger" onClick={handleConfirmDelete}>Yes, I confirm.</Button>
          </Modal.Footer>
        </Modal>
      );
}

export default DeleteModal;