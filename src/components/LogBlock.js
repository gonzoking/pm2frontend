import React from "react";
import Main from "./Main";
import fs from 'fs';

export class LogBlock extends React.Component {
    constructor(props) {
        super(props);

        this.loadFromInfoLog = this.loadFromInfoLog.bind(this);
        this.state = {infolog: ''};
        let params = global.location.search.split("&");
        this.name = params[0].split("=")[1];
        this.errpath = params[1].split("=")[1];
        this.infologpath = params[2].split("=")[1];
        this.loadFromInfoLog();
    }

    loadFromInfoLog(){
        var readOptions = { 'flags': 'r'
            , 'encoding': 'utf-8'
            , 'mode': '0666'
            , 'bufferSize': 4 * 1024
        };
        var file = fs.createReadStream(this.infologpath, readOptions);

        file.on('data', (chunk) => {
            var stream = null;
            this.setState({infolog: chunk});
            /*while(null !== (stream = file.read()))  {
                this.setState({infolog: stream.toString()});
                console.log(stream);
            }*/
        });


    }

    render() {
        return (
            <div className="logs">
                <p><b>{this.name}</b></p>
                <div className="logs__info">
                    {this.state.infolog}
                </div>
            </div>
        );
    }
}

export default LogBlock;