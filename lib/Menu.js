const inquirer = require('inquirer');
const Query = require('./Query');

class Menu {

    static async displayMainMenu() {
        const choices = [
            { name: 'View All Employees', value: 1 },
            { name: 'Add Employee', value: 2 },
            { name: 'Update Employee Role', value: 3 },
            { name: 'View All Roles', value: 4 },
            { name: 'Add Role', value: 5 },
            { name: 'View All Departments', value: 6 },
            { name: 'Add Department', value: 7 },
            { name: 'Quit', value: 8 },
        ];

        const questions = {
            type: 'list', name: 'choice', message: 'What would you like to do?', choices
        }

        const answers = await inquirer.prompt(questions);
        return answers.choice;
    };

    static async displayAddDepartmentMenu() {
        const questions = {
            type: 'input', name: 'choice', message: 'What is the name of the department?'
        }
        const answers = await inquirer.prompt(questions);
        return answers.choice;
    }

    static async displayAddEmployeeMenu() {
        const questions = [
            { type: 'input', name: 'firstName', message: 'What is the employee\'s first name?' },
            { type: 'input', name: 'lastName', message: 'What is the employee\'s last name?' },
        ];
        const roleQuestion = await Menu.generateRoleQuestion();
        questions.push(roleQuestion);
        const managerQuestion = await Menu.generateManagerQuestion();
        questions.push(managerQuestion);
        const answers = await inquirer.prompt(questions);
        return [answers.firstName, answers.lastName, answers.roleId, answers.managerId];
    }

    static async generateRoleQuestion() {
        const question = {
            type: 'list', name: 'roleId', message: 'What is the employee\'s role?'
        }

        const choices = [];
        const roles = await Query.dbSelectAllRoles();
        roles.forEach(element => {
            choices.push({ name: element.role, value: element.id });
        });
        question.choices = choices;
        return question;
    }

    static async generateManagerQuestion() {
        const question = {
            type: 'list', name: 'managerId', message: 'Who is the employee\'s manager?'
        }
        const choices = [{ name: 'None', value: null }];
        const roles = await Query.dbSelectAllManagers();
        roles.forEach(element => {
            choices.push({ name: element.name, value: element.id });
        });
        question.choices = choices;
        return question;
    }

    static async displayAddRoleMenu() {
        const questions = [
            { type: 'input', name: 'title', message: 'What is the name of the role?' },
            { type: 'input', name: 'salary', message: 'What is the salary of the role?' },
        ];
        const departmentQuestion = await Menu.generateDepartmentQuestion();
        questions.push(departmentQuestion);
        const answers = await inquirer.prompt(questions);
        return [answers.title, answers.salary, answers.department];
    }

    static async generateDepartmentQuestion() {

        const question = {
            type: 'list', name: 'department', message: 'Which department does the role belong to?'
        }

        let choices = [];
        const departments = await Query.dbSelectAllDepartments();
        departments.forEach(element => {
            choices.push({ name: element.department, value: element.id });
        });
        question.choices = choices;
        return question;
    }

    static async displayUpdateEmployeeRoleMenu() {

        const questions = [
            { type: 'list', name: 'employeeId', message: 'Which employee\'s role do you want to update?' },
            { type: 'list', name: 'roleId', message: 'Which role do you want to assign the selected employee?' },
        ]

        const userChoice = await Menu.generateUserChoicesForUpdateEmployeeRoleQuestion(questions[0]);
        const roleChoice = await Menu.generateRoleChoicesForUpdateEmployeeRoleQuestion(questions[1]);

        const answers = await inquirer.prompt(questions);

        return [answers.employeeId, answers.roleId];

    }

    static async generateUserChoicesForUpdateEmployeeRoleQuestion(question) {
        let choices = [];
        const employees = await Query.dbSelectAllEmployees();
        employees.forEach(element => {
            choices.push({ name: `${element.first_name} ${element.last_name}`, value: element.id });
        });
        question.choices = choices;
        return question;
    }

    static async generateRoleChoicesForUpdateEmployeeRoleQuestion(question) {
        let choices = [];
        const roles = await Query.dbSelectAllRoles();
        roles.forEach(element => {
            choices.push({ name: element.role, value: element.id });
        });
        question.choices = choices;
        return question;
    }

}

module.exports = Menu;