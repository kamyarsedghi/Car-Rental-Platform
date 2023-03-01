import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
    private client: Redis;

    constructor(private readonly config: ConfigService) {
        this.client = new Redis({
            host: this.config.get('REDIS_HOST'),
            port: this.config.get('REDIS_PORT'),
        });

        this.client.on('error', err => {
            console.log(err);
        });

        this.client.on('connect', () => {
            console.log('Redis connected');
        });

        this.client.on('ready', () => {
            console.log('Redis ready');
        });

        this.client.on('reconnecting', () => {
            console.log('Redis reconnecting');
        });

        this.client.on('end', () => {
            console.log('Redis end');
        });

        this.client.on('warning', () => {
            console.log('Redis warning');
        });

        this.client.on('drain', () => {
            console.log('Redis drain');
        });

        this.client.on('idle', () => {
            console.log('Redis idle');
        });

        this.client.on('close', () => {
            console.log('Redis close');
        });

        this.client.on('pause', () => {
            console.log('Redis pause');
        });

        this.client.on('resume', () => {
            console.log('Redis resume');
        });
    }

    async getOrSet(key: string, cb: () => Promise<any>, ttl?: number) {
        const data = await this.client.get(key);
        if (data) {
            return JSON.parse(data);
        } else {
            console.log('Cache miss');
            const result = await cb();
            await this.client.set(key, JSON.stringify(result));
            ttl ? await this.client.expire(key, ttl) : null;
            return result;
        }
    }
}
