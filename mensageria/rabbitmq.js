const amqp = require('amqplib');

let connection = null;
let channel = null;

async function connect() {
  try {
    const host = process.env.RABBITMQ_HOST || 'localhost';
    const user = process.env.RABBITMQ_USER || 'admin';
    const pass = process.env.RABBITMQ_PASS || 'admin';
    const url = `amqp://${user}:${pass}@${host}:5672`;
    
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    
    console.log(`Successfully connected to RabbitMQ at ${host}`);
    
    // Tratamento de desconexão
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err.message);
      setTimeout(connect, 5000);
    });
    
    connection.on('close', () => {
      console.log('RabbitMQ connection closed, attempting to reconnect...');
      setTimeout(connect, 5000);
    });
    
    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error.message);
    setTimeout(connect, 5000);
    throw error;
  }
}

async function publishMensage(queue, message) {
  try {
    if (!channel) {
      await connect();
    }
    
    await channel.assertQueue(queue, { durable: true });
    const result = channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });
    
    console.log(`[x] Sent ${JSON.stringify(message)} to ${queue}`);
    return result;
  } catch (error) {
    console.error('Error publishing message:', error);
    throw error;
  }
}

async function consumeMessage(queue, callback) {
  try {
    if (!channel) {
      await connect();
    }
    
    await channel.assertQueue(queue, { durable: true });
    console.log(`[*] Waiting for messages in ${queue} queue`);
    
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error consuming messages:', error);
    throw error;
  }
}

module.exports = {
  connect,
  publishMensage,
  consumeMessage
};