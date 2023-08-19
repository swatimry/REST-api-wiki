const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
require('dotenv').config();
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
mongoose.connect(process.env.DBLINK, { useNewUrlParser: true });

const articleschema = {
  title: String,
  content: String,
};

const articlemodel = mongoose.model("article", articleschema);

app
  .route("/articles")
  .get(function (req, res) {
    articlemodel.find().then(function (ans, err) {
      if (!err) {
        res.send(ans);
      } else {
        console.log(err);
      }
    });
  })
  .post(function (req, res) {
    console.log(req.body.title, req.body.content);
    const newarticle = new articlemodel({
      title: req.body.title,
      content: req.body.content,
    });
    newarticle.save();
    res.send("saved");
  })
  .delete(function (req, res) {
    articlemodel.deleteMany().then(function (ans) {
      console.log(ans);
      if (ans.acknowledged === true) {
        res.send("deleted");
      }
    });
  });

app
  .route("/articles/:clientpage")
  .get(function (req, res) {
    articlemodel
      .findOne({ title: req.params.clientpage })
      .then(function (ans) {
        console.log(ans);
        if (ans != null) {
          res.send(ans);
        } else {
          res.send("article not found");
        }
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .put(function (req, res) {
    console.log("inside put");
    articlemodel
      .updateOne(
        { title: req.params.clientpage },
        { $set: { title: req.body.title, content: req.body.content } }
      )
      .then(function (ans) {
        console.log(req.body.title);
        console.log(ans);
        if (ans.matchedCount === 0) {
          res.send("matching article not found to be updated");
        } else {
          res.send("updated succesfully");
        }
      })
      .catch(function (err) {
        console.log(err);
        res.send("couldn't update");
      });
  })
  .patch(function (req, res) {
    articlemodel
      .updateOne({ title: req.params.clientpage }, { $set: req.body })
      .then(function (ans) {
        if (ans.matchedCount === 0) {
          res.send("matching article not found to be updated");
        } else {
          console.log(ans);
          res.send("updated");
        }
      })
      .catch(function (err) {
        res.send("couldn't update");
      });
  })
  .delete(function (req, res) {
    articlemodel
      .deleteOne({ title: req.params.clientpage })
      .then(function (ans) {
        if (ans.deletedCount === 0) {
          res.send("no matching articles found to be deleted");
        } else {
          res.send("deleted");
        }
      })
      .catch(function (err) {
        res.send("there's an error");
      });
  });

app.listen(3000, function () {
  console.log("listening");
});
