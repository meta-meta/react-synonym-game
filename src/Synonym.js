import React, {Component} from 'react';

const obfuscateLetter = (letter, input) => input.includes(letter) ? letter : '*';

export default class Synonym extends Component {
  
  render() {
    const style = {
      margin: '10px',
     display:'inline-flex'
    };
    
    const display = this.props.value.val
      .split('')
      .map((letter) => obfuscateLetter(letter, this.props.inputVal))
      .join('');
    
    return <li style={style}>{this.props.value.guessed ? this.props.value.val : display}</li>;
  }
}