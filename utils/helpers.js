"use strict";

exports.formatJSON = json => {
  return {
    _id: json._id,
    issue_title: json.issue_title,
    issue_text: json.issue_text,
    created_on: json.created_on,
    updated_on: json.updated_on,
    created_by: json.created_by,
    assigned_to: json.assigned_to,
    open: json.open,
    status_text: json.status_text
  };
};
