import React from "react";

import {
  createNotification,
  NOTIFICATION_TYPE_SUCCESS,
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_INFO,
  NOTIFICATION_TYPE_WARNING
} from "react-redux-notify";

const DURATION_SUCCESS = 3000;
const DURATION_WARNING = 5000;
const DURATION_ERROR = 10000;
const DURATION_INFO = 5000;

// Action creators, return a notification (object?)
export const notifySuccess = (message = "No message supplied") =>
  createNotification({
    message,
    type: NOTIFICATION_TYPE_SUCCESS,
    duration: DURATION_SUCCESS,
    canDismiss: true,
    icon: <i className="fa fa-check" />
  });

export const notifyInfo = (message = "No message supplied") =>
  createNotification({
    message,
    type: NOTIFICATION_TYPE_INFO,
    duration: DURATION_INFO,
    canDismiss: true,
    icon: <i className="fa fa-check" />
  });

export const notifyError = (message = "No message supplied") =>
  createNotification({
    message,
    type: NOTIFICATION_TYPE_ERROR,
    duration: DURATION_ERROR,
    canDismiss: true,
    icon: <i className="fa fa-check" />
  });

export const notifyWarning = (message = "No message supplied") =>
  createNotification({
    message,
    type: NOTIFICATION_TYPE_WARNING,
    duration: DURATION_WARNING,
    canDismiss: true,
    icon: <i className="fa fa-check" />
  });
