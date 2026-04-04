import ClientError from './client-error';

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = 'InvariantError';
  }
}

export default NotFoundError;
