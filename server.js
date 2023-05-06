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
    if (err) throw err;
    console.log("database connection establised.");
    start();
});

function start() {
    inquirer.createPromptModule({
        type: "list",
        name: "begin",
        message: "Select a task to execute.",
        choices: []
    }).then((data) => {
        switch (data.begin) {
            case "...":
                "..."arguments();
                break;
        }
    })
}