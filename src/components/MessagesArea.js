import React, { useRef, useEffect } from 'react';
import { Card, Feed, Icon } from 'semantic-ui-react'
import moment from 'moment'

const MessagesArea = ({
  chatroom: { id, title, messages},
  currentUser,
}) => {

  const messagesEnd = useRef(null)

  useEffect(() => {
    if (messagesEnd && messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ 
        behavior: "smooth",
      });
    }
  }, [messages])

  if (messages.length) {
    return (
      <Card.Content className="chat-container" >
        <Feed>
        <div className="messages-area" >
          {orderedMessages(messages, currentUser)}
          <div ref={messagesEnd} ></div>
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
    let received = message.user.id !== currentUser.id
    let time = moment(message.created_at)
    return (
      <Feed.Event key={message.id} className={received ? "message-received" : null}>
        <Feed.Content>
          <Feed.Extra text>
           {message.content}
          </Feed.Extra>
        </Feed.Content>
        <Feed.Meta>
          <Feed.User>
            {
              message.user.user_image.content
              ?
              <img className="ui avatar image" src={`data:image/jpeg;base64,${message.user.user_image.content}`} />
              :
              null
            }
            <div>
              {received ? message.user.name : "You"}
              <Feed.Meta>{moment(time, 'YYYY-MM-DD hh:mm:ss').fromNow()}</Feed.Meta>
            </div>
          </Feed.User>
        </Feed.Meta>
      </Feed.Event>
    )
  });
};
