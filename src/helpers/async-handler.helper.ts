import { getMessageError } from '../utils/get-message-error.util';
import { FunctionBase } from 'lodash';

/* eslint-disable  @typescript-eslint/no-explicit-any */
function asyncHandler(fn: FunctionBase, context: string) {
    return (...args: any[]): Promise<void> => {
        return (fn(...args) as Promise<void>).catch((error: Error | unknown): void => {
            const messageError = getMessageError(error);
            const functionName = fn.name;
            console.error(`[${context}] [${functionName}]: ${messageError}`);
            throw error;
        });
    };
}


export { asyncHandler};