import React, {Component} from 'react';
import Synonym from './Synonym'

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      targetWord: 'big',
      synonyms: [
        {
          val: 'huge',
          guessed: false,
        },
        {
          val: 'large',
          guessed: true,
        },
        {
          val: 'grand',
          guessed: false,
        }
      ],
      score: 0,
      textboxVal: 'initial value',
    };
  }

  handleTextChange = (evt) => {
    const textboxVal = evt.target.value;

    this.state.synonyms.forEach((synonym) => {
      if(synonym.val == textboxVal) {
        synonym.guessed = true;
      }
    });

    this.setState({
      textboxVal: textboxVal,
      // synonyms: this.state.synonyms,
    })
  }

  render() {
    return (
      <div>
        <h1>Sup, Christ!</h1>
        <Synonym value={{val: 123123, guessed: true}} />
        <h2>{this.state.targetWord}</h2>
        <input type="text"
               value={this.state.textboxVal}
               onChange={this.handleTextChange}/>
        {
          this.state.synonyms.map((synonym) => <Synonym value={synonym} />)
        }
      </div>
    );
  }
}
