import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RmqService {
    constructor(@Inject('CAR_SERVICE') private readonly client: ClientProxy) {}

    public async send(pattern: string, data: any) {
        //NOTE - somehow it does not work without toPromise !
        return await this.client.send(pattern, data).toPromise();
    }
}
