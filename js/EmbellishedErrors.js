export const required = () => { throw new EmbellishedRequiredError(); }

export class EmbellishedError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EmbellishedRequiredError extends EmbellishedError {
  constructor() { super('Mandatory parameter not provided'); }
}