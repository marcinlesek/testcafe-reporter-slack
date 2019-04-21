require('dotenv').config();

import {
  resolvePath,
  isFileExists,
  readFile
} from './utils/fileHelpers';
import loggingLevels from './const/loggingLevels';

const defaultConfig = {
  webhookUrl: process.env.TESTCAFE_SLACK_WEBHOOK || 'https://hooks.slack.com/services/*****',
  channel: process.env.TESTCAFE_SLACK_CHANNEL || '#testcafe',
  username: process.env.TESTCAFE_SLACK_USERNAME || 'testcafebot',
  loggingLevel: process.env.TESTCAFE_SLACK_LOGGING_LEVEL || loggingLevels.TEST,
  quietMode: process.env.TESTCAFE_SLACK_QUIET_MODE || false
};

console.log(`process.env: ${process.env}`);

const testCafeConfigFilePath = resolvePath('.testcaferc.json');

const loadReporterConfig = () => {
  if (!isFileExists(testCafeConfigFilePath)) {
    return defaultConfig;
  }

  let configRawData = null;

  try {
    configRawData = readFile(testCafeConfigFilePath);
  } catch (err) {
    return defaultConfig;
  }

  try {
    let testCafeConfig = JSON.parse(configRawData);

    return testCafeConfig.reporter.find(obj => obj.name === 'slack');
  } catch (err) {
    return defaultConfig;
  }
};

const reporterConfig = loadReporterConfig();
const config = {...defaultConfig, ...reporterConfig.options};

console.log(`config.webhookUrl: ${config.webhookUrl}`);
console.log(`config.channel: ${config.channel}`);
console.log(`config.username: ${config.username}`);
console.log(`config.loggingLevel: ${config.loggingLevel}`);
console.log(`config.quietMode: ${config.quietMode}`);

export default config;
