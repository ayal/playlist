import React from 'react';
import ReactDOM from 'react-dom';

var style = require('./style.scss');
import {songs} from './song-list.json'

export class App extends React.Component {
	render() {

		return <h1>Hello World</h1>;
	}
}

ReactDOM.render(<App/>, document.getElementById("myApp"));
