const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "company_db",
  });

  db.query(`SOURCE schema.sql;`, function (err, results) {
    console.log("Database and tables loaded");
  });
  
  db.query(`SOURCE seeds.sql;`, function (err, results) {
      console.log('Data loaded');
    });

    inquirer
  .prompt([
    {
      name: "options",
      message: "What would you like to do?",
      type: "list",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
    },
  ])
  .then((answer) => {
    if ((answer = "View all departments")) {
      db.promise()
        .query(
          `SELECT id, name
                FROM department;`
        )
        .then(([rows, fields]) => {
          console.table(rows);
        })
        .catch(console.log)
        .then(() => db.end());
    }
  });