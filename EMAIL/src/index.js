const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require('dotenv').config();

// Configurar o middleware para receber solicitações com JSON
app.use(bodyParser.json());

// Configurar o middleware para permitir solicitações de outros domínios
app.use(cors());

// Definir a rota raiz
app.get('/', (req, res) => {
    res.send('Bem-vindo à minha API!');
});

app.post('/send', (req, res) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send('Body da solicitação inválido!');
    }

    const user = process.env.USER;
    const pass = process.env.PASS;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user,
            pass
        }
    })

    const {
        nome,
        email,
        telefone,
        faturamento,
        meioDeContato,
        para,
        reply
    } = req.body
    transporter.sendMail({
        from: user,
        to: para,
        replyTo: reply,
        subject: "Você tem uma nova mensagem!",
        text: `
        Você recebeu uma solicitação de contato:
         Cliente: ${nome} 
         E-mail: ${email} 
         Telefone: ${telefone}  
         Melhor meio de contato: ${meioDeContato}
         Faturamento: ${faturamento}

        `

    }).then(info => {
        res.send(info)
    }).catch(error => {
        res.send(error)
    })
});

const port = process.env.PORT || 3000 

app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}...`);
});
