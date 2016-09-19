import React, {
  Component
}
from 'react';
import axios from 'axios';
import Synonym from './Synonym';

const transitionMillis = 2000;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      apiKey: '',
      targetWord: '',
      exampleSentence: 'this is an example sentence',
      definition: 'this is the definition',
      synonyms: [],
      score: 0,
      textboxVal: '',
      gameOpacity: 1,
      listFont: 0,
      listFontColor: '#964747'
    };
  }

  componentWillMount() {
    //this.handleReset();
  }

  handleTextChange = (evt) => {
    const textboxVal = evt.target.value;
    
    if(!this.state.apiKey) {
      this.setState({apiKey: textboxVal});
      setTimeout(this.handleReset, 0);
      return;
    }
    
    this.setState({
      textboxVal: textboxVal,
      // synonyms: this.state.synonyms,
    });

    // this mutates the underlying state object
    // but we're not telling React that it updated so we need either
    // forceUpdate() or the this.setState below
    this.state.synonyms.forEach((synonym) => {
      if ((synonym.val == textboxVal) && !synonym.guessed) {
        synonym.guessed = true;
        this.setState({
          score: this.state.score + 1
        });
        this.setState({
          textboxVal: ''
        });
      }
    });
    // if all synonyms have been guessed, reset
    let allGuessed = true;

    this.state.synonyms.forEach((synonym) => {
      return allGuessed = allGuessed && synonym.guessed;
    });

    if (allGuessed) {
      this.setState({
        gameOpacity: 0
      });
      setTimeout(this.handleReset, transitionMillis);
    }


  }

  handleReset = () => {
    this.setState({
      textboxVal: '',
      synonyms: [],
      gameOpacity: 1,
      listFont: 0,
      listFontColor: '#964747'
    });


    axios.get('https://wordsapiv1.p.mashape.com/words/', {
        headers: {
          'X-Mashape-Authorization': this.state.apiKey
        },
        params: {
          random: 'true',
          hasDetails: 'synonyms,examples'
        }
      })
      .then(({ data }) => {
        console.log(data);

        const wordData = data.results
          .filter(o => o.synonyms)
          .sort((a, b) => b.synonyms.length - a.synonyms.length)[0];

        const {
          examples,
          definition,
          synonyms
        } = wordData;


        this.setState({
          targetWord: data.word,
          exampleSentence: examples && examples[0],
          definition,
          listFont: '25px',
          synonyms: synonyms.map(newSynonym => ({
            val: newSynonym,
            guessed: false
          }))
        });
        
        setTimeout(()=>this.setState({listFontColor:'#D3EDED'}),1000);

      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  render() {
    const style = {

      textAlign: 'center',
      fontSize: '25px',
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
         <h6 style={{textAlign:'center'}}>{this.state.exampleSentence || this.state.definition}</h6>
         <h6> </h6>
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
                onClick={this.handleReset}>{this.state.apiKey ? 'New Word' : 'Set API Key'}</button>
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
