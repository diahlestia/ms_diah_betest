import { Kafka } from 'kafkajs';
import { createLog } from "../controllers/log.controller.js"

const kafka = new Kafka({
    clientId: 'user-service',
    brokers: process.env.KAFKA_BROKERS.split(','),
});

const consumer = kafka.consumer({ groupId: 'user-group' });


const consumeUserEvents = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'kafka-diah-betest', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { eventType, userId } = JSON.parse(message.value.toString());
            console.log(`Received event: ${eventType}`);

            // Insert log into MongoDB
            switch (eventType) {
                case 'USER_LOGIN':
                    await createLog('LOGIN', userId);
                    break;
                case 'USER_CREATED':
                    await createLog('CREATE', userId);
                    break;
                case 'USER_UPDATED':
                    await createLog('UPDATE', userId);
                    break;
                case 'USER_DELETED':
                    await createLog('DELETE', userId);
                    break;
                case 'USER_READ':
                    await createLog('READ', userId);
                    break;
                default:
                    console.log('Unknown event type');
            }
        },
    });
};

export const disconnectConsumer = async () => {
    await consumer.disconnect();
};

export default consumeUserEvents;

