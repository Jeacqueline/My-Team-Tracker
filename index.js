const mysql = require('mysql2');
const {prompt} = require('inquirer');
const db = require('./db');
const cTable= require('console.table');

const startQuestion = {
    type: "list",
    name: "start",
    message: "What would you like to do?",
    choices: [
        "View all employees", 
        "Add employee",
        "Update employee role", 
        "View all roles", 
        "Add role", 
        "View all departments", 
        "Add department", 
        "Exit"
    ]
}
const depaQuestion = {
    type: "input",
    name: "departmentAdd",
    message: "What is the name of the department?"
}
const init = async () => {
    const answers = await prompt(startQuestion)
    switch (answers.start) {
        case "View all employees":
            viewAllEmployees()
            break
        case "View all roles":
            viewAllRoles()
            break
        case "View all departments":
            viewAllDepartments()
            break
        case "Add employee":
            addEmployee()
            break
        case "Add role":
            addRole()
            break
        case "Add department":
            addDepartment()
            break
        case "Update employee role":
            updateEmployee()
            break
        case "Exit":
            exit()
            break
    }
}



function viewAllEmployees() {
    db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department_name, 
    CONCAT(manager.first_name, ' ', manager.last_name) as manager_name
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`)
        .then(data => {
            console.table(data[0])
            init()
        })
}

function viewAllRoles() {
    db.promise().query(`
        SELECT role.id, role.title, role.salary, department.name as department_name
        FROM role
        LEFT JOIN department ON role.department_id = department.id
  `) 
        .then(data => {
            console.table(data[0])
            init()
        })
}

function viewAllDepartments() {
    db.promise().query("SELECT * FROM department")
        .then(data => {
            console.table(data[0])
            init()
        })
}


function addDepartment() {
    prompt(depaQuestion)
        .then(answer => {

            return db.promise().query("INSERT INTO department SET ?", {
                name: answer.departmentAdd
            })

        }).then(() => {
            console.log("The department has been successfully added 🥳");
            init()

        })
}

function addRole() {

    db.promise().query("SELECT * FROM department") 
        .then(data => {
            const choices = data[0].map(department => ({ name: department.name, value: department.id }))


            const addRoleQuestion = [{
                type: "input",
                name: "title",
                message: "What is the name of the role?"
            }, {
                type: "number",
                name: "salary",
                message: "What is the salary of the role?",

            },
            {
                type: "list",
                name: "department_id",
                message: "What department does this role belong to?",
                choices: choices
            }]

            prompt(addRoleQuestion)
                .then(answers => {
                    console.log(answers)
                    return db.promise().query("INSERT INTO role SET ?", answers)
                })
                .then(() => {
                    console.log("The role has been added 😎")
                    init()
                })


        })

}

function addEmployee() {
    db.promise().query("SELECT * FROM role") 
        .then(roleData => {
            db.promise().query("SELECT * FROM employee")
                .then(employeeData => {
                    const roleOptions = roleData[0].map(role => ({ name: role.title, value: role.id }))
                    const employeeOptions = employeeData[0].map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }))
                    const addEmployeeQuestions = [
                        {
                            type: "input",
                            name: "first_name",
                            message: "What is the employee's first name?"
                        },
                        {
                            type: "input",
                            name: "last_name",
                            message: "What is the employee's last name?"
                        },
                        {
                            type: "list",
                            name: "role_id",
                            message: "What is the role of the employee?",
                            choices: roleOptions
                        },
                        {
                            type: "list",
                            name: "manager_id",
                            message: "Who is the employee's manager?",
                            choices: employeeOptions
                        },
                    ]
                    prompt(addEmployeeQuestions)
                        .then(answers => {
                            return db.promise().query("INSERT INTO employee SET ?", answers)
                        })
                        .then(() => {
                            init()
                        })
                })

        })
}

function updateEmployee() {
    db.promise().query("SELECT * FROM role")
        .then(roleData => {
            db.promise().query("SELECT * FROM employee")
                .then(employeeData => {
                    const roleOptions = roleData[0].map(role => ({ name: role.title, value: role.id }))
                    const employeeOptions = employeeData[0].map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }))
                    const updateEmployeeInq = [
                        {
                            type: "list",
                            name: "id",
                            message: "Which employee would you like to update?",
                            choices: employeeOptions
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Which role do you want to assign now?",
                            choices: roleOptions
                        }
                    ]
                    prompt(updateEmployeeInq)
                        .then(answers => {
                            return db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.roleId, answers.id])
                        }).then(() => {
                            console.log("Update role successfuly 🤖")
                            init()
                        })
                })
        })
}

function exit() {
    console.log("Thank you! 🤓")
    process.exit()

}

init()