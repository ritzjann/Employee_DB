const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

/*

npm init -y
npm install express mysql2

Then run schema.sql in MySQL to create the database and table.

*/

// Allow JSON data
app.use(express.json());


// Serve index.html
app.use(express.static(__dirname));


// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db"
});


// Test database connection
db.connect((err) => {

    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("Connected to MySQL");

});


// ========================================
// GET - Retrieve Employees (READ)
// ========================================

app.get("/api/employees", (req, res) => {

    const sql = "SELECT * FROM employees ORDER BY id";

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);

    });

});


// ========================================
// POST - Insert Employee (CREATE)
// ========================================

app.post("/api/employees", (req, res) => {

    const name = req.body.name;
    const position = req.body.position;
    const department = req.body.department;
    const salary = req.body.salary;


    // Basic validation
    if (!name || !position || !department || salary === "" || salary == null) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }


    const sql = `
        INSERT INTO employees
        (name, position, department, salary)
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [name, position, department, salary],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }


            res.status(201).json({
                message: "Employee added successfully",
                id: result.insertId
            });

        }
    );

});


// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});