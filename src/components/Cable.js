import React from 'react';
import { connect } from 'react-redux'
import { ActionCable } from 'react-actioncable-provider';
import { handleReceivedMessage } from '../actions/actions'

const Cable = ({ chatrooms, handleReceivedMessage }) => {
  return (
    <>
      {chatrooms.map(chatroom => {
        return (
          <ActionCable
            key={chatroom.id}
            channel={{ channel: 'MessagesChannel', chatroom: chatroom.id }}
            onReceived={handleReceivedMessage}
          />
        );
      })}
    </>
  );
};

export default connect(null, {
  handleReceivedMessage
})(Cable);
