import React from 'react';
import ReactDOM from 'react-dom';

var style = require('./style.scss');

import {songs} from './song-list.json'

import SortableMixin from 'sortablejs/react-sortable-mixin.js'

import {observable, autorun} from "mobx";

import {observer} from "mobx-react";

console.log('songs', typeof songs);

// mutable, observable data
var mutable = songs;
class Data {
  allsongs = observable(mutable) ;
  playlist = observable([{artist: 'XXYYXX', title: 'About You', image: 'http://a4.mzstatic.com/us/r30/Music62/v4/75/b4/77/75b4779c-75a4-acae-ecb1-23cbcc843df9/cover170x170.jpeg'}]);
}
var data = new Data();

var AllSongs = observer(React.createClass({
  mixins: [SortableMixin],

  sortableOptions: {
    ghostClass: "sortable-ghost",
    ref: "song",
    group: "shared",
    animation: 400,
    model: "songs"
  },

  getInitialState: function() {
    return { songs: data.allsongs };
  },

  addSong: function(ri) {
    return function() {
	var song = data.allsongs[ri];
      data.playlist.push(song);
      data.allsongs = data.allsongs.filter((x,i)=>(i !== ri));
      this.setState({songs:data.allsongs});
     
    }.bind(this)
  },

  render: function() {
    var that = this;
    
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
	    <div ref={i} className="song" key={i} onClick={that.addSong(i)}>
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
}));

var ApprovedSongs = React.createClass({
  mixins: [SortableMixin],
    sortableOptions: {
      ghostClass: "sortable-ghost",
      ref: "song",
      group: "shared",
      animation: 400,
      model: "songs",
  },

  handleAdd: function (evt) {
    if (evt.from.id !== 'playlist-el' ) {
      data.playlist.splice(evt.newIndex, 0, data.allsongs[evt.oldIndex]);
      data.allsongs = data.allsongs.filter((x,i)=>(i !== evt.oldIndex));
    }
  },
  
  handleRemove: function (evt) {
    if (data.playlist.length === 1) {
      return;
    }
    
    data.playlist = data.playlist.filter((x,i)=>(i !== evt.oldIndex));
  },

  handleSort: function (evt) {
    if (evt.from.id === 'playlist-el' ) {
      var old = data.playlist[evt.oldIndex];
      data.playlist = data.playlist.filter((x,i)=>(i !== evt.oldIndex));
      data.playlist.splice(evt.newIndex, 0, old);
    }
  },
  
  getInitialState: function() {
    return { songs: data.playlist };
  },

  remove: function(ri) {
    return function() {
      if (data.playlist.length === 1) {
	return;
      }
      data.playlist = data.playlist.filter((x,i)=>(i !== ri));
      this.setState({songs:data.playlist});
    }.bind(this)
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
      
      <div ref="song"  id="playlist-el" >{
	this.state.songs.map(function ({artist, title, image}, i) {
	  var firstlast = ((i === that.state.songs.length - 1) ? 'last' : 'notlast');
	  
          return (
	    <div className={"song approved-song " + firstlast} ref={i} key={i} >
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
