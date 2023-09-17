const figlet = require("figlet");
const cTable = require('console.table');

const util = require('util');
const figletPromise = util.promisify(figlet);

const Query = require('./lib/Query');
const Database = require('./config/Database');
const { Console } = require('console');
const Menu = require('./lib/Menu');

const CONS_CTRL_CHAR = `\x1b`;
const CONS_ANSI_RED = '[31m';
const CONS_RESET_ALL = '[0m';

async function viewAllEmployees() {
    const allEmployees = await Query.dbSelectAllEmployees();
    console.table(allEmployees);
}

async function addEmployee() {
    const [firstName, lastName, roleId, managerId] = await Menu.displayAddEmployeeMenu();
    Query.dbInsertNewEmployee(firstName, lastName, roleId, managerId);
    console.log(`Added ${firstName} ${lastName} to the database`);
}

async function updateEmployeeRole() {
    const [employeeId, roleId] = await Menu.displayUpdateEmployeeRoleMenu();
    Query.dbUpdateEmployeeRole(employeeId, roleId);
    console.log(`Updated employee's role.`)
}

async function viewAllRoles() {
    const allRoles = await Query.dbSelectAllRoles();
    console.table(allRoles);
}

async function addRole() {
    const [title, salary, departmentId] = await Menu.displayAddRoleMenu();
    Query.dbInsertNewRole(title, salary, departmentId);
    console.log(`Added ${title} to the database`)
}

async function viewAllDepartments() {
    const departments = await Query.dbSelectAllDepartments();
    console.table(departments);

}

async function addDepartment() {
    const name = await Menu.displayAddDepartmentMenu();
    Query.dbInsertNewDepartment(name);
    console.log(`Added ${name} to the database`)
}

async function displayBanner() {
    const result = await figletPromise("Employee Tracker");
    console.log(result);
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
        // let a = 1n / 0n;

        let done = false;
        do {
            const choice = await Menu.displayMainMenu();
            await evaluateAnswers(choice);
            done = choice === 8;
        } while (!done);
    } catch (err) {
        console.error(`${CONS_CTRL_CHAR}${CONS_ANSI_RED}An unexpected error has occured. Exiting.${CONS_CTRL_CHAR}${CONS_RESET_ALL}`);
    } finally {
        Database.closeConnection();
    }
}

startApp();
