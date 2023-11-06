export default class HttpError extends Error {
  /**
   *
   * @param {string} message
   * @param {number} status - The HTTP status code (i.e. 400, 500, etc...)
   */
  constructor(status, message) {
    super(message);

    this.status = status;
  }
}
