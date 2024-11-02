import { Kafka } from 'kafkajs';
import dotenv from "dotenv";
dotenv.config();

const kafka = new Kafka({
    clientId: 'user-service',
    brokers: process.env.KAFKA_BROKERS.split(','),
});

const producer = kafka.producer();

export const connectProducer = async () => {
    await producer.connect();
};

export const sendUserEvent = async (eventType, userId) => {
    try {
        await producer.send({
            topic: 'kafka-diah-betest',
            messages: [
                { value: JSON.stringify({ eventType, userId }) },
            ],
        });
        console.log(`Sent event: ${eventType}`);
    } catch (error) {
        console.error('Error sending event', error);
    }
};

export const disconnectProducer = async () => {
    await producer.disconnect();
};
