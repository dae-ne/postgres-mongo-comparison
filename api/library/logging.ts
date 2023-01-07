/* eslint-disable no-console */
const COLOR_RESET = '\x1b[0m';
const COLOR_GREEN = '\x1b[32m';
const COLOR_YELLOW = '\x1b[33m';
const COLOR_RED = '\x1b[31m';
const COLOR_LIGHT_BLUE = '\x1b[94m';

const PREFIX_PAD_LENGTH = 18;
const DATE_TIME_PAD_LENGTH = 21;

// TODO: there's probably a better way to do that
const twoZerosPad = (value: number | string) => `${value}`.padStart(2, '0');

const formatDate = (date: Date) =>
  `${date.toLocaleDateString()} ${twoZerosPad(date.getHours())}:${twoZerosPad(
    date.getMinutes()
  )}:${twoZerosPad(date.getSeconds())}`;

const getMessageWithDateTime = (...message: (string | number)[]) => {
  const date = new Date();
  const formattedDate = `[${formatDate(date)} UTC]`.padEnd(DATE_TIME_PAD_LENGTH);
  return `${formattedDate} ${message.join(' ')}`;
};

const logInfo = (...message: (string | number)[]) =>
  console.log(
    `${COLOR_GREEN}[INFO]${COLOR_RESET}`.padEnd(PREFIX_PAD_LENGTH),
    getMessageWithDateTime(...message)
  );

const logWarning = (...message: (string | number)[]) =>
  console.log(
    `${COLOR_YELLOW}[WARNING]${COLOR_RESET}`.padEnd(PREFIX_PAD_LENGTH),
    getMessageWithDateTime(...message)
  );

const logError = (...message: (string | number)[]) =>
  console.log(
    `${COLOR_RED}[ERROR]${COLOR_RESET}`.padEnd(PREFIX_PAD_LENGTH),
    getMessageWithDateTime(...message)
  );

const logStats = (...message: (string | number)[]) =>
  console.log(
    `${COLOR_LIGHT_BLUE}[STATS]${COLOR_RESET}`.padEnd(PREFIX_PAD_LENGTH),
    getMessageWithDateTime(...message)
  );

export const logger = {
  info: logInfo,
  warn: logWarning,
  error: logError,
  stats: logStats
};
