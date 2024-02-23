const plans = {
  '3-months': { value: 0.09, compute: (number) => 0.1 * number },
  '6-months': {
    value: 0.18,
    compute: (number) => 0.2 * number - 0.01 * number,
  },
  '1-year': { value: 0.36, compute: (number) => 0.1 * 12 * 0.3 * number },
  '1-month': { value: 0.09, compute: (number) => 0 * number },
};

module.exports = plans;
