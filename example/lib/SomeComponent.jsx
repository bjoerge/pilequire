/** @jsx React.DOM */

var items = ['foo', 'bar', 'baz', 'qux'];

var React = require('react');
var cx = require('react/lib/cx');

class SomeComponent {
  getInitialState() {
    return {selected: 'bar'}
  }
  render() {
    return (
      <ul>
        {items.map((item, i) => (
          <li key={item} className={cx('selected', item == this.state.selected)}>{`Item #${i}: ${item}`}</li>
        ))}
      </ul>
    )
  }
}

module.exports = React.createClass(SomeComponent.prototype);