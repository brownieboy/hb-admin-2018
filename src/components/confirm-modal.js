import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ConfirmModal = ({
  displayModal = false,
  modalBody = "",
  modalTitle = "Title here",
  cancelButtonLabel = "Cancel",
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
      {handleOk ? (
        <Button color="primary" onClick={handleOk}>
          Ok
        </Button>
      ) : null}

      <Button color="secondary" onClick={handleCancel}>
        {cancelButtonLabel}
      </Button>
    </ModalFooter>
  </Modal>
);

ConfirmModal.propTypes = {
  cancelButtonLabel: PropTypes.string,
  displayModal: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType(
    [PropTypes.array, PropTypes.object],
    PropTypes.string
  ),
  modalBody: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  modalTitle: PropTypes.string.isRequired,
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func.isRequired
};

export default ConfirmModal;
