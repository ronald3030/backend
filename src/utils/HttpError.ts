// src/utils/HttpError.ts
export class HttpError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message); // Llama al constructor de la clase Error
        this.statusCode = statusCode;
        this.name = this.constructor.name; // Establece el nombre del error (ej. "HttpError")

        // Esto es para restaurar el prototipo, necesario para que `instanceof HttpError` funcione correctamente en ES5
        Object.setPrototypeOf(this, new.target.prototype);

        // Opcional: Capturar el stack trace, excluyendo el constructor de HttpError
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}