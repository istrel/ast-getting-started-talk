const React = require('react');
const logo = require('./logo.svg');
const styles = require('./App.css');

module.exports = function () {
  return (
    <header className={styles['App-header']}>
      <img src={logo} className={styles['App-logo']} alt="logo" />
      <h1 className={styles['App-title']}>Welcome to React</h1>
    </header>
  );
};
