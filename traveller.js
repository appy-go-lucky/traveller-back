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
  "select BLOG.blog_id, BLOG.blog_text, BLOG.blog_country_name, BLOG.blog_city, USER.user_id, USER.user_name, USER.user_country_name, USER.user_city, RESTAURANT.rest_id, RESTAURANT.rest_name, RESTAURANT.rest_link, HOTEL.hotel_id, HOTEL.hotel_name, HOTEL.hotel_link, ATTRACTION.attract_id, ATTRACTION.attract_name, ATTRACTION.attract_link from BLOG join USER on BLOG.user_id = USER.user_id left join RESTAURANT on BLOG.blog_id = RESTAURANT.blog_id left join HOTEL on BLOG.blog_id = HOTEL.blog_id left join ATTRACTION on BLOG.blog_id = ATTRACTION.blog_id;"
  
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


app.put("/traveller/blog", function(request, response) {

console.log ("UPDATE blog");

console.log (request.body);

const blog_id = request.body.blog_id;
const blog_text = request.body.blog_text;
const blog_country_name = request.body.blog_country_name;
const blog_city = request.body.blog_city;

const hotel_id = request.body.hotel_id;
const hotel_name = request.body.hotel_name;
const hotel_link = request.body.hotel_link;

const rest_id = request.body.rest_id;
const rest_name = request.body.rest_name;
const rest_link = request.body.rest_link;

const attract_id = request.body.attract_id;
const attract_name = request.body.attract_name;
const attract_link = request.body.attract_link;

const blog_queryToExecute = "UPDATE BLOG SET blog_text = ?, blog_country_name = ?, blog_city = ? WHERE blog_id = ?";

const hotel_queryToExecute = "UPDATE HOTEL SET hotel_name = ?, hotel_link = ? WHERE hotel_id = ?";

const rest_queryToExecute = "UPDATE RESTAURANT SET rest_name = ?, rest_link = ? WHERE rest_id = ?";

const attract_queryToExecute = "UPDATE ATTRACTION SET attract_name = ?, attract_link = ? WHERE attract_id = ?";
            /**/

connection.query(blog_queryToExecute, [blog_text, blog_country_name, blog_city, blog_id], function (error, blog_queryresults, fields) {
  if (error) {
    console.log("Error updating BLOG record", error);
    response.status(500).json({
      error: error
    });
    
  } 
  else {

                  /**/

    connection.query(hotel_queryToExecute, [hotel_name, hotel_link, hotel_id], function (error, hotel_queryresults, fields) {
      if (error) {
        console.log("Error updating HOTEL record", error);
        response.status(500).json({
          error: error
        });     
      } 

      else 
      {
            /**/

        connection.query(rest_queryToExecute, [rest_name, rest_link, rest_id], function (error, rest_queryresults, fields) {
          if (error) {
            console.log("Error updating RESTAURANT record", error);
            response.status(500).json({
              error: error
            });
          } 



  
          else 
          {

            /**/

            connection.query(attract_queryToExecute, [attract_name, attract_link, attract_id], function (error, attract_queryresults, fields) {
              if (error) {
                console.log("Error updating ATTRACTION record", error);
                response.status(500).json({
                  error: error
                });

              }

              else {
                response.status(201).send("Update BLOG queries successful: " + blog_queryresults.affectedRows + " Blogs updated, " + hotel_queryresults.affectedRows + " Hotels updated, " + rest_queryresults.affectedRows + " Restaurants updated, " + attract_queryresults.affectedRows + " Attractions updated"); 
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

});


app.put("/traveller/user", function(request, response) {

  console.log ("UPDATE user");
  
  console.log (request.body);
  
  const user_id = request.body.user_id;
  const user_name = request.body.user_name;
  const user_country_name = request.body.user_country_name;
  const user_city = request.body.user_city;
  
  const user_queryToExecute = "UPDATE USER SET user_name = ?, user_country_name = ?, user_city = ? WHERE user_id = ?";

  connection.query(user_queryToExecute, [user_name, user_country_name, user_city, user_id], function (error, blog_queryresults, fields) {
    if (error) {
      console.log("Error updating USER record", error);
      response.status(500).json({
        error: error
      });
      
    } 
    else {
  
  
                    response.status(201).send("Updated USER successfully");
                }
  
              });
  
  });


app.delete("/traveller/blog/:blog_id", function(request, response) {

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

   
  const blogToBeDeleted = request.params.blog_id;

  const blog_queryToExecute = "DELETE FROM BLOG WHERE blog_id = ?";
  const hotel_queryToExecute = "DELETE FROM HOTEL WHERE blog_id = ?";
  const rest_queryToExecute = "DELETE FROM RESTAURANT WHERE blog_id = ?";
  const attract_queryToExecute = "DELETE FROM ATTRACTION WHERE blog_id = ?";

  console.log (request.body);
  
  /* must delete HOTEL/RESTAURANT/ATTRACTION records first then delete BLOG as last action (as blog_id is foreign key on the assocated records */
  
  connection.query(attract_queryToExecute, blogToBeDeleted, function (error, attract_queryresults, fields) {
    if (error) {
      console.log("Error deleting ATTRACTIO record", error);
      response.status(500).json({
        error: error
      });
      
    } 
    else {
  
                    /**/
  
      connection.query(hotel_queryToExecute, blogToBeDeleted, function (error, hotel_queryresults, fields) {
        if (error) {
          console.log("Error deleting HOTEL record", error);
          response.status(500).json({
            error: error
          });     
        } 
  
        else 
        {
              /**/
  
          connection.query(rest_queryToExecute, blogToBeDeleted, function (error, rest_queryresults, fields) {
            if (error) {
              console.log("Error deleting RESTAURANT record", error);
              response.status(500).json({
                error: error
              });
            } 
  
  
  
    
            else 
            {
  
              /**/
  
              connection.query(blog_queryToExecute, blogToBeDeleted, function (error, blog_queryresults, fields) {
                if (error) {
                  console.log("Error deleting BLOG record", error);
                  response.status(500).json({
                    error: error
                  });
  
                }
  
                else {
  
                  response.status(201).send("Delete BLOG queries successful: " + blog_queryresults.affectedRows + " Blogs deleted, " + hotel_queryresults.affectedRows + " Hotels deleted, " + rest_queryresults.affectedRows + " Restaurants deleted, " + attract_queryresults.affectedRows + " Attractions deleted");
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

});


app.delete("/traveller/user/:user_id", function(request, response) {

  const userToBeDeleted = request.params.user_id;
  const queryToExecute = "DELETE FROM USER WHERE user_id = ?";

  connection.query(queryToExecute, userToBeDeleted, function (error, results, fields) {
    if (error) {
      console.log("Error deleting user", error);
      response.status(500).json({
        error: error
      });
      
    } 
    else {
      response.status(201).send("Delete USER query successful: " + results.affectedRows + " rows deleted");
    }
  });

});


module.exports.handler = serverless(app);
