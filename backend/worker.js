const rabbitMQ = require('../mensageria/rabbitmq');

async function startWorker() {
  try {
    await rabbitMQ.connect();
    console.log('Worker connected to RabbitMQ');
    
    // Processar mensagens da fila default
    await rabbitMQ.consumeMessage('default', (message) => {
      console.log('Processing message:', message);
      // Implemente o processamento da mensagem aqui
    });
    
    console.log('Worker started successfully');
  } catch (error) {
    console.error('Worker failed to start:', error);
    process.exit(1);
  }
}

startWorker();