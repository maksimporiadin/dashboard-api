export class HTTPError extends Error {
    statusCode: number;
    //message: string; it has already added inside Error class
    context?: string;

    constructor(statusCode: number, message: string, context?: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.context = context;

    }
}