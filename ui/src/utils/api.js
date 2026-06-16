import _service from '@netuno/service-client';

export const callService = (opts) => new Promise((resolve, reject) => {
  _service({
    ...opts,
    success: (response) => {
      if (response && response.json !== undefined) resolve(response.json);
      else if (response && response.text !== undefined) resolve(response.text);
      else resolve(response);
    },
    fail: (err) => reject(err)
  });
});