import React from 'react';
import marked from 'marked'

const SCROLL_DIFF = 10

export default React.createClass({
  getInitialState() {
    return {
      text: '',
      fontSize: 16,
      scheme: 'black',
      files: [],
      lastScrollTop: 0,
      isHeaderHidden: false
    }
  },

  handleFileInputChange(evt){
    const { files } = evt.target, filesArr = []

    for (let i = 0; i < files.length; i++) {
      filesArr.push(files[i])
    }

    Promise.all(filesArr.map(file => { return this.convertToMarkdown(file) })).then(htmlFiles => {
      this.setState({files: htmlFiles, text: htmlFiles[0].text})
    })
  },

  handleFontMinusClick() {
    this.setState({fontSize: this.state.fontSize - 1})
  },

  handleFontPlusClick() {
    this.setState({fontSize: this.state.fontSize + 1})
  },

  handleSchemeSelect(scheme) {
    return e => { this.setState({scheme: scheme}) }
  },

  handleFileSelect(e) {
    const { value } = e.currentTarget
    const file = this.state.files[value]
    if(file) this.setState({text: file.text})
  },

  convertToMarkdown(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader()
      reader.onerror = e => { rej(e) }
      reader.onload = e => {
        const {result} = e.target;
        try {
          const htmlRes = marked(result);
          res({name: file.name, text: htmlRes})
        }
        catch(err) {
          rej(err)
        }
      }
      reader.readAsText(file)
    })
  },

  handleContentScroll(e) {
    const { scrollTop } = e.currentTarget
    const { lastScrollTop, isHeaderHidden } = this.state

    if((scrollTop - lastScrollTop > SCROLL_DIFF) && !isHeaderHidden) {
      this.setState({isHeaderHidden: true})
    }
    if((scrollTop - lastScrollTop < -SCROLL_DIFF || scrollTop == 0) && isHeaderHidden) {
      this.setState({isHeaderHidden: false})
    }

    this.setState({lastScrollTop: scrollTop})
  },

  schemeActive(scheme) {
    return scheme == this.state.scheme ? ' is-active' : ''
  },

  render() {
    const { text, fontSize, scheme, files, isHeaderHidden} = this.state;
    let fileList=[], select=null;
    let content=<div className={'Content Content--empty Content--' + scheme} style={{fontSize: fontSize}}>Please select files</div>;

    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      fileList.push(<option value={i} key={"file" + i} className="File">{file.name}</option>)
    }

    if(files.length) {
      select = <select className="Files" onChange={this.handleFileSelect}> { fileList } </select>
      content = <div className={'Content Content--' + scheme} style={{fontSize: fontSize}} onScroll={this.handleContentScroll}>
        <div dangerouslySetInnerHTML={ {__html: text} } ></div>
      </div>
    }

    return (
      <div className='AppWrapper'>
        <div className={'Header' + (isHeaderHidden ? ' is-hidden' : '')}>
          <h1>ReaMDer</h1>
          <div className='Buttons'>
            <div className='Button Button--fontMinus' onClick={this.handleFontMinusClick}> Aa </div>
            <div className='Button Button--fontPlus' onClick={this.handleFontPlusClick}> Aa </div>
            <div className={"Scheme Scheme--black" + this.schemeActive('black')} onClick={this.handleSchemeSelect('black')}> </div>
            <div className={"Scheme Scheme--white" + this.schemeActive('white')} onClick={this.handleSchemeSelect('white')}> </div>
            <div className={"Scheme Scheme--yellow" + this.schemeActive('yellow')} onClick={this.handleSchemeSelect('yellow')}> </div>
          </div>
          <label className="Button FileUpload">
            Select Files
            <input type='file' ref='fileInput' multiple onChange={this.handleFileInputChange}/>
          </label>
          {select}
        </div>
        {content}
      </div>
    )
  }
})
