const figlet = require("figlet");
const cTable = require('console.table');

const util = require('util');
const figletPromise = util.promisify(figlet);

const Query = require('./lib/Query');
const Database = require('./config/Database');
const { Console } = require('console');
const Menu = require('./lib/Menu');

async function viewAllEmployees() {
    const allEmployees = await Query.dbSelectAllEmployees();
    console.table(allEmployees);
}

async function addEmployee() {
    const [firstName, lastName, roleId, managerId] = await Menu.displayAddEmployeeMenu();
    Query.dbInsertNewEmployee(firstName, lastName, roleId, managerId);
}

async function updateEmployeeRole() {
    const [employeeId, roleId] = await Menu.displayUpdateEmployeeRoleMenu();
    Query.dbUpdateEmployeeRole(employeeId, roleId);
}

async function viewAllRoles() {
    const allRoles = await Query.dbSelectAllRoles();
    console.table(allRoles);
}

async function addRole() {
    const [title, salary, departmentId] = await Menu.displayAddRoleMenu();
    Query.dbInsertNewRole(title, salary, departmentId);
}

async function viewAllDepartments() {
    const departments = await Query.dbSelectAllDepartments();
    console.table(departments);
}

async function addDepartment() {
    const name = await Menu.displayAddDepartmentMenu();
    Query.dbInsertNewDepartment(name);
}

async function displayBanner() {
    try {
        const result = await figletPromise("Employee Tracker");
        console.log(result);
    } catch (err) {
        console.log("Something went wrong...");
        console.dir(err);
    }
}

async function evaluateAnswers(choice) {

    switch (choice) {
        case 1:
            await viewAllEmployees();
            break;
        case 2:
            await addEmployee();
            break;
        case 3:
            await updateEmployeeRole();
            break
        case 4:
            await viewAllRoles();
            break;
        case 5:
            await addRole();
            break;
        case 6:
            await viewAllDepartments();
            break;
        case 7:
            await addDepartment();
            break;
        case 8:
            console.log('Done.');
            break;
    }

}

async function startApp() {
    try {
        Database.createConnection();
        await displayBanner();

        let done = false;
        do {
            const choice = await Menu.displayMainMenu();
            await evaluateAnswers(choice);
            done = choice === 8;
        } while (!done);

    } finally {
        Database.closeConnection();
    }
}

startApp();
