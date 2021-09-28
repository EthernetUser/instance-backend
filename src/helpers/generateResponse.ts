import { HttpStatus } from '@nestjs/common';

export class GenerateResponse {
    public status: number;
    public error: boolean;
    public message: string;
    public data: unknown;
    constructor({
        status = HttpStatus.OK,
        error = false,
        message,
        data,
    }: {
        status?: number;
        error?: boolean;
        message?: string;
        data: any;
    }) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.data = data;
    }
}