// @ts-check

/**
 * Runs an Express-style middleware stack against a request/response pair.
 *
 * @param {Array<Function>} stack
 * @param {object} req
 * @param {object} res
 * @returns {Promise<void>}
 */
export function runStack(stack, req, res) {
  return new Promise((resolve, reject) => {
    let i = 0;
    let settled = false;

    const finish = (err) => {
      if (settled) return;
      settled = true;
      if (err) reject(err);
      else resolve();
    };

    const next = (err) => {
      if (err) return finish(err);
      const fn = stack[i++];
      if (!fn) return finish();
      try {
        const result = fn(req, res, next);
        if (result && typeof result.then === "function")
          result.catch((cause) => finish(cause));
      } catch (cause) {
        finish(cause);
      }
    };

    next();
  });
}
