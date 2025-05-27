const express = require('express');
// Corrigir o caminho de importação
const rabbitMQ = require('../mensageria/rabbitmq');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao RabbitMQ quando a aplicação iniciar
(async () => {
    try {
        await rabbitMQ.connect();
        console.log('Connected to RabbitMQ from app.js');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        // Não encerramos o processo - a reconexão é tratada pelo módulo
    }
})();

app.use(express.json());

app.get('/api/health', (req, res) => {
    try {
        res.status(200).json({ status: 'OK', message: 'Backend is running' });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ status: 'ERROR', message: 'Backend is not running' });
    }
});

app.post(`/api/messages`, async (req, res) => {
    try {
        const { queue = `default`, message } = req.body;

        if (!message) {
            return res.status(400).json({ status: 'ERROR', message: 'Message is required' });
        }

        await rabbitMQ.publishMensage(queue, message);
        res.status(200).json({ status: 'OK', message: 'Message sent successfully' });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ status: 'ERROR', message: 'Failed to send message' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});