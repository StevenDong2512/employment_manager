const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Backto1997",
    database: "employeeManager_db",
});

connection.connect((err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Database connection established.");
    start();
});

function start() {
    inquirer
        .prompt({
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
            ],
        })
        .then((data) => {
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
                    process.exit();
            }
        });
}

function viewAllDepartments() {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res) => {
        if (err) {
            console.error(err);
            start();
            return;
        }
        console.table(res);
        start();
    });
}

function viewAllRoles() {
    const query = `SELECT role.title, role.id, department.department, role.salary
    FROM role 
    JOIN department ON role.department_id = department.id`;
    connection.query(query, (err, res) => {
        if (err) {
            console.error(err);
            start();
            return;
        }
        console.table(res);
        start();
    });
}

function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;
    connection.query(query, (err, res) => {
        if (err) {
            console.error(err);
            start();
            return;
        }
        console.table(res);
        start();
    });
}

function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "department",
            message: "Please enter the name for the new department.",
        })
        .then((data) => {
            const query = `INSERT INTO department (department) VALUES (?)`;
            connection.query(query, [data.department], (err) => {
                if (err) {
                    console.error(err);
                    start();
                    return;
                }
                console.log(`Added department ${data.department} to the database!`);
                start();
            });
        });
}

function addRole() {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res) => {
        if (err) {
            console.error(err);
            start();
            return;
        }
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Please enter the title for the new role.",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Please enter the salary for the new role.",
                },
                {
                    type: "list",
                    name: "department",
                    message: "Please select the department for the new role.",
                    choices: res.map((department) => department.department),
                },
            ])
            .then((data) => {
                const department = res.find((d) => d.department === data.department);
                const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                connection.query(
                    query,
                    [data.title, data.salary, department.id],
                    (err) => {
                        if (err) {
                            console.error(err);
                            start();
                            return;
                        }
                        console.log(`Added role ${data.title} to the database!`);
                        start();
                    }
                );
            });
    });
}

function addEmployee() {
    connection.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`, (err, res) => {
        if (err) {
            console.error(err);
            start();
            return;
        }
        const employees = [{ name: "None", value: null }, ...res];
        connection.query(`SELECT id, title FROM role`, (err, res) => {
            if (err) {
                console.error(err);
                start();
                return;
            }
            const roles = res;
            inquirer
                .prompt([
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
                        choices: roles.map((role) => ({
                            name: role.title,
                            value: role.id,
                        })),
                    },
                    {
                        type: "list",
                        name: "managerId",
                        message: "Please select a manager for the new employee.",
                        choices: employees,
                    },
                ])
                .then((data) => {
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
                            start();
                            return;
                        }
                        console.log(`Added employee ${data.firstName} ${data.lastName} to the database!`);
                        start();
                    });
                });
        });
    });
}

function updateEmployee() {
    const queryEmployee = `SELECT employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id`;
    const queryRole = `SELECT * FROM role`;

    connection.query(queryEmployee, (err, resE) => {
        if (err) {
            console.error(err);
            start();
            return;
        }
        connection.query(queryRole, (err, resR) => {
            if (err) {
                console.error(err);
                start();
                return;
            }
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Select an employee to update their role.",
                        choices: resE.map((employee) => ({
                            name: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id,
                        })),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select a new role for the employee.",
                        choices: resR.map((role) => ({
                            name: role.title,
                            value: role.id,
                        })),
                    },
                ])
                .then((data) => {
                    const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    connection.query(query, [data.role, data.employee], (err) => {
                        if (err) {
                            console.error(err);
                            start();
                            return;
                        }
                        console.log("Employee role updated successfully!");
                        start();
                    });
                });
        });
    });
}

//Quit program
process.on("Quit", () => {
    connection.end();
});