import pino from 'pino';

let logger: pino.Logger;

if (!logger) {
  logger = pino();
}

const info = (text: string, content: any = {}) => {
  logger.info(content, text);
};

const warn = (text: string, content: any = {}) => {
  logger.warn(content, text);
};

const err = (text: string, content: any = {}) => {
  logger.error(content, text);
};

export { info, warn, err };
