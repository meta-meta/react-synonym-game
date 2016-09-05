import React, {Component} from 'react';
import axios from 'axios';
import Synonym from './Synonym';

const transitionMillis = 2000;
const APIkey = '1c44ea7d9e42228c85869e55a72fad44';
const synonymUrl = `http://words.bighugelabs.com/api/2/${APIkey}`;
const newWordUrl = 'http://www.setgetgo.com/randomword/get.php';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      targetWord: '',
      synonyms: [],
      score: 0,
      textboxVal: '',
      gameOpacity: 1,
      listFont:0,
      listFontColor:'#964747'
        };
  }

  componentWillMount() {
    this.handleReset();
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
    this.setState({
      textboxVal: '',
      guessedWordBox: [],
      synonyms: [],
      gameOpacity: 1,
      listFont:0,
      listFontColor:'#D3EDED'
    });
    const wordLength = Math.floor(Math.random() * (6-4)+3); //6 is max word length and 3 min

    console.log(wordLength)
    axios.get(newWordUrl+"?len="+wordLength)
    .then((result) => {
      return result.data; //newTargetWord
    })
    .then((newTargetWord) => {
      this.setState({targetWord: newTargetWord});
      return newTargetWord; // the return value gets wrapped in a Promise so we can once again call then()
    })
    .catch((error) => {
      console.log('fetch new word:', error);
      return Promise.reject('failed to fetch new word. no need to hit the thesaurus API') // this will cause the subsequent then()s to not get called and instead skip to the next catch()
    })
    .then((newTargetWord) => axios.get(`${synonymUrl}/${newTargetWord}/json`))
    .then((result) => {
      const newSynonyms = result.data.noun.syn
        .map(newSynonym => ({
          val: newSynonym,
          guessed: false
        }));
        this.setState({synonyms:newSynonyms});
        this.setState({listFont: '25px'});


    })
    .catch((error) => {
      console.log('fetch synonyms:', error);
      setTimeout(this.handleReset, 1000); // try again in a second
      // one reason we get an error is that the new target word might not exist in big huge thesaurus
    });
    setTimeout(this.setState({listFontColor:'#D3EDED'}),1000)
  }

  render() {
    const style = {
      textAlign:'center',
      fontSize:'25px',
      opacity: this.state.gameOpacity,
      transition: transitionMillis + 'ms',
      cursor: 'default'
    };

    return (
      <div className="main">
      <h3 className="score"> Score: {this.state.score} </h3>




        <div style={{
                      textAlign: 'center',
                      margin: '0 auto',

                    }}>

         <h3 style={{textAlign:'center'}}>Find synonyms for <div style={{fontSize:'30px', color:'#964747'}}>{this.state.targetWord}</div></h3>
         <input type="text"
                    style={{marginBottom:'20px'}}
                    value={this.state.textboxVal}
                     onChange={this.handleTextChange}/>
        <button style={{
                         marginLeft:'10px',
                         background:'none',
                         border:'solid 2px #757B7D',
                         color:'#757B7D',
                         padding:'8px',
                         cursor:'pointer',
                         outline:'none',
                         borderRadius: '20px',

                      }}
                onClick={this.handleReset}>New Word</button>
        </div>


        <div style={style}>
          <div style={{
          maxWidth:'40%',
          display:'inline-block'
          }}>
            <ul style={{fontSize:this.state.listFont, color:this.state.listFontColor}}>
                {
                  this.state.synonyms.map((synonym) => <Synonym value={synonym} inputVal={this.state.textboxVal} />)
                }
            </ul>

          </div>



        </div>
      </div>
    );
  }
}
