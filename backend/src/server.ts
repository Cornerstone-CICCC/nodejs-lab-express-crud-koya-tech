import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

interface Employee {
    id: string;
    firstname: string;
    lastname: string;
    age: number;
    isMarried: boolean;
}

// In-memory storage for employees with sample data
let employees: Employee[] = [
    {
        id: uuidv4(),
        firstname: "John",
        lastname: "Doe",
        age: 30,
        isMarried: false
    },
    {
        id: uuidv4(),
        firstname: "Jane",
        lastname: "Smith",
        age: 25,
        isMarried: true
    },
    {
        id: uuidv4(),
        firstname: "Alice",
        lastname: "Johnson",
        age: 28,
        isMarried: false
    }
];

// GET /employees - Get employee list
app.get('/employees', (req: Request, res: Response) => {
    res.json(employees);
});

// GET /employees/:id - Get one employee by ID
app.get('/employees/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
});

// POST /employees - Add employee
app.post('/employees', (req: Request, res: Response) => {
    const { firstname, lastname, age, isMarried } = req.body;
    if (!firstname || !lastname || age === undefined || isMarried === undefined) {
        return res.status(400).json({ message: 'Invalid employee data' });
    }
    const newEmployee: Employee = {
        id: uuidv4(),
        firstname,
        lastname,
        age,
        isMarried
    };
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});

// PUT /employees/:id - Update employee by ID
app.put('/employees/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const employeeIndex = employees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    const { firstname, lastname, age, isMarried } = req.body;
    employees[employeeIndex] = {
        ...employees[employeeIndex],
        firstname: firstname || employees[employeeIndex].firstname,
        lastname: lastname || employees[employeeIndex].lastname,
        age: age !== undefined ? age : employees[employeeIndex].age,
        isMarried: isMarried !== undefined ? isMarried : employees[employeeIndex].isMarried,
    };
    res.json(employees[employeeIndex]);
});

// DELETE /employees/:id - Delete employee by ID
app.delete('/employees/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const employeeIndex = employees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    employees.splice(employeeIndex, 1);
    res.status(204).send();
});

// GET /employees/search - Search employees by firstname using query parameter
app.get('/employees/search', (req: Request, res: Response) => {
    const { firstname } = req.query;
    if (!firstname || typeof firstname !== 'string') {
        return res.status(400).json({ message: 'Invalid or missing firstname query parameter' });
    }
    const results = employees.filter(emp =>
        emp.firstname.toLowerCase().includes(firstname.toLowerCase())
    );
    res.json(results);
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});