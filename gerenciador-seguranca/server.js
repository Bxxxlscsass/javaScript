const express = require('express');
const bcrypt = require('bcrypt'); // Use require('bcryptjs') if you installed bcryptjs instead
const path = require('path');

const app = express();

// Allows Express to read data sent from the HTML form
app.use(express.urlencoded({ extended: true }));

// Simulating our database state after the password change from the previous step
let usuarioNoBanco = {
    email: "usuario@email.com",
    // This hash corresponds exactly to the new password: "NovaSenhaSuperSegura123"
    senhaHash: "$2b$10$8v8mQGv.YtSgq9yHh1F6OeG7F9mKzR3Xw8P2YV7k4qZ2b9c8d7e6f" 
};

// Route 1: Serve the login page to the user
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route 2: Receive the form data and validate the credentials
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Verify if the email matches the database record
    if (email !== usuarioNoBanco.email) {
        return res.status(401).send("<h1>Erro: E-mail ou senha incorretos.</h1>");
    }

    // 2. Use bcrypt to compare the typed password with the stored secure hash
    const senhaCorreta = await bcrypt.compare(password, usuarioNoBanco.senhaHash);

    // 3. Authorize or reject the user based on the comparison
    if (senhaCorreta) {
        res.send("<h1>Sucesso! Você está logado no sistema.</h1>");
    } else {
        res.status(401).send("<h1>Erro: E-mail ou senha incorretos.</h1>");
    }
});

// Start the local server on port 3000
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000/login");
});
