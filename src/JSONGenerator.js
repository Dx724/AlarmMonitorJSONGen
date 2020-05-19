import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import ColumbiaLogo from "./Columbia_University_Logo-white.png";


const PageContainerDiv = styled.div`
  position: relative;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  background-color: #022169;
  width: 100%;
  height: 7vh;
  justify-content: flex-end;
  align-items: center;
`;

const Logo = styled.img`
  height: 4vh;
  width: auto;
  padding-right: 5px;
`;

const TabContainer = styled.div`
  padding-left: 20px;
  padding-right: 20px;
`;

const TabBarContainer = styled.div`
  padding-bottom: 10px;
`;

class JSONGenerator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numRooms: 0,
            numStreams: 0,
            roomValue: '',
            streamValue: '',
            streamAddressValue: '',
            inRoom: true,
            inStream: false,
            currentRoom: "None"
        }
        this.json_text = "{\n  \"rooms\": [\n    {\n";
        this.firstRoom = true;
        this.firstStreamInRoom = true;
        this.inRoom = true;
        this.inStream = false;

        this.appendText = this.appendText.bind(this);
        this.handleRoomChange = this.handleRoomChange.bind(this);
        this.handleStreamChange = this.handleStreamChange.bind(this);
        this.handleStreamAddressChange = this.handleStreamAddressChange.bind(this);
        this.addObject = this.addObject.bind(this);
        this.download = this.download.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    appendText(text) {
        this.json_text = this.json_text + text;
    }

    handleRoomChange(event) {
        this.setState({roomValue: event.target.value});
    }

    handleStreamChange(event) {
        this.setState({streamValue: event.target.value});
    }

    handleStreamAddressChange(event) {
        this.setState({streamAddressValue: event.target.value});
    }

    addObject(addingRoom) {
        if (this.state.inRoom) {
            let toAppend = "      \"identifier\": \"" + this.state.roomValue + "\",\n      \"streams\": [\n";
            if (this.firstRoom) {
                this.appendText(toAppend);
                this.firstRoom = false;
            }
            else {
                let begin = "\n      ]\n    },\n    {\n";
                this.appendText(begin + toAppend);
            }
            this.setState({
              currentRoom: this.state.roomValue
            });
        }
        else {
            let toAppend = "        {\n          \"name\": \"" + this.state.streamValue + "\",\n          \"streamLink\": \"" +
            this.state.streamAddressValue + "\"\n        }";
            if (this.firstStreamInRoom) {
                this.appendText(toAppend)
                this.firstStreamInRoom = false;
            }
            else {
                let begin = ",\n";
                this.appendText(begin + toAppend);
            }
        }

        this.setState({
            roomValue: '',
            streamValue: '',
            streamAddressValue: '',
            inRoom: addingRoom,
            inStream: !addingRoom
        });

        if (addingRoom) {
            this.firstStreamInRoom = true;
            this.setState({
              inRoom: false,
              inStream: true
            })
        }
    }

    download(event) {
        event.preventDefault();
        this.addObject();
        this.appendText("\n      ]\n    }\n  ]\n}\n");
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.json_text));
        element.setAttribute('download', 'streamInfo.json');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
        this.setState({inRoom: false, inStream: false});
        this.json_text = "{\n  \"rooms\": [\n    {\n";
    }

    handleTabChange(event, index) {
      var iRoom = (index === 0);
      this.setState({
        inRoom: iRoom,
        inStream: !iRoom
      });
    }

    render() {

        const buttons = 
            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                {this.state.inRoom
                  ? <Button onClick={() => this.addObject(true)}>Add Room</Button>
                  : <Button onClick={() => this.addObject(false)}>Add Stream</Button>
                }
                <Button onClick={this.download}>Finish and download</Button>
            </ButtonGroup>

        const roomForm = 
            <form noValidate autoComplete="off">
                <TextField id="room_name_input" name="roomName" label="Room name" value={this.state.roomValue} onChange={this.handleRoomChange} />
                {buttons}
            </form>;

        const streamForm = 
            <form noValidate autoComplete="off">
                <p>Current Room: {this.state.currentRoom}</p>
                <TextField id="stream_name_input" name="streamName" label="Stream name" value={this.state.streamValue} onChange={this.handleStreamChange} />
                <TextField id="stream_link_input" name="streamLink" label="Stream link" value={this.state.streamAddressValue} onChange={this.handleStreamAddressChange} />
                {buttons}
            </form>;

        
        var form;
        if (this.state.inRoom) {
            form = roomForm;
        }
        else {
            if (this.state.inStream){
                form = streamForm;
            }
            else {
                form = <h2>Downloaded!</h2>
            }
        }

        return (
            <PageContainerDiv>
                <TabContainer>
                  <h2>Welcome to JSON Generator</h2>
                  <TabBarContainer>
                    <AppBar value="mainTabs" position="static">
                      <Tabs value={(this.state.inRoom === true) ? 0 : 1} onChange={this.handleTabChange} aria-label="simple tabs example">
                        <Tab label="Rooms"/>
                        <Tab label="Streams"/>
                      </Tabs>
                    </AppBar>
                  </TabBarContainer>
                  {form}
                </TabContainer>
                
                <Footer>
                    <Logo src={ColumbiaLogo} alt="Columbia Logo" />;
                </Footer>
            </PageContainerDiv>
        );
    }
}

export default JSONGenerator;