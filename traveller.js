const express = require("express");
const serverless = require("serverless-http");
const app = express();
const mysql = require('mysql');

const cors = require('cors');
app.use(cors());


app.use(express.json());


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "travellerapp"
});



app.get("/traveller", function(request, response) {
  /*
    
  const username = request.query.username;


  let queryToExecute = "SELECT * FROM Task";
  
  if (username) {
    queryToExecute =
      "SELECT * FROM Task JOIN User on Task.UserId = User.UserId " +
      "WHERE User.Username = " + connection.escape(username);
  }

  connection.query(queryToExecute, (err, queryResults) => {
    if (err) {
      console.log("Error fetching tasks", err);
      response.status(500).json({
        error: err
      });
      
    } 
    else {
      response.json({
        tasks: queryResults
      });
    }
  });
  */
});

app.post("/traveller", function(request, response) {
  /*

  const taskToBeSaved = request.body;

  const queryToExecute = "INSERT INTO Task SET ?";
  
  connection.query(queryToExecute, taskToBeSaved, function (error, results, fields) {
    if (error) {
      console.log("Error saving new task", error);
      response.status(500).json({
        error: error
      });
      
    } 
    else {
      response.json({
        taskID: results.insertId
      });
    }
  });
  */
});


app.put("/traveller", function(request, response) {
  /* this expects call in format /tasks?taskID=2 if updating taskID = 2 
   Note that in serverless.yml the path expected for update is just 'tasks
   i.e. the 'taskID' is extracted from the request below - then sanitised 'using' 'escape' - then used in the query*/

   /*
  const taskToBeUpdated = request.body;
  const taskID = request.query.taskID;

  console.log(request.body);
  const queryToExecute = "UPDATE Task SET ? WHERE taskID = " + connection.escape(taskID);

  connection.query(queryToExecute, taskToBeUpdated, function (error, results, fields) {
    if (error) {
      console.log("Error updating task", error);
      response.status(500).json({
        error: error
      });
      
    } 
    else {
      response.send(200);
    }
  });

 */

});


app.delete("/traveller", function(request, response) {

  /* this expects call in format /tasks/2 if deleting taskID = 2 
   Note that in serverless.yml the path expected for delete is tasks/{id}, 
   i.e. the number after 'tasks' is the id which is extracted from the request below then used in the query*/

   /*
  const taskToBeDeleted = request.params.id;

  const queryToExecute = "DELETE FROM Task WHERE TaskID = ?";

  console.log (request.body);
  
  connection.query(queryToExecute, taskToBeDeleted, function (error, results, fields) {
    if (error) {
      console.log("Error deleting task", error);
      response.status(500).json({
        error: error
      });
      
    } 
    else {
      response.json({
        rows_deleted: results.affectedRows
      });
    }
  });
*/
});



module.exports.handler = serverless(app);
