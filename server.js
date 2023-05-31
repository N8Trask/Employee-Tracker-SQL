const mysql = require("mysql2");
const inquirer = require("inquirer");
const formatRowsToTable = require("./helpers/formatting");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "company_db",
});

const optionsActions = {
  "View all departments": () =>
    db
      .promise()
      .query(
        `SELECT 
                id, 
                name 
            FROM department;`
      )
      .then(([rows, fields]) => {
        const table = formatRowsToTable(rows);
        console.log(table);
        promptOptions();
      })
      .catch(console.log),

  "View all roles": () =>
    db
      .promise()
      .query(
        `SELECT 
            title, 
            role.id, 
            salary, 
            department.name 
        FROM role 
        JOIN department on role.department_id = department.id;`
      )
      .then(([rows, fields]) => {
        const table = formatRowsToTable(rows);
        console.log(table);
        promptOptions();
      })
      .catch(console.log),

  "View all employees": () =>
    db
      .promise()
      .query(
        `SELECT
                employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                department.name,
                role.salary,
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee
            JOIN role on employee.role_id = role.id
            JOIN department on role.department_id = department.id
            LEFT JOIN employee as manager on manager.id = employee.manager_id;`
      )
      .then(([rows, fields]) => {
        const table = formatRowsToTable(rows);
        console.log(table);
        promptOptions();
      })
      .catch(console.log),

  "Add a department": () => {
    inquirer
      .prompt([
        {
          name: "departmentName",
          message: "Enter the name of the department: ",
          type: "input",
        },
      ])
      .then((answer) => {
        const departmentName = answer.departmentName;
        return db.promise().query("INSERT INTO department (name) VALUES (?)", departmentName, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log("Added a new department");
        });
      })
      .then(([rows, fields]) => {
        console.log("Added a new department");
        promptOptions();
      })
      .catch(console.log);
  },

  "Add a role": () => {
    inquirer
      .prompt([
        {
          name: "roleName",
          message: "What is the name of the role?",
          type: "input",
        },
        {
          name: "salary",
          message: "What is the salary of the role?",
          type: "input",
        },
        {
          name: "department",
          message: "Which department does the role belong to?",
          type: "list",
          choices: () =>
            db
              .promise()
              .query("SELECT * FROM department")
              .then(([rows]) => rows.map((department) => department.name)),
        },
      ])
      .then((answers) => {
        const { roleName, salary, department } = answers;
        const departmentName = department;
        return db
          .promise()
          .query(`SELECT id FROM department WHERE name = ?`, departmentName)
          .then(([rows]) => {
            const id = rows[0].id;
            return db
              .promise()
              .query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [roleName, salary, id]);
          });
      })
      .then(([rows, fields]) => {
        console.log("Added new role");
        promptOptions();
      })
      .catch(console.log);
  },
  "Add an employee": () => {
    inquirer
      .prompt([
        {
          name: "firstName",
          message: "What is the employee's first name?",
          type: "input",
        },
        {
          name: "lastName",
          message: "What is the employee's last name?",
          type: "input",
        },
        {
          name: "role",
          message: "What is the employee's role?",
          type: "list",
          choices: () =>
            db
              .promise()
              .query("SELECT * FROM role")
              .then(([rows]) => rows.map((role) => role.title)),
        },
        {
          name: "manager",
          message: "Who is the emplyee's manager?",
          type: "list",
          choices: () =>
            db
              .promise()
              .query("SELECT * FROM employee")
              .then(([rows]) => rows.map((employee) => employee.first_name + " " + employee.last_name)),
        },
      ])
      .then((answers) => {
        const { firstName, lastName, role, manager } = answers;
        const roleName = role;
        let managerID;
        let roleID;
        return db
          .promise()

          .query("SELECT id FROM role WHERE title = ?", roleName)
          .then(([rows]) => {
            roleID = rows[0].id;

            const [managerFirstName, managerLastName] = manager.split(" ");
            return db
              .promise()
              .query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [
                managerFirstName,
                managerLastName,
              ]);
          })
          .then(([rows]) => {
            managerID = rows[0].id;
            return db
              .promise()
              .query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [
                firstName,
                lastName,
                roleID,
                managerID,
              ]);
          })
          .then(([rows, fields]) => {
            console.log("Added new employee");
            promptOptions();
          })
          .catch(console.log);
      });
  },
  "Update an employee role": () => {
    inquirer
      .prompt([
        {
          name: "employee",
          message: "Which employee's role do you want to update?",
          type: "list",
          choices: () =>
            db
              .promise()
              .query("SELECT * FROM employee")
              .then(([rows]) => rows.map((employee) => employee.first_name + " " + employee.last_name)),
        },
        {
          name: "roleName",
          message: "Which role do you want to assign to the selected employee?",
          type: "list",
          choices: () =>
            db
              .promise()
              .query("SELECT * FROM role")
              .then(([rows]) => rows.map((role) => role.title)),
        },
      ])
      .then((answers) => {
        const { employee, roleName } = answers;
        let employeeID;
        let roleID;
        return db
          .promise()
          .query("SELECT id FROM role WHERE title = ?", roleName)
          .then(([rows]) => {
            roleID = rows[0].id;
            const [firstName, lastName] = employee.split(" ");
            return db
              .promise()
              .query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [firstName, lastName]);
          })
          .then(([rows]) => {
            employeeID = rows[0].id;
            return db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [roleID, employeeID]);
          })
          .then(([rows, fields]) => {
            console.log(`Updated role for ${employee}`);
            promptOptions();
          })
          .catch(console.log);
      });
  },
  "View total expense by department": () =>
    db
      .promise()
      .query(
        `SELECT 
            department.name,
            sum(role.salary) as Total_Expense
        FROM role
        JOIN department on department.id = role.department_id
        RIGHT JOIN employee on employee.role_id = role.id
        GROUP BY department.name;`
      )
      .then(([rows, fields]) => {
        const table = formatRowsToTable(rows);
        console.log(table);
        promptOptions();
      })
      .catch(console.log),
  Exit: () => db.end(),
};

function promptOptions() {
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
          "View total expense by department",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      const action = optionsActions[answer.options];
      if (action) {
        action();
      } else {
        console.log("Invalid option");
        promptOptions();
      }
    });
}

promptOptions();