/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Issue = require("../models/issues.js");
const Helper = require("../utils/helpers.js");

const expect = require("chai").expect;

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      var project = req.params.project;
      let query = { project: project };
      //assign query fields as filters
      Object.assign(query, req.query);
      Issue.find(query)
        .select("-project")
        .then(issues => res.json(issues));
    })

    .post(function(req, res) {
      var project = req.params.project;
      let issue = new Issue(req.body);
      issue.project = project;
      issue.save((err, data) => {
        if (err) {
          res.status(400).send(err.message);
        } else {
          res.json(Helper.formatJSON(data));
        }
      });
    })

    .put(function(req, res) {
      var project = req.params.project;
      //if id has been submitted
      if (!req.body._id) {
        res.status(400).send("_id is required for update");
      } else {
        //build query & update fields
        let query = { _id: req.body._id, project: project };
        delete req.body._id;
        for (let [key, value] of Object.entries(req.body)) {
          if (value === "") {
            delete req.body[key];
          }
        }
        //if fields are empty then object is empty
        if (Object.keys(req.body).length === 0) {
          res.send("no updated field sent");
        } else {
          req.body.updated_on = new Date(Date.now());
          Issue.findOneAndUpdate(query, req.body, (err, doc) => {
            if (err) {
              res.status(500).send(err);
              return;
            }
            if (!doc) {
              res.send("could not update " + query._id);
            } else {
              res.send("successfully updated");
            }
          });
        }
      }
    })

    .delete(function(req, res) {
      var project = req.params.project;
      if (!req.body._id) {
        res.status(400).send("_id error");
      } else {
        Issue.findOneAndDelete(
          { project: project, _id: req.body._id },
          (err, issue) => {
            if (err) {
              res.status(500).send(err);
            } else if (issue) {
              res.send("deleted " + issue._id);
            } else {
              res.send("could not delete " + req.body._id);
            }
          }
        );
      }
    });
};
