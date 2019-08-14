import React from 'react';
import { ActionCable } from 'react-actioncable-provider'
import { connect } from 'react-redux'
// import actions!
import Cable from './Cable'
import NewChatroomForm from './NewChatroomForm'
import MessagesArea from './MessagesArea'
import { API_ROOT } from '../constants'
import {

} from '../actions'

class Chatroom extends React.Component {

  state = {
    chatrooms: [],
    activeChatroom: null
  }

  componentDidMount = () => {
    fetch(`${API_ROOT}/chatrooms`)
      .then(res => res.json())
      .then(chatrooms => this.setState({ chatrooms }));
  };

  handleClick = id => {
    this.setState({ activeChatroom: id });
  };

  handleReceivedChatroom = response => {
    const { chatroom } = response;
    this.setState({
      chatrooms: [...this.state.chatrooms, chatroom]
    });
  };

  handleReceivedMessage = response => {
    const { message } = response;
    const chatrooms = [...this.state.chatrooms];
    const chatroom = chatrooms.find(
      chatroom => chatroom.id === message.chatroom_id
    );
    chatroom.messages = [...chatroom.messages, message];
    this.setState({ chatrooms });
  };

  render() {
    const { chatrooms, activeChatroom } = this.state;
    return (
      <div className="chatroomsList">
        <ActionCable
          channel={{ channel: 'ChatroomsChannel' }}
          onReceived={this.handleReceivedChatroom}
        />
        {this.state.chatrooms.length ? (
          <Cable
          chatrooms={chatrooms}
          handleReceivedMessage={this.handleReceivedMessage}
          />
        ) : null}
        <h2>Chatrooms</h2>
        <ul>{mapChatrooms(chatrooms, this.handleClick)}</ul>
        <NewChatroomForm />
        {activeChatroom ? (
          <MessagesArea
            chatroom={findActiveChatroom(
            chatrooms,
            activeChatroom
            )}
          />
        ) : null}
      </div>
   );
  }
}

const findActiveChatroom = (chatroooms, activeChatroom) => {
  return chatroooms.find(
    chatroom => chatroom.id === activeChatroom
  );
};

const mapChatrooms = (chatroooms, handleClick) => {
  return chatroooms.map(chatroom => {
    return (
      <li key={chatroom.id} onClick={() => handleClick(chatroom.id)}>
        {chatroom.title}
      </li>
    );
  });
};

function msp(state) {
  return {

  }
}

export default connect(msp, {

})(Chatroom);
