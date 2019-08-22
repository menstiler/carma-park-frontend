import React from 'react';
import { Card, Feed, Icon } from 'semantic-ui-react'
import moment from 'moment'

const MessagesArea = ({
  chatroom: { id, title, messages},
  currentUser
}) => {
  if (messages.length) {
    return (
      <Card.Content className="chat-container" >
        <Feed>
        <div className="messagesArea" >
          {orderedMessages(messages, currentUser)}
        </div>
        </Feed>
      </Card.Content>
    );
  } else {
    return null
  }
};

export default MessagesArea;

const orderedMessages = (messages, currentUser) => {
  const sortedMessages = messages.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  return sortedMessages.map(message => {
    let received = message.user.id !== currentUser
    let time = moment(message.created_at)
    return (
      <Feed.Event key={message.id} className={received ? "message-received" : null}>
        <Feed.Content>
          <Feed.Extra text>
           {message.content}
          </Feed.Extra>
          <Feed.Meta>
          {received
            ?
            <Feed.User>{message.user.name}</Feed.User>
            :
            null
          }
          </Feed.Meta>
          <Feed.Meta>{moment(time, 'YYYY-MM-DD hh:mm:ss').fromNow()}</Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    )
  });
};
