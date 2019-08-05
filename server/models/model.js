// Require the Express Module
var express = require("express");

// invoke express and store the result in the variable app
var app = express();

// Require body-parser (to receive post data from clients)
var bodyParser = require("body-parser");
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path

var path = require("path");
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, "./static")));
// Setting our Views Folder Directory
app.set("views", path.join(__dirname, "./views"));
// Setting our View Engine set to EJS
app.set("view engine", "ejs");

// //this is the code for the database
// // *******************************************************
// // use app's get method and pass it the base route '/' and a callback
var mongoose = require("mongoose");
// // This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of

//1 put in the name of the database that you are going to create below:
mongoose.connect("mongodb://localhost/animaldb", { useNewUrlParser: true });
// // Use native promises (only necessary with mongoose versions <= 4)
mongoose.Promise = global.Promise;
//this is creating a collection below quoteschema can be whatever you want to call it.
var AnimalSchema = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String },
    personality: { type: String }
  },
  { timestamps: true }
);

// //  // Store the Schema under the name 'animal'
mongoose.model("Animal", AnimalSchema);
var Animal = mongoose.model("Animal");
// We are setting this Scheme in our Model as "animal"

// THIS IS THE END OF THE DATABASE CODE
// *******************************************

// SHOW ALL MONGOOSE ON DASHBOARD
app.get("/", function(request, response) {
  // Using the animal Schema...
  // ...retrieve all records matching {}
  Animal.find({}, function(err, animal) {
    // Retrieve an array of animals
    // This code will run when the DB is done attempting to retrieve all matching records to {}
    response.render("dashboard", {show_animals:animal});
  });
});

// SHOW FORM TO ADD TO THE DATABASE
app.get("/new", function(request, response) {
  response.render("create");
});

// TO PROCESS IN THE DATABASE
app.post("/create", function(req, res) {
  console.log("POST DATA", req.body);
  // create a new Animal with the name and age corresponding to those from req.body
  var animal = new Animal({
    animalID:  req.body._id,
    name: req.body.name,
    type: req.body.type,
    personality: req.body.personality
  });
  // Try to save that new animal to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  animal.save(function(err, animal) {
    // if there is an error console.log that something went wrong!
    if (err) {
      console.log("something went wrong");
    } else {
      // else console.log that we did well and then redirect to the root route
      console.log("successfully added an animal!");
    }
    res.redirect("/", { show_animals: animal });
  });
});
// This is the route that we already have in our server.js
// When the animal presses the submit button on index.ejs it should send a post request to '/animals'.  In
//  this route we should add the animal to the database and then redirect to the root route (index view).

// TO SHOW ONE ITEM IN THE DATABASE on separate page
app.get("/show_one/:animalID", function (request, response) {
  console.log("The animal id requested is:", request.params.animalID);
  // ...retrieve 1 record (the first record found) matching {}
  Animal.findOne({ _id: request.params.animalID }, function (err, animalID) {
  // res.send("You requested the animal with id: " + req.params.id);
    // Retrieve 1 object
    // This code will run when the DB is done attempting to retrieve 1 record.
    response.render("show_one", { show_animals: animalID });
  });
});

// TO SHOW FORM TO EDIT ONE ITEM IN THE DATABASE
app.get("/show_edit/:animalID", function (request, response) {
  // ...retrieve 1 record (the first record found) matching {}
  Animal.findOne({ _id: request.params.animalID }, function (err, animalID) {
    response.render("show_edit", { show_animals: animalID });
  });
});
// ************************************
// ...update any records that match the query

// PROCESS EDIT PAGE 
app.post('/edit', function (request, response) {
  
//   Animal.findOneAndUpdate({ _id: req.params.id },{

//   }
//    response.redirect('/', ) { show_animals: animalID });
//   });
// });

//   Animal.findOneAndUpdate({ _id: request.params.animalID }, function (err, animalID) 
//   // {
//     response.redirect("/", { show_animals: animalID });
//   });
// });

    Animal.FindOneAndUpdate({
      $set: { _id: request.params.animalID }, function(err, animalID) {
        response.redirect("/", { show_animals: animalID });
      }
    });
  });

//   doc = "Animal"
//   Animal.updateOne({ _id: doc._id }, { $set: { name: 'Animal' } });
//   await doc.save();
// response.redirect("/", { show_animals: animalID });
  
  
  // Animal.updateOne({ _id: doc._id }, { $set: { name: '', type: '', personality: '' } });
//   response.redirect("/", { show_animals: animalID });
// });


app.post("/delete/:animalID", function(request, response) {
  // ...delete 1 record by a certain key/value.
  Animal.remove({ _id: request.params.animalID}, function(err,animalID) {
    // This code will run when the DB has attempted to remove one matching record to {_id: 'insert record unique id here'}
  });
  response.redirect("/", {show_animals: animalID});
});

app.listen(8000, function() {
  console.log("listening on port 8000");
});
