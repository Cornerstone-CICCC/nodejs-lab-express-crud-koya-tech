[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ZGkQeMEA)
# NodeJS Lab Day 1 - Full Stack Express BREAD App

**Goal:** Create a full stack application using Node + Express with TypeScript on the backend.

## Instructions 📖

### Backend 🛠️

1. Set up the backend with all the necessary files and packages you will need inside the `backend/` directory:

    **Files/Directories**

    ```bash
    dist/
    src/
    .env
    .gitignore
    package.json
    tsconfig.json
    ```

    **Dev Packages (npm i -D ...)**

    ```bash
    @types/node
    @types/express
    @types/cors
    nodemon
    typescript
    ```

    **Prod Packages (npm i ...)**

    ```bash
    concurrently
    express
    dotenv
    uuid
    cors
    ```

    After installing your packages, create the `dev` script inside your `package.json` for your concurrrently command. Also, finish up your `tsconfig` compiler options and add your desired port inside the `.env` file.

2. Create your server by creating a `server.ts` file inside your `backend/` directory. Using an in-memory database, set up your Express routes for the employees object as provided below:

    ```bash
    GET /employees      # Get employee list
    GET /employees/:id    # Get one employee by ID
    POST /employees     # Add employee
    PUT /employees/:id    # Update employee by ID
    DELETE /employees/:id   # Delete employee by ID
    GET /employees/search   # Search employees by firstname using query parameter
                            # (http://localhost:3500/employees/search?firstname=john)
    ```

    ```ts
    interface Employee {
      id: string;
      firstname: string;
      lastname: string;
      age: number;
      isMarried: boolean;
    }
    ```

3. Start your backend server once you have set up everything by running `npm run dev`. Do not forget to include the two middlewares below so that your server can accept JSON data and also allow the frontend to communicate.

    ```ts
    app.use(express.json()) // Allow JSON
    app.use(cors()) // Allow frontend to send requests
    ```

4. Test all your routes in Postman.

---

### Frontend 🖥️

For the frontend, create an `index.html` and `app.js` file inside your `frontend/` directory and run it with Live Server (Go Live). Recreate the design I provided, you can add CSS if you like.

Send fetch requests using `GET`, `POST`, `PUT`, `DELETE` methods to your backend.

```js
const getEmployees = async () => {
   const res = await fetch("http://localhost:3500/employees", {
      method: "GET"
   });

   if (!response.ok) {
     throw new Error(`Failed to get employees: ${response.statusText}`);
   }

   const data = await res.json();
   return data;
}

const addEmployee = async (firstname, lastname, age, isMarried) => {
   const res = await fetch("http://localhost:3500/employees", {
     method: "POST",
     headers: {
       "Content-Type": "application/json", // When doing POST/PUT/PATCH, you need to set the Content-Type
     },
     body: JSON.stringify({ firstname, lastname, age, isMarried }),
   });

   if (!response.ok) {
     throw new Error(`Failed to add employee: ${response.statusText}`);
   }

   const data = await res.json(); // Returned employee data
   return data;
};

// Add the rest of the functions
```

You can learn more on the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#setting_a_body).

- **List Employees** - List all employees when page loads
    - *View button* - Show employee info on the right section
    - *Edit button* - Fill the fields inside the **Edit Employee** form
    - *Delete button* - Delete employee
- **Search and View Employees button** - Show results on the **View Employee/s Info** section
- **Add Employee form** - Creates a new employee
- **Edit Employee form** - Edit employee info

Good luck! 🎉🎉🎉
