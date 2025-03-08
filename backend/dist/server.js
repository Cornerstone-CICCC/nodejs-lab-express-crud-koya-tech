"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// In-memory storage for employees with sample data
let employees = [
    {
        id: (0, uuid_1.v4)(),
        firstname: "John",
        lastname: "Doe",
        age: 30,
        isMarried: false
    },
    {
        id: (0, uuid_1.v4)(),
        firstname: "Jane",
        lastname: "Smith",
        age: 25,
        isMarried: true
    },
    {
        id: (0, uuid_1.v4)(),
        firstname: "Alice",
        lastname: "Johnson",
        age: 28,
        isMarried: false
    }
];
// GET /employees - Get employee list
app.get('/employees', (req, res) => {
    res.json(employees);
});
// GET /employees/:id - Get one employee by ID
app.get('/employees/:id', (req, res) => {
    const id = req.params.id;
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
});
// POST /employees - Add employee
app.post('/employees', (req, res) => {
    const { firstname, lastname, age, isMarried } = req.body;
    if (!firstname || !lastname || age === undefined || isMarried === undefined) {
        return res.status(400).json({ message: 'Invalid employee data' });
    }
    const newEmployee = {
        id: (0, uuid_1.v4)(),
        firstname,
        lastname,
        age,
        isMarried
    };
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});
// PUT /employees/:id - Update employee by ID
app.put('/employees/:id', (req, res) => {
    const id = req.params.id;
    const employeeIndex = employees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    const { firstname, lastname, age, isMarried } = req.body;
    employees[employeeIndex] = Object.assign(Object.assign({}, employees[employeeIndex]), { firstname: firstname || employees[employeeIndex].firstname, lastname: lastname || employees[employeeIndex].lastname, age: age !== undefined ? age : employees[employeeIndex].age, isMarried: isMarried !== undefined ? isMarried : employees[employeeIndex].isMarried });
    res.json(employees[employeeIndex]);
});
// DELETE /employees/:id - Delete employee by ID
app.delete('/employees/:id', (req, res) => {
    const id = req.params.id;
    const employeeIndex = employees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    employees.splice(employeeIndex, 1);
    res.status(204).send();
});
// GET /employees/search - Search employees by firstname using query parameter
app.get('/employees/search', (req, res) => {
    const { firstname } = req.query;
    if (!firstname || typeof firstname !== 'string') {
        return res.status(400).json({ message: 'Invalid or missing firstname query parameter' });
    }
    const results = employees.filter(emp => emp.firstname.toLowerCase().includes(firstname.toLowerCase()));
    res.json(results);
});
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
