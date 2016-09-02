import React, {Component} from 'react';
import axios from 'axios';
import Synonym from './Synonym';

const transitionMillis = 2000;
const APIkey = '1c44ea7d9e42228c85869e55a72fad44';
const url = `https://words.bighugelabs.com/api/2/${APIkey}`;

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
      textboxVal: '',
      gameOpacity: 1,
    };
  }
  
  handleTextChange = (evt) => {
    const textboxVal = evt.target.value;
    this.setState({
      textboxVal: textboxVal,
      // synonyms: this.state.synonyms,
    });
    
    // this mutates the underlying state object
    // but we're not telling React that it updated so we need either
    // forceUpdate() or the this.setState below
    this.state.synonyms.forEach((synonym) => {
      if((synonym.val == textboxVal) && !synonym.guessed) {
        synonym.guessed = true;
        this.setState({textboxVal:''});
      }
    });
    

    
    // if all synonyms have been guessed, reset
    let allGuessed = true;
    
    this.state.synonyms.forEach((synonym) => {
      return allGuessed = allGuessed && synonym.guessed;
    });

    if(allGuessed) {
      this.setState({gameOpacity: 0});
      setTimeout(this.handleReset, transitionMillis);
    }

  }
  
  handleReset = () => {
    // new target word
    const newTargetWord = 'butt';
    axios.get(`${url}/${newTargetWord}/json`)
    .then((result) => {
      // new array of synonyms
      const newSynonyms = result.data.noun.syn
        .map(newSynonym => ({
          val: newSynonym,
          guessed: false
        }));
        
      this.setState({
        textboxVal: '',
        targetWord: newTargetWord,
        synonyms: newSynonyms,
        gameOpacity: 1
      });
    })
    .catch((error) => {
      console.log(error);
    });
    
  }

  render() {
    const style = {
      opacity: this.state.gameOpacity,
      transition: transitionMillis + 'ms',
      cursor: 'move'
    };
    
    return (
      <div>
        <h1>Sup, William!</h1>
        <input type="text"
                 value={this.state.textboxVal}
                 onChange={this.handleTextChange}/>
        <div style={style}>
          <h2>{this.state.targetWord}</h2>
          {
            this.state.synonyms.map((synonym) => <Synonym value={synonym} inputVal={this.state.textboxVal} />)
          }
        </div>
        <button onClick={this.handleReset}>reset</button>
      </div>
    );
  }
}
