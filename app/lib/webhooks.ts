import { EventEmitter } from 'node:events';

export const webhooks = new EventEmitter();

export const waitForPrediction = (predictionId: string) => {
  return new Promise(resolve => {
    webhooks.once(predictionId, resolve);
  });
}; 