import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const AlertModal = ({
  buttonLabel = "Close",
  displayModal = false,
  modalBody = "Body here",
  modalTitle = "Title here",
  handleClose
}) => (
  <Modal isOpen={displayModal}>
    <ModalHeader>{modalTitle}</ModalHeader>
    <ModalBody>{modalBody}</ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={handleClose}>
        {buttonLabel}
      </Button>
    </ModalFooter>
  </Modal>
);

AlertModal.propTypes = {
  buttonLabel: PropTypes.string,
  displayModal: PropTypes.bool.isRequired,
  modalBody: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.object)
  ]).isRequired,
  modalTitle: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AlertModal;
