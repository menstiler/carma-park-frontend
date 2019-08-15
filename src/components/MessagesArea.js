import React from 'react';
import NewMessageForm from './NewMessageForm';
import { connect } from 'react-redux'


const MessagesArea = ({
  chatroom: { id, title, messages },
}) => {
  return (
    <div className="messagesArea">
      <h2>{title}</h2>
      <ul>{orderedMessages(messages)}</ul>
      <NewMessageForm chatroom_id={id} />
    </div>
  );
};

export default MessagesArea;

const orderedMessages = (messages, users) => {
  debugger;
  const sortedMessages = messages.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  return sortedMessages.map(message => {
    return <li key={message.id}>{message.content} - {message.user.name}</li>;
  });
};
