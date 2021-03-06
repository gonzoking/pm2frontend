import React from "react";
import TextField from 'material-ui/TextField';
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
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.state = {infolog: '', search:''};

        this.splitQueryParams();

        this.lastLength = 0;
        this.getLogFileSize();
        this.originText = '';
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
            text = text.replace(/.\[32m/g, ``);
        }else {
            text = text.replace(/error/g, `<span style='color:red'><b>error</b></span>`);
            text = text.replace(/\n/g, `<br/>`);
            text = text.replace(/.\[31m/g, ``);
        }
        text = text.replace(/.\[39m/g, ``);
        this.originText = text;
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

    handleSearchChange(event) {
        if(event.target.value === '') {
            this.setState({
                infolog: this.originText,
                search: event.target.value
            });
            return;
        }
        const replace = event.target.value;
        var re = new RegExp(replace,'g');

        let text = this.originText !== ''? this.originText : this.state.infolog;
        text = text.replace(re, `<span style='color:orange'><b>${event.target.value}</b></span>`);
        this.setState({
            infolog: text,
            search: event.target.value
        });
    }

    render() {
        return (
            <div className="logs">
                <p><b>{this.name} - {this.logType === 'info' ? <span style={{color:'green'}}>Info Log</span> : <span style={{color:'red'}}>Error Log</span>}</b></p>
                <TextField value={this.state.search} hintText="Search text" style={{marginTop:'0'}}  onChange={this.handleSearchChange}  style={{width:'540px'}} />
                <div className="logs__box" dangerouslySetInnerHTML={{__html: this.state.infolog}}>

                </div>
            </div>
        );
    }
}

export default LogBlock;