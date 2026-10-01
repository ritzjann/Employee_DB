const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;


app.use(express.json());


app.use(express.static(__dirname));



const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db"
});


db.connect((err) => {

    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("Connected to MySQL");

});




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



app.post("/api/employees", (req, res) => {

    const name = req.body.name;
    const position = req.body.position;
    const department = req.body.department;
    const salary = req.body.salary;


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




app.put("/api/employees/:id", (req, res) => {

    const id = req.params.id;
    const name = req.body.name;
    const position = req.body.position;
    const department = req.body.department;
    const salary = req.body.salary;

    if (!name || !position || !department || salary === "" || salary == null) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }


    const sql = `
        UPDATE employees
        SET name = ?, position = ?, department = ?, salary = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [name, position, department, salary, id],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }


            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Employee not found"
                });
            }


            res.json({
                message: "Employee updated successfully"
            });

        }
    );

});




app.delete("/api/employees/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM employees WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error"
            });
        }


        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }


        res.json({
            message: "Employee deleted successfully"
        });

    });

});




app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
