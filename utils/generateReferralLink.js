function generateRandom10DigitNumber() {
  const min = 1000000000; // Minimum 10-digit number
  const max = 9999999999; // Maximum 10-digit number

  // Generate a random number between min and max
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}

module.exports = generateRandom10DigitNumber;
