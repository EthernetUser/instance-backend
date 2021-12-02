import { HttpStatus } from '@nestjs/common';

export class GenerateResponse<T> {
    public status: number;
    public error: boolean;
    public message: string;
    public data: T;
    constructor({
        status = HttpStatus.OK,
        error = false,
        message = null,
        data,
    }: {
        status?: number;
        error?: boolean;
        message?: string;
        data: T;
    }) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.data = data;
    }
}
