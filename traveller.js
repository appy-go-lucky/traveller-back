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



app.get("/traveller/blog", function(request, response) {

  let queryToExecute = 
  "select BLOG.blog_id, BLOG.blog_text, BLOG.blog_country_name, BLOG.blog_city, USER.user_id, USER.user_name, USER.user_country_name, USER.user_city, RESTAURANT.rest_name, RESTAURANT.rest_link, HOTEL.hotel_name, HOTEL.hotel_link, ATTRACTION.attract_name, ATTRACTION.attract_link from BLOG join USER on BLOG.user_id = USER.user_id left join RESTAURANT on BLOG.blog_id = RESTAURANT.blog_id left join HOTEL on BLOG.blog_id = HOTEL.blog_id left join ATTRACTION on BLOG.blog_id = ATTRACTION.blog_id;"
  
  connection.query(queryToExecute, (err, queryResults) => {
    if (err) {
      console.log("Error fetching blogs", err);
      response.status(500).json({
        error: err
      });
      
    } 
    else {
      response.json({
        blogs: queryResults
      });
    }
  });
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

app.get("/traveller/user", function(request, response) {

  let queryToExecute = "select * from USER;";
  
  connection.query(queryToExecute, (err, queryResults) => {
    if (err) {
      console.log("Error fetching users", err);
      response.status(500).json({
        error: err
      });
      
    } 
    else {
      response.json({
        users: queryResults
      });
    }
  });
});


app.post("/traveller/blog", function(request, response) {

  console.log ("Insert blog");

  console.log (request.body);

  const blog_text = request.body.blog_text;
  const blog_country_name = request.body.blog_country_name;
  const blog_city = request.body.blog_city;
  const user_id = request.body.user_id;

  const hotel_name = request.body.hotel_name;
  const hotel_link = request.body.hotel_link;

  const rest_name = request.body.rest_name;
  const rest_link = request.body.rest_link;

  const attract_name = request.body.attract_name;
  const attract_link = request.body.attract_link;

  const blog_queryToExecute = "INSERT INTO BLOG (blog_text, blog_country_name, blog_city, user_id) VALUES (?, ?, ?, ?)";

  const hotel_queryToExecute = "INSERT INTO HOTEL (hotel_name, hotel_link, blog_id) VALUES (?, ?, ?)";

  const rest_queryToExecute = "INSERT INTO RESTAURANT (rest_name, rest_link, blog_id) VALUES (?, ?, ?)";

  const attract_queryToExecute = "INSERT INTO ATTRACTION (attract_name, attract_link, blog_id) VALUES (?, ?, ?)";
              /**/

  connection.query(blog_queryToExecute, [blog_text, blog_country_name, blog_city, user_id], function (error, blog_queryresults, fields) {
    if (error) {
      console.log("Error saving new BLOG record", error);
      response.status(500).json({
        error: error
      });
      
    } 
    else {

                    /**/
      const inserted_blog_id = blog_queryresults.insertId;

      connection.query(hotel_queryToExecute, [hotel_name, hotel_link, inserted_blog_id], function (error, hotel_queryresults, fields) {
        if (error) {
          console.log("Error saving new HOTEL record", error);
          response.status(500).json({
            error: error
          });     
        } 

        else 
        {
              /**/
          const inserted_hotel_id = hotel_queryresults.insertId;

          connection.query(rest_queryToExecute, [rest_name, rest_link, inserted_blog_id], function (error, rest_queryresults, fields) {
            if (error) {
              console.log("Error saving new RESTAURANT record", error);
              response.status(500).json({
                error: error
              });
            } 



    
            else 
            {

              /**/
              const inserted_rest_id = rest_queryresults.insertId;

              connection.query(attract_queryToExecute, [attract_name, attract_link, inserted_blog_id], function (error, attract_queryresults, fields) {
                if (error) {
                  console.log("Error saving new ATTRACTION record", error);
                  response.status(500).json({
                    error: error
                  });

                }

                else {

                    const inserted_attract_id = attract_queryresults.insertId;

                    response.json({
                      blog_id: inserted_blog_id,
                      hotel_id: inserted_hotel_id,
                      rest_id: inserted_rest_id,
                      attract_id: inserted_attract_id 
                    })
                }

              });


              /**/
              
             } 
          });
              /**/

        }
      });
                    /**/
    }
       
  });
                /**/

              });


  
  /*

  const taskToBeSaved = request.body;

  const queryToExecute = "INSERT INTO Task SET ?";
  
  connection.query(
    
    queryToExecute, taskToBeSaved, function (error, results, fields) 
    
    {
    if (error) 
    {
      console.log("Error saving new task", error);
      response.status(500).json({
        error: error
      });  
    } 
    else 
    {
      response.json({
        taskID: results.insertId
      });
    }

  });
  */


app.post("/traveller/user", function(request, response) {

  console.log ("HELLO....Insert user");

  const userToBeSaved = request.body;
  console.log (userToBeSaved);
  const queryToExecute = "INSERT INTO USER SET ?";
  console.log (queryToExecute);

  connection.query(queryToExecute, userToBeSaved, function (error, results, fields) {
    if (error) {
      console.log("Error saving new user", error);
      response.status(500).json({
        error: error
      });
      
    } 
    else {
      response.json({
        user_id: results.insertId
      });
    }
  });

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

  /* this expects call in format /traveller/2 if deleting blog_id = 2 
   Note that in serverless.yml the path expected for delete is traveller/{id}, 
   i.e. the number after 'traveller' is the id which is extracted from the request below then used in the query*/

   
  const blogToBeDeleted = request.params.id;

  const queryToExecute = "DELETE FROM BLOG WHERE blog_id = ?";

  console.log (request.body);
  
  connection.query(queryToExecute, blogToBeDeleted, function (error, results, fields) {
    if (error) {
      console.log("Error deleting blog", error);
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

});



module.exports.handler = serverless(app);
