const React = require('react');
const Header = require('./Header');
require('./App.css');

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header />
        <p className="App-intro">
          Intro
        </p>
      </div>
    );
  }
}

module.exports = App;
