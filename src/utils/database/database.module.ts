import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
    imports: [],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {
    constructor(private readonly DatabaseService: DatabaseService) {}

    async onModuleInit() {
        await this.DatabaseService.createTableIfNotExists();
    }
}
