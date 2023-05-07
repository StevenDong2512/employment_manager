const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: "Backto1997",
    database: "employeeManager_db",
});

connection.connect((err) => {
    if (err) {
        console.log(err.message)
    };
    console.log("database connection establised.");
    start();
});

function start() {
    inquirer.createPromptModule({
        type: "list",
        name: "begin",
        message: "Select a task to execute.",
        choices: [
            "view all departments",
            "view all roles",
            "View all employees",
            "Quit",
        ]
    }).then((data) => {
        switch (data.begin) {
            case "view all departments":
                viewAllDepartments();
                break;
            case "view all roles":
                viewAllRoles();
                break;
            case "view all employees":
                viewAllEmployees();
                break;
        }
    })
}


//View all departments
function viewAllDepartments() {
    const query = `SELECT * 
    FROM department`;
    connectuon.query(query, (err, res) => {
        if (err) {
            console.log(err.message)
        };
        console.table(res);
        start();
    })
}

//View all roles
function viewAllRoles() {
    const query = `SELECT role.title, role.id, department.department, role.salary, 
    FROM role 
    JOIN department ON role.department_id = department.department.id`;
    connection.query(query, (err, res) => {
        if (err) {
            console.log(err.message)
        };
        console.table(res);
        start();
    })
}

//View all employees
function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role_title, department.department, role.salary, manager.first_name
    FROM emoloyee
    LEFT JOIN role ON emoloyee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN manager ON employee.manager_id = manager.id`;
    connection.query(query, (err, res) => {
        if (err) {
            console.log(err.message)
        };
        console.table(res);
        start();
    })
}