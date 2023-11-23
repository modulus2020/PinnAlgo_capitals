const decodeHTML = (string) => {
  return string.replace(/&lt;/g, '<');
};

module.exports = decodeHTML;
