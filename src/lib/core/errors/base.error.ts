import { ErrorCategory } from './error.category';
import { format } from 'util';

export abstract class BaseError extends Error {
  public readonly category: ErrorCategory;
  public readonly cause?: Error | BaseError;
  constructor(category: ErrorCategory, message: string, cause?: Error | BaseError) {
    super(message);
    this.message = formatMessage(this.name, category, message);
    this.stack = formatStack(this.stack, cause);
    this.category = category;
    this.cause = cause;
  }
}

function formatStack(
  stack?: string,
  cause?: Error | BaseError
): string {
  let formatedStack = '';
  if(stack) {
    formatedStack += format(messageFormats.stack, stack);
  }
  if(cause) {
    formatedStack += '\n';
    if(cause instanceof BaseError) {
      formatedStack += formatMessage(
        cause.name, 
        cause.category, 
        cause.message, 
        cause.stack, 
        cause.cause
      );
    } else {
      formatedStack += format(messageFormats.cause, cause.name, cause.message);
      if(cause.stack) {
        formatedStack += format(messageFormats.stack, cause.stack);
      }
    }
  }
  return formatedStack;
}

function formatMessage(
  name: string, 
  category: ErrorCategory, 
  message: string, 
  stack?: string,
  cause?: Error | BaseError
): string {
  let formatedMessage = format(messageFormats.message, name, category, message);
  formatedMessage += formatStack(stack, cause);
  return formatedMessage;
}

const messageFormats = {
  cause: 'caused by: %s. Message: %s',
  message: '%s: %s. Message: %s',
  stack: 'stacktrace: %s'
};