const React = require('react');
const Header = require('./Header');
const leftPad = require('./utils').leftPad;
require('./App.css');

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header />
        <p className="App-intro">
          Using leftPad(5,6): {leftPad(5, 6)}
        </p>
      </div>
    );
  }
}

module.exports = App;
