import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { EC2Client, DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand } from "@aws-sdk/client-ec2";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializa o cliente da AWS buscando credenciais locais automaticamente
const ec2Client = new EC2Client({ region: "us-east-1" });

// SUBSTITUA pelo ID real do seu servidor EC2 criado na AWS
const INSTANCE_ID = "i-0123456789abcdef0"; 

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rota 1: Buscar o Status Atual do Servidor
app.get('/api/status', async (req, res) => {
    try {
        const command = new DescribeInstancesCommand({ InstanceIds: [INSTANCE_ID] });
        const data = await ec2Client.send(command);
        const status = data.Reservations[0].Instances[0].State.Name;
        res.json({ status: status });
    } catch (error) {
        res.status(500).json({ error: "Erro ao conectar na AWS", details: error.message });
    }
});

// Rota 2: Ligar o Servidor
app.post('/api/ligar', async (req, res) => {
    try {
        const command = new StartInstancesCommand({ InstanceIds: [INSTANCE_ID] });
        await ec2Client.send(command);
        res.json({ message: "Comando enviado: Ligando instância..." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota 3: Desligar o Servidor
app.post('/api/desligar', async (req, res) => {
    try {
        const command = new StopInstancesCommand({ InstanceIds: [INSTANCE_ID] });
        await ec2Client.send(command);
        res.json({ message: "Comando enviado: Desligando instância..." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Painel JavaScript rodando em: http://localhost:${PORT}`);
});
