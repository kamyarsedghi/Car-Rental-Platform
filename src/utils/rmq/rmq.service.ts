import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RmqService {
    constructor(@Inject('CAR_SERVICE') private readonly client: ClientProxy) {}

    public async send(pattern: string, data: any) {
        return await this.client.send(pattern, data).toPromise();
    }
}
