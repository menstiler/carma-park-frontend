import React from 'react';
import { connect } from 'react-redux'
import { ActionCable } from 'react-actioncable-provider';
import { handleReceivedMessage } from '../actions'

const Cable = ({ chatrooms, handleReceivedMessage }) => {
  return (
    <>
      {chatrooms.map(function(chatroom, index) {
        return (
          <ActionCable
            key={index}
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
