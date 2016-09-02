import React, {Component} from 'react';
import Synonym from './Synonym';

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

    // this mutates the underlying state object
    // but we're not telling React that it updated so we need either
    // forceUpdate() or the this.setState below
    this.state.synonyms.forEach((synonym) => {
      if(synonym.val == textboxVal) {
        synonym.guessed = true;
      }
    });
    
    this.setState({
      textboxVal: textboxVal,
      // synonyms: this.state.synonyms,
    });
    
    // if all synonyms have been guessed, reset
    let allGuessed = true;
    
    this.state.synonyms.forEach((synonym) => {
      return allGuessed = allGuessed && synonym.guessed;
    });

    if(allGuessed) {
      this.handleReset();
    }


  }
  
  handleReset = () => {
    // new target word
    const newTargetWord = 'butt';
    
    // new array of synonyms
    const newSynonyms = ['rear', 'rump', 'backend', 'behind']
      .map(newSynonym => ({
        val: newSynonym,
        guessed: false
      }));
      
    this.setState({
      textboxVal: '',
      targetWord: newTargetWord,
      synonyms: newSynonyms
    });
  }

  render() {
    return (
      <div>
        <h1>Sup, William!</h1>
        <h2>{this.state.targetWord}</h2>
        <input type="text"
               value={this.state.textboxVal}
               onChange={this.handleTextChange}/>
        {
          this.state.synonyms.map((synonym) => <Synonym value={synonym} inputVal={this.state.textboxVal} />)
        }
        <button onClick={this.handleReset}>reset</button>
      </div>
    );
  }
}
