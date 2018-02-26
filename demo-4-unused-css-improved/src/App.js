const React = require('react');
const Header = require('./Header');
const leftPad = require('./utils').leftPad;
const styles = require('./App.css');

function pseudo(styles) {
  console.log(styles['pseudo-used']);
}

class App extends React.Component {
  render() {
    return (
      <div className={styles.App}>
        <Header />
        <p className={styles["App-intro"]}>
          Using leftPad(5,6): {leftPad(5, 6)}
        </p>
      </div>
    );
  }
}

module.exports = App;
