import React from 'react';
import { Button, Table, Icon }  from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux'
import {
  handleNotificationDismiss,
  deleteAllNotifications
} from '../actions/notification'
import { withRouter } from 'react-router-dom';

const Notifications = (props) => {
  if (props.notifications.length) {
    return (
      <>
        <Table>
          <Table.Header fullWidth>
            <Table.Row>
              <Table.HeaderCell>  
                Message
              </Table.HeaderCell>
              <Table.HeaderCell colSpan="2">
                Time
              </Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              _.orderBy(props.notifications, ['created_at'], ['desc'])
              .map(notification => {
                return (
                  <Table.Row key={notification.id}>
                    <Table.Cell>{notification.message}</Table.Cell>
                    <Table.Cell> 
                    {
                      moment(notification.created_at).format('L h:mm:ss a')
                    }
                    </Table.Cell>
                    <Table.Cell textAlign='center'>
                      <Button size='small' onClick={() => props.handleNotificationDismiss(notification.id)}>Delete</Button>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
        <div className="notification-footer">
          <Button
            floated='left'
            icon
            labelPosition='left'
            primary
            size='small'
            onClick={() => props.deleteAllNotifications(props.currentUser.id)}
          >
            <Icon name='trash' />Delete All
          </Button>  
        </div>
      </>
    )
  } else {
    return <div className="empty">No Notifications</div>
  }
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    notifications: state.user.notifications,
  }
}

export default withRouter(connect(msp, {
  deleteAllNotifications,
  handleNotificationDismiss,
})(Notifications));

