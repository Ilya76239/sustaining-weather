/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

let testID1, testID2;

suite("Functional Tests", function() {
  suite("POST /api/issues/{project} => object with issue data", function() {
    test("Every field filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title 1",
          issue_text: "text 1",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, "response !=200");
          assert.property(res.body, "issue_title", "issue_title");
          assert.property(res.body, "issue_text", "issue_text");
          assert.property(res.body, "created_on", "created_on");
          assert.property(res.body, "updated_on", "updated_on");
          assert.property(res.body, "created_by", "created_by");
          assert.property(res.body, "assigned_to", "assigned_to");
          assert.property(res.body, "open", "open");
          assert.property(res.body, "status_text", "status_text");
          assert.property(res.body, "_id", "_id");
          assert.equal(res.body.issue_title, "Title 1", "issue_title!=Title");
          assert.equal(res.body.issue_text, "text 1", "issue_text!=text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in",
            "created_by!=Functional Test - Every field filled in"
          );
          assert.equal(
            res.body.assigned_to,
            "Chai and Mocha",
            "assigned_to!=Chai and Mocha"
          );
          assert.equal(res.body.status_text, "In QA", "status_text!=In QA");
          assert.isBoolean(res.body.open, "open !isBoolean");
          assert.equal(res.body.open, true, "open!=true");
          testID1 = res.body._id;
          done();
        });
    });

    test("Required fields filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title 2",
          issue_text: "text 2",
          created_by: "Functional Test - Required fields filled in"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, "response !=200");
          assert.property(res.body, "issue_title", "issue_title");
          assert.property(res.body, "issue_text", "issue_text");
          assert.property(res.body, "created_on", "created_on");
          assert.property(res.body, "updated_on", "updated_on");
          assert.property(res.body, "created_by", "created_by");
          assert.property(res.body, "assigned_to", "assigned_to");
          assert.property(res.body, "open", "open");
          assert.property(res.body, "status_text", "status_text");
          assert.property(res.body, "_id", "_id");
          assert.equal(res.body.issue_title, "Title 2", "issue_title!=Title");
          assert.equal(res.body.issue_text, "text 2", "issue_text!=text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Required fields filled in",
            "created_by!=Functional Test - Required fields filled in"
          );
          assert.equal(res.body.assigned_to, "", "assigned_to not empty");
          assert.equal(res.body.status_text, "", "status_text not empty");
          assert.isBoolean(res.body.open, "open !isBoolean");
          assert.equal(res.body.open, true, "open!=true");
          testID2 = res.body._id;
          done();
        });
    });

    test("Missing required fields", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title 3",
          issue_text: "text 3"
        })
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(
            res.text,
            "Issues validation failed: created_by: Path `created_by` is required."
          );
          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => text", function() {
    test("No body", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({ _id: testID1 })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no updated field sent");
          done();
        });
    });

    test("One field to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({ _id: testID1, issue_text: "Text updated for issue 1" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "successfully updated");
          done();
        });
    });

    test("Multiple fields to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: testID2,
          assigned_to: "updated to Chai and Mocha",
          issue_text: "Text updated for issue 2",
          open: false
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "successfully updated");
          done();
        });
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function() {
      test("No filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      test("One filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ assigned_to: "Chai and Mocha" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            for (let i = 0; i < res.body.length; i++) {
              assert.property(res.body[0], "issue_title");
              assert.property(res.body[0], "issue_text");
              assert.property(res.body[0], "created_on");
              assert.property(res.body[0], "updated_on");
              assert.property(res.body[0], "created_by");
              assert.property(res.body[0], "assigned_to");
              assert.property(res.body[0], "open");
              assert.property(res.body[0], "status_text");
              assert.property(res.body[0], "_id");
              assert.equal(res.body[i].assigned_to, "Chai and Mocha");
            }
            done();
          });
      });

      test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ assigned_to: "updated to Chai and Mocha", open: false })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            for (let i = 0; i < res.body.length; i++) {
              assert.property(res.body[0], "issue_title");
              assert.property(res.body[0], "issue_text");
              assert.property(res.body[0], "created_on");
              assert.property(res.body[0], "updated_on");
              assert.property(res.body[0], "created_by");
              assert.property(res.body[0], "assigned_to");
              assert.property(res.body[0], "open");
              assert.property(res.body[0], "status_text");
              assert.property(res.body[0], "_id");
              assert.equal(
                res.body[i].assigned_to,
                "updated to Chai and Mocha"
              );
              assert.equal(res.body[i].open, false);
            }
            done();
          });
      });
    }
  );

  suite("DELETE /api/issues/{project} => text", function() {
    test("No _id", function(done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.text, "_id error");
          done();
        });
    });

    test("Valid _id", function(done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({ _id: testID2 })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "deleted " + testID2);
          done();
        });
    });
  });
});
