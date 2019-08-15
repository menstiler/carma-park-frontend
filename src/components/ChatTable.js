import React from 'react'
import { connect } from 'react-redux'
import MessagesArea from './MessagesArea'

function ChatTable(props) {
  console.log(props);
  debugger
  return (
    <MessagesArea
      chatroom={findActiveChatroom(
      props.chats,
      props.activeChat
      )}
    />
  )
}

const findActiveChatroom = (chatrooms, activeChatroom) => {
  return chatrooms.find(
    chatroom => chatroom.space === activeChatroom.space
  );
};

function msp(state) {
  return {
    activeChat: state.user.activeChat,
    chats: state.user.chats
  }
}

export default connect(msp, {

})(ChatTable);
