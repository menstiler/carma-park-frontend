import React from 'react'
import { connect } from 'react-redux'
import MessagesArea from './MessagesArea'
import NewMessageForm from './NewMessageForm';
import { Card, Feed, Icon } from 'semantic-ui-react'
import '../styles/messaging.scss'

const ChatTable = (props) => {
  return (
    <Card className="chat-card">
      <MessagesArea
        chatroom={findActiveChatroom(
        props.chats,
        props.activeChat
        )}
        currentUser={props.currentUser}
      />
      <NewMessageForm chatroom_id={findActiveChatroom(
        props.chats,
        props.activeChat).id} />
    </Card>
  )
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
