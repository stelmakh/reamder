import React from 'react';
import marked from 'marked'

const schemes = {
  'black': {'color': '#f0f0f0', 'background': '#333'},
  'yellow': {'color': '#333', 'background': '#ffefce'},
  'white': {'color': '#333', 'background': '#f0f0f0'},
}

export default React.createClass({
  getInitialState() {
    return {
      text: '',
      htmlText: '',
      fontSize: 14,
      scheme: 'black',
      files: []
    }
  },
  componentDidMount() {
  },
  handleFileInputChange(evt){
    const { files } = evt.target
    console.log(files)
    this.setState({files: files})
    this.convertToMarkdown(files[0]).then((res) => {
      this.setState({htmlText: res})
    })
  },
  handleFontMinusClick() {
    this.setState({fontSize: this.state.fontSize - 1})
  },
  handleFontPlusClick() {
    this.setState({fontSize: this.state.fontSize + 1})
  },
  handleSchemeSelect(scheme) {
    return e => {
      this.setState({scheme: scheme})
    }
  },
  handleFileSelect(i) {
    return e => {
      const file = this.state.files[i]
      this.convertToMarkdown(file).then((res) => {
        this.setState({htmlText: res})
      })
    }
  },
  convertToMarkdown(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader()
      reader.onload = e => {
        let {result} = e.target;
        let htmlRes = marked(result);
        res(htmlRes)
      }
      reader.readAsText(file)
    })
  },
  schemeActive(scheme) {
    return scheme == this.state.scheme ? ' is-active' : ''
  },
  render() {
    let { htmlText, fontSize, scheme, files} = this.state;
    let {color, background} = schemes[scheme]
    let fileList = []
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      fileList.push(<div key={"file" + i} className="File" onClick={this.handleFileSelect(i)}>{file.name}</div>)
    }
    return (
      <div className='AppWrapper'>
        <div className='Header'>
          <h1>Read</h1>
          <input type='file' ref='fileInput' multiple onChange={this.handleFileInputChange}/>
          <div className='Buttons'>
            <div className='Button' onClick={this.handleFontMinusClick}>
              Font -
            </div>
            <div className='Button' onClick={this.handleFontPlusClick}>
              Font +
            </div>
            <div className={"Button" + this.schemeActive('black')} onClick={this.handleSchemeSelect('black')}>
              BLK
            </div>
            <div className={"Button" + this.schemeActive('white')} onClick={this.handleSchemeSelect('white')}>
              WHT
            </div>
            <div className={"Button" + this.schemeActive('yellow')} onClick={this.handleSchemeSelect('yellow')}>
              YLW
            </div>
          </div>
          <div className="Files"> { fileList } </div>
        </div>
        <div className='Content' style={{fontSize: fontSize, color: color, background: background}}>
          <div dangerouslySetInnerHTML={ {__html: htmlText} } ></div>
        </div>
      </div>
    )
  }
})
