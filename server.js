const inquirer = require("inquirer");
const mysql = require("mysql2");
const { deprecate } = require("util");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
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
    inquirer.prompt({
        type: "list",
        name: "begin",
        message: "Select a task to execute.",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee",
            "Quit",
        ]
    }).then((data) => {
        switch (data.begin) {
            case "View all departments":
                viewAllDepartments();
                break;
            case "View all roles":
                viewAllRoles();
                break;
            case "View all employees":
                viewAllEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee":
                updateEmployee();
                break;
            case "Quit":
                connection.end();
                break;
        }
    })
}


//View all departments
function viewAllDepartments() {
    const query = `SELECT *
        FROM department`;
    connection.query(query, (err, res) => {
        if (err) {
            console.log(err.message);
            return start();
        }
        console.table(res);
        start();
    });
}

//View all roles
function viewAllRoles() {
    const query = `SELECT role.title, role.id, department.department, role.salary
    FROM role 
    JOIN department ON role.department_id = department.id`;
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
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
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

// Add a department
function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "department",
        message: "Please enter the name for the new department."
    }).then((data) => {
        const query = `INSERT INTO department (department) 
        VALUES ("${data.department}")`;
        connection.query(query, (err, res) => {
            if (err) {
                console.log(err.message)
            };
            console.log(`Added department ${data.department} to the database!`);
            start();
        });
    });
}

// Add a role
function addRole() {
    const query = `SELECT *
        FROM department`;
    connection.query(query, (err, res) => {
        if (err) {
            console.log(err.message);
            return start();
        }
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Please enter the title for the new role."
            },
            {
                type: "input",
                name: "salary",
                message: "Please enter the salary for the new role."
            },
            {
                type: "list",
                name: "department",
                message: "Please select the department for the new role.",
                choices: res.map(department => department.department)
            }
        ]).then((data) => {
            const department = res.find(d => d.department === data.department);
            const query = `INSERT INTO role SET ?`;
            connection.query(query, {
                title: data.title,
                salary: data.salary,
                department_id: department.id
            }, (err, res) => {
                if (err) {
                    console.log(err.message);
                    return start();
                }
                console.log(`Added role ${data.title} to the database!`);
                start();
            });
        });
    });
}

// Add an employee
function addEmployee() {
    connection.query(`SELECT id, title
    FROM role`, (err, res) => {
        if (err) {
            console.log(err.message);
        };
        const role = res.map(({ id, title }) => ({
            name: title,
            value: `${id}`,
        }));
        inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "Please enter the first name for the new employee.",
            },
            {
                type: "input",
                name: "lastName",
                message: "Please enter the last name for the new employee.",
            },
            {
                type: "list",
                name: "roleId",
                message: "Please select a role for the new employee.",
                choices: role,
            },
            {
                type: "list",
                name: "managerId",
                message: "Please select a manager for the new employee.",
                choices: [
                    {
                        name: "N/A",
                        value: null,
                    },
                    ...managers,
                ]
            },
        ]).then((data) => {
            const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?)`;
            const values = [
                data.firstName,
                data.lastName,
                data.roleId,
                data.managerId,
            ];
            connection.query(query, values, (err) => {
                if (err) {
                    console.error(err);
                }
                start();
            });
        });
    });
}

//Update employee role
function updateEmployee() {
    const queryEmployee = `SELECT employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id`;
    const queryRole = `SELECT * 
    FROM role`;
    let resE, resR;
    connection.query(queryEmployee, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        resE = res;
        promptUser();
    });
    connection.query(queryRole, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        resR = res;
        promptUser();
    });
    function promptUser() {
        if (resE && resR) {
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Select an employee by last name to update.",
                    choices: resE.map((employee) => `${employee.last_name}`)
                },
                {
                    type: "list",
                    name: "role",
                    message: "Select a new role for the employee.",
                    choices: resR.map((role) => role.title),
                },
            ]).then((data) => {
                const employee = resE.find(
                    (employee) => `${employee.last_name}` === data.employee
                );
                const role = resR.find(
                    (role) => role.title === data.role
                );
                const query =
                    `UPDATE employee SET role_id = ? WHERE id = ?`;
                connection.query(
                    query,
                    [role.id, employee.id],
                    (err, res) => {
                        if (err) throw err;
                        console.log(
                            `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database!`
                        );
                        start();
                    });
            });
        }
    }
}

//Quit program
process.on("Quit", () => {
    connection.end();
});