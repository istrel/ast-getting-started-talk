const React = require('react');
const FooterInner = require('./FooterInner.js');
const identity = require('./utils').identity;

module.exports = function () {
  return (
    <span>
      {identity('hello')}
      Nobody uses inner span anyway
    </span>
  );
};
