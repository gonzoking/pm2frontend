import React from "react";

import fs from 'fs';

export class LogBlock extends React.Component {
    constructor(props) {
        super(props);

        this.getLogFileSize = this.getLogFileSize.bind(this);
        this.watchLogs = this.watchLogs.bind(this);
        this.loadFirstTime = this.loadFirstTime.bind(this);
        this.proccessText = this.proccessText.bind(this);
        this.splitQueryParams = this.splitQueryParams.bind(this);
        this.loadNextOne = this.loadNextOne.bind(this);
        this.state = {infolog: ''};

        this.splitQueryParams();

        this.lastLength = 0;
        this.getLogFileSize();
    }

    watchLogs(){
        fs.watchFile(this.infologpath, (stats) =>  {
            if (stats) {
                this.lastLength = stats.size;
                this.loadNextOne();
            }
        });
    }

    splitQueryParams(){
        let params = global.location.search.split("&");
        this.name = params[0].split("=")[1];
        //this.errpath = params[1].split("=")[1];
        //this.infologpath = params[2].split("=")[1];
        this.logType = params[3].split("=")[1];
        this.infologpath = this.logType === 'info' ? params[2].split("=")[1] : params[1].split("=")[1];

    }

    loadNextOne(){
        this.start = this.end;
        this.end = this.lastLength;

        var stream = fs.createReadStream(this.infologpath,{'start': this.start,'end': this.end});

        stream.on('data',(buf) =>{
            this.lastLength = this.lastLength + buf.toString().length;
            this.setState({infolog: this.proccessText(this.state.infolog + buf.toString())});
        });
    }

    loadFirstTime() {
        this.start = this.lastLength > 1000 ? this.lastLength - 1000 : 0;
        this.end = this.lastLength;
        var stream = fs.createReadStream(this.infologpath,{'start': this.start,'end': this.end});

        stream.on('data',(buf) =>{
            this.lastLength = this.lastLength + buf.toString().length;
            this.setState({infolog: this.proccessText(buf.toString())});
        });

        stream.on('end', () => {
            this.watchLogs();
        });

    }

    proccessText(text){
        if(this.logType === 'info') {
            text = text.replace(/info/g, `<span style='color:green'><b>info</b></span>`);
            text = text.replace(/\n/g, `<br/>`);
            text = text.replace(/\[32m/g, ``);
            text = text.replace(/0xE2\[39m/g, ``);
        }else {
            text = text.replace(/error/g, `<span style='color:red'><b>error</b></span>`);
            text = text.replace(/\n/g, `<br/>`);
            text = text.replace(/\[31m/g, ``);
            text = text.replace(/0xE2\[39m/g, ``);
        }
        return text;
    }

    getLogFileSize(){

        var file = fs.createReadStream(this.infologpath);

        file.on('data', (chunk) => {
            this.lastLength = this.lastLength + chunk.length;
        });
        file.on('end', () => {
            this.loadFirstTime();
        });
    }

    render() {
        return (
            <div className="logs">
                <p><b>{this.name} - {this.logType === 'info' ? 'Info Log' : 'Error Log'}</b></p>
                <div className={this.logType === 'info' ? 'logs__info logs__box' : 'logs__err logs__box'} dangerouslySetInnerHTML={{__html: this.state.infolog}}>

                </div>
            </div>
        );
    }
}

export default LogBlock;