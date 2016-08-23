import React from 'react';
import ReactDOM from 'react-dom';

var style = require('./style.scss');

import {songs} from './song-list.json'

import SortableMixin from 'sortablejs/react-sortable-mixin.js'

var AllSongs = React.createClass({
  mixins: [SortableMixin],

  sortableOptions: {
    ref: "song",
    group: "shared",
    animation: 1000,
    model: "songs"
  },

  getInitialState: function() {
    return { songs };
  },

  render: function() {
    return (<div className="all-songs song-list">
      <div className="header">
      <span className="icon-search"></span>
      <span className="line dotted"></span>
      </div>
      <div className="header">
      <h1>My Song List</h1>
      <span className="line dotted"></span>
      </div>
      <div ref="song">{
        this.state.songs.map(function ({artist, title, image}, i) {
          return (
	    <div ref={i} className="song" key={i} >
	    <div>
	    <div className="arrow-left"></div>
	    <span className="line"><span className="circle"></span></span>
	    <span>{artist + ' - ' + title}</span>
	    <span>
	    <img src={image} />
	    </span>
	    </div>
	    </div>
	  );
        })
      }</div>
      </div>
    );
  }
});

var ApprovedSongs = React.createClass({
  mixins: [SortableMixin],
  sortableOptions: {
    ref: "song",
    group: "shared",
    animation: 400,
    model: "songs"
 },

  getInitialState: function() {
    return { songs: [{artist: 'XXYYXX', title: 'About You', image: 'http://a4.mzstatic.com/us/r30/Music62/v4/75/b4/77/75b4779c-75a4-acae-ecb1-23cbcc843df9/cover170x170.jpeg'}] };
  },

  remove: function(ri) {
    return function() {
      this.setState({songs:this.state.songs.filter((x,i)=>(i !== ri))});
    }.bind(this)
  },

  componentWillUpdate: function(np,ns) {
    // keep list with something
    if (ns.songs.length === 0) {
      ns.songs = [{artist: 'Never Gonna Give You Up', title: 'Rick Astley', image: 'http://a1.mzstatic.com/us/r30/Music/v4/f6/fb/02/f6fb0292-6d51-e3c3-deb6-5d7a07ac6efe/cover170x170.jpeg'}];
    }
  },
  
  render: function() {
    var that = this;

    console.log('PLAYLIST IS\n\n', this.state.songs.map((x)=>(x.artist + ' - ' + x.title)).join('\n'));
    
    return (
      <div className="approved-songs song-list">
      
      <div className="header">
      <h1>My Playlist</h1>
      <div><span className="line"><span className="circle"></span></span></div>
      </div>
      
      <div ref="song">{
	this.state.songs.map(function ({artist, title, image}, i) {
	  var firstlast = ((i === that.state.songs.length - 1) ? 'last' : 'notlast');
	  
          return (
	    <div className={"song approved-song " + firstlast} ref={i} key={i}>
	    <div>
	    <span className="line"><span className="circle">{i + 1}</span></span>
	    <span className={"icon-trash " + (that.state.songs.length === 1 ? 'transp' : '')} onClick={that.remove(i)} ></span>
	    <span>{artist + ' - ' + title}</span>
	    <span>
	    <img src={image} />
	    </span>
	    <span className="icon-dots"></span>
	    </div>
	    </div>
	  )
	})
      }</div>
      </div>
    )
  }
});



export class App extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="lists row">
      <div className="col col-md-6">
      <AllSongs />
      </div>
      <div className="col col-md-6">
      <ApprovedSongs />
      </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById("myApp"));
