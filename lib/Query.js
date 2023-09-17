const Database = require('../config/Database');

class Query {

    static async dbSelectAllRoles() {
        const sql = `SELECT role.id, title as role, name as department, LPAD(CONCAT('$', FORMAT(salary, 2)), 11, ' ') as salary
        FROM circus_db.role
        JOIN department ON role.department_id = department.id
        ORDER BY id;`;
        const result = await Database.connection.promise().query(sql);
        return result[0];
    }

    static async dbSelectAllEmployees() {
        const sql = `SELECT e.id, e.first_name, e.last_name, r.title as role, d.name as department, LPAD(CONCAT('$', FORMAT(r.salary, 2)), 11, ' ') as salary,
        (SELECT CONCAT(m.first_name, ' ', m.last_name) FROM employee m WHERE m.id = e.manager_id) as manager
        FROM employee e, role r, department d
        WHERE e.role_id = r.id
        AND r.department_id = d.id
        ORDER BY e.id;`;
        const result = await Database.connection.promise().query(sql);
        return result[0];
    }

    static async dbInsertNewEmployee(firstName, lastName, roleId, managerId) {
        const sql = 'INSERT INTO circus_db.employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);';
        const result = await Database.connection.promise().query(sql, [firstName, lastName, roleId, managerId]);
    }

    static async dbUpdateEmployeeRole(emplyeeId, roleId) {
        const sql = 'UPDATE circus_db.employee SET role_id = ? WHERE id = ?;';
        const result = await Database.connection.promise().query(sql, [roleId, emplyeeId]);
    }

    static async dbInsertNewRole(title, salary, departmentId) {
        const sql = 'INSERT INTO circus_db.role (title, salary, department_id) VALUES (?, ?, ?);';
        const result = await Database.connection.promise().query(sql, [title, salary, departmentId]);
    }

    static async dbSelectAllDepartments() {
        const sql = 'SELECT id, name as department FROM circus_db.department ORDER BY id;';
        const result = await Database.connection.promise().query(sql);
        return result[0];
    }

    static async dbInsertNewDepartment(name) {
        const sql = 'INSERT INTO circus_db.department (name) VALUES (?);';
        const result = await Database.connection.promise().query(sql, name);
    }

    static async dbSelectNameFromEmployees() {
        const sql = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) as name
        FROM employee e
        ORDER BY e.id;`;
        const result = await Database.connection.promise().query(sql);
        return result[0];
    }

}

module.exports = Query;
