function leftPad(number, length) {
  return Array(length - String(number).length + 1).join('0') + number;
}

module.exports = {
  leftPad: leftPad,
  hello: 'world',
  identity: function (value) {
    return value;
  }
};
