const React = require('react');
const logo = require('./logo.svg');

module.exports = function () {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to React</h1>
    </header>
  );
};
