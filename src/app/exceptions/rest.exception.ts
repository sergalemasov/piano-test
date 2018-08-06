export class RestException extends Error {
  public message: string;
  public status: number;
  public response: string;
  public headers: { [key: string]: any };

  constructor(status: number, response: string, headers: { [key: string]: any }) {
    super();

    this.message = `Error: Http ${status}. ${response}.`;
    this.status = status;
    this.response = response;
    this.headers = headers;
  }
}
