import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ConfirmModal = ({
  displayModal = false,
  modalBody = "",
  modalTitle = "Title here",
  handleOk,
  handleCancel,
  children
}) => (
  <Modal isOpen={displayModal}>
    <ModalHeader>{modalTitle}</ModalHeader>
    <ModalBody>
      {modalBody}
      {children}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={handleOk}>
        Ok
      </Button>{" "}
      <Button color="secondary" onClick={handleCancel}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
);

ConfirmModal.propTypes = {
  displayModal: PropTypes.bool.isRequired,
  children: PropTypes.array,
  modalBody: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  modalTitle: PropTypes.string.isRequired,
  handleOk: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};

export default ConfirmModal;
