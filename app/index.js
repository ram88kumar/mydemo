const express = require("express");
const mysql = require("mysql2/promise");
const app = express();

app.use(express.urlencoded({extended: true}));

let db;

async function connectDB(){
    for(let i=0; i<30; i++){
        try {
            db = await mysql.createConnection({
                host: 'localhost',       // Or your database IP/URL
                user: 'root',            // Replace with your MySQL username
                password: 'password',    // Replace with your MySQL password
                database: 'demodb'  
            });
            await db.execute("CREATE TABLE IF NOT EXISTS names (id INT AUTO_INCREMENT PRIMARY_KEY, name VARCHAR(255))");
            console.log("connected to db");
            return;
        }
        catch (e){
        console.log("Waiting for DB");
        await new Promise((r) => setTimeout(r, 2000));
    }
}    
}

app.get('/users/:id', async (req, res) => {
    const [rows] = await db.execute("SELECT * FROM names ORDER BY id DESC");
    let html = "<h1>DevOps Demo</h1>"
    html += '<form method="POST" action="/add">';
    html += '<input name = "name" placeholder="Enter name" required />';
    html += "<button>Add</button></form><ul>";
    rows.forEach((r) => (html += "<li>" + r.name + "</li>"));        
    html += "</ul>";
    res.send(html);
});

app.post("/add", async (req,res) => {
 if(req.body.name) {
    await db.execute("INSERT INTO names (name) VALUES (?)", [req.body.name]);
 }
 res.redirect("/");
});

app.get("/health", (req,res) => res.send("OK"));

connectDB().then(() => 
    app.listen(3000, () => 
        console.log('Server is running on port 3000')));