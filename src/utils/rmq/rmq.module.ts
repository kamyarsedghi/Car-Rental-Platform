import { Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'CAR_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://user:password@rabbitmq:5672'],
                    queue: 'CloudRMQ',
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
    ],
    providers: [RmqService],
    exports: [RmqService],
})
export class RmqModule {}
