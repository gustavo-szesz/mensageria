FROM rabbitmq:3.9-management

# Expose the RabbitMQ management plugin port
EXPOSE 15672

# Expose the RabbitMQ default port
EXPOSE 5672

# Set the default user and password for RabbitMQ
ENV RABBITMQ_DEFAULT_USER=admin
ENV RABBITMQ_DEFAULT_PASS=admin

# Set the default virtual host
ENV RABBITMQ_DEFAULT_VHOST=/

# Set the working directory
WORKDIR /etc/rabbitmq

# Start RabbitMQ server
CMD ["rabbitmq-server"]

# Health check to ensure RabbitMQ is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD rabbitmq-diagnostics -q check_running || exit 1