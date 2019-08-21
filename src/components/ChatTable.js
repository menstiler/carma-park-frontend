import React from 'react'
import { connect } from 'react-redux'
import MessagesArea from './MessagesArea'
import NewMessageForm from './NewMessageForm';
import { Card, Feed, Icon } from 'semantic-ui-react'

class ChatTable extends React.Component {

  componentDidUpdate() {
    let objDiv = document.querySelector(".chat-container");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }

  render() {
    return (
      <Card>
        <MessagesArea
          chatroom={findActiveChatroom(
          this.props.chats,
          this.props.activeChat
          )}
          currentUser={this.props.currentUser}
        />
        <NewMessageForm chatroom_id={findActiveChatroom(
        this.props.chats,
        this.props.activeChat).id} />
      </Card>
    )
  }

}

const findActiveChatroom = (chatrooms, activeChatroom) => {
  return chatrooms.find(
    chatroom => chatroom.space === activeChatroom
  );
};

function msp(state) {
  return {
    activeChat: state.user.activeChat,
    chats: state.user.chats,
    currentUser: state.user.currentUser
  }
}

export default connect(msp, {

})(ChatTable);
