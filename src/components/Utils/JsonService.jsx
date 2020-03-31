import React, { Component } from 'react'
import fs from 'brfs'

export class JsonService extends Component {
    ReadJson(path) {
        // http://localhost:3000
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(json => {
                this.workflows = json;
            })
    }

    Loadfiles () {
        // In newer Node.js versions where process is already global this isn't necessary.
        var dirName = '/Development/react/storm-react-digrams/src/workflows';
        var fileButtons = [];
        var fs = require('fs');
        var files = fs.readdirSync(dirName);
        files.foreach(element => {
            console.log(element);
        });
        // }));
        return  <button onClick={this.ReadJson(this.value)}>{dirName}</button>;
    }
    render(){
        return this.Loadfiles();
    }
}