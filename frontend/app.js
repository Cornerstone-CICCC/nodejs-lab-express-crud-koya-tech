const BASE_URL = 'http://localhost:3000';

const getEmployees = async () => {
    try {
        const res = await fetch(`${BASE_URL}/employees`);
        if (!res.ok) throw new Error(res.statusText);
        return await res.json();
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
};

const addEmployee = async (employee) => {
    try {
        const res = await fetch(`${BASE_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });
        if (!res.ok) throw new Error(res.statusText);
        return await res.json();
    } catch (error) {
        console.error('Error adding employee:', error);
    }
};

const updateEmployee = async (id, employee) => {
    console.log('updateEmployee', id, employee);
    try {
        const res = await fetch(`${BASE_URL}/employees/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });
        if (!res.ok) throw new Error(res.statusText);
        return await res.json();
    } catch (error) {
        console.error('Error updating employee:', error);
    }
};

const deleteEmployee = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/employees/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error(res.statusText);
        return true;
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
};

const searchEmployees = async (firstname) => {
    try {
        const res = await fetch(`${BASE_URL}/employees/search?firstname=${firstname}`);
        if (!res.ok) throw new Error(res.statusText);
        return await res.json();
    } catch (error) {
        console.error('Error searching employees:', error);
    }
};

// DOM Elements
const employeeListEl = document.getElementById('employeeList');
const employeeDetailsEl = document.getElementById('employeeDetails');
const searchInputEl = document.getElementById('searchInput');
const btnSearchEl = document.getElementById('btnSearch');
const searchResultsEl = document.getElementById('searchResults');
const addEmployeeFormEl = document.getElementById('addEmployeeForm');
const editEmployeeFormEl = document.getElementById('editEmployeeForm');

// Render employee list
const renderEmployeeList = (employees) => {
    employeeListEl.innerHTML = '';
    employees.forEach(emp => {
        const div = document.createElement('div');
        div.className = 'employee-item';
        div.innerHTML = `
            <strong>${emp.firstname} ${emp.lastname}</strong> (Age: ${emp.age}, Married: ${emp.isMarried})
            <br>
            <button data-id="${emp.id}" class="viewBtn">View</button>
            <button data-id="${emp.id}" class="editBtn">Edit</button>
            <button data-id="${emp.id}" class="deleteBtn">Delete</button>
        `;
        employeeListEl.appendChild(div);
    });
};

// Render employee details
const renderEmployeeDetails = (employee) => {
    employeeDetailsEl.innerHTML = employee ? `
        <h3>${employee.firstname} ${employee.lastname}</h3>
        <p>Age: ${employee.age}</p>
        <p>Married: ${employee.isMarried}</p>
    ` : 'No employee selected.';
};

const loadEmployees = async () => {
    const employees = await getEmployees();
    renderEmployeeList(employees);
};

// Event Listeners

// Load employee list on page load
window.addEventListener('DOMContentLoaded', async () => {
    await loadEmployees();
});

// Delegate events for View/Edit/Delete buttons on employee list
employeeListEl.addEventListener('click', async (e) => {
    const target = e.target;
    const id = target.getAttribute('data-id');
    if (target.classList.contains('viewBtn')) {
        const employees = await getEmployees();
        const employee = employees.find(emp => emp.id === id);
        renderEmployeeDetails(employee);
    }
    if (target.classList.contains('editBtn')) {
        const employees = await getEmployees();
        const employee = employees.find(emp => emp.id === id);
        console.log('employee', employee);
        if (employee) {
            document.getElementById('editId').value = employee.id;
            document.getElementById('editFirstname').value = employee.firstname;
            document.getElementById('editLastname').value = employee.lastname;
            document.getElementById('editAge').value = employee.age;
            document.getElementById('editIsMarried').checked = employee.isMarried;
        }
    }
    if (target.classList.contains('deleteBtn')) {
        if (confirm('Are you sure you want to delete this employee?')) {
            await deleteEmployee(id);
            await loadEmployees();
            employeeDetailsEl.innerHTML = '';
        }
    }
});

// Search employees by firstname
btnSearchEl.addEventListener('click', async () => {
    const firstname = searchInputEl.value.trim();
    if (firstname) {
        const results = await searchEmployees(firstname);
        searchResultsEl.innerHTML = '';
        results.forEach(emp => {
            const div = document.createElement('div');
            div.className = 'employee-item';
            div.textContent = `${emp.firstname} ${emp.lastname} (Age: ${emp.age})`;
            searchResultsEl.appendChild(div);
        });
    }
});

// Add Employee Form Submit
addEmployeeFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstname = document.getElementById('addFirstname').value.trim();
    const lastname = document.getElementById('addLastname').value.trim();
    const age = parseInt(document.getElementById('addAge').value, 10);
    const isMarried = document.getElementById('addIsMarried').checked;
    if (firstname && lastname && !isNaN(age)) {
        await addEmployee({ firstname, lastname, age, isMarried });
        addEmployeeFormEl.reset();
        await loadEmployees();
    }
});

// Edit Employee Form Submit
editEmployeeFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const firstname = document.getElementById('editFirstname').value.trim();
    const lastname = document.getElementById('editLastname').value.trim();
    const age = parseInt(document.getElementById('editAge').value, 10);
    const isMarried = document.getElementById('editIsMarried').checked;
    if (id && firstname && lastname && !isNaN(age)) {
        await updateEmployee(id, { firstname, lastname, age, isMarried });
        editEmployeeFormEl.reset();
        await loadEmployees();
    }
});