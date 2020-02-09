import React, { Component } from 'react'
import {
  connect
} from 'react-redux'
import { Button, Form, Input, Item, Label, Tab, Table, Icon, Dropdown }  from 'semantic-ui-react'
import {
  editUser,
  deleteUserSpace,
  deleteAllUserSpaces,
  deleteAccount
} from '../actions/user'
import {
  showSpace
} from '../actions/actions'
import {
  handleNotificationDismiss,
  deleteAllNotifications
} from '../actions/notification'
import Map from './Map'
import '../styles/profile.scss'
import moment from 'moment'

class Profile extends Component {
 
  constructor(props) {
    super(props)
    if (props.currentUser) {
      this.state = {
        name: this.props.currentUser.name,
        username: this.props.currentUser.username,
        password: "",
        filter: null,
      }
    } else {
      this.props.routerProps.history.push('/')
    }
  }

  handleFilter = (e, type) => {
    this.setState({
      filter: type.value
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.editUser(this.state, this.props.currentUser.id)
  }

  findPerson(id) {
    return this.props.users.find(user => user.id === id);
  }

  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  panes = [
    {
      menuItem: 'Activity',
      render: () => <Tab.Pane key="0">{this.renderUsersSpaces()}</Tab.Pane>,
    },
    {
      menuItem: 'Notifications',
      render: () => <Tab.Pane key="1">{this.renderUserNotifications()}</Tab.Pane>
    },
    {
      menuItem: 'Active Space',
      // render: () => <Tab.Pane key="2">{this.renderFavorite()}</Tab.Pane>
    },
  ]

  renderUserNotifications = () => {
    if (this.props.notifications.length) {
      return (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>  
                Message
              </Table.HeaderCell>
              <Table.HeaderCell>
                Time
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Button
                  floated='right'
                  icon
                  labelPosition='left'
                  primary
                  size='small'
                  onClick={() => this.props.deleteAllNotifications(this.props.currentUser.id)}
                >
                <Icon name='trash' />Delete All
              </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              this.props.notifications.map(notification => {
                return (
                  <Table.Row key={notification.id}>
                    <Table.Cell>{notification.message}</Table.Cell>
                    <Table.Cell> 
                    {
                      moment(notification.created_at).format('L h:mm:ss a')
                    }
                    </Table.Cell>
                    <Table.Cell textAlign='center'>
                      <Button size='small' onClick={() => this.props.handleNotificationDismiss(notification.id)}>Delete</Button>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
      )
    } else {
      return <div>No notifications</div>
    }
  }

  openUserSpace = () => {

  }

  filterUserSpaces = () => {
    return this.props.userSpaces.filter(userSpace => {
      switch(this.state.filter) {
        case 'all': 
          return userSpace
        case 'active':
          return userSpace.space.available
        case 'created':
          return userSpace.status === 'created' 
        case 'claimed':
          return userSpace.status === 'claimed' 
        case 'parked':
          return userSpace.status === 'parked'
        case 'cancled':
          return userSpace.status === 'cancled' 
        default:
          return userSpace
      }
    });
  }

  openUserSpace = (space) => {
   this.props.showSpace(space);
   this.props.routerProps.history.push('/')
  }

  renderUsersSpaces = () => {
    let usersSpaces = this.filterUserSpaces();
    let filterOptions = [
      {
        key: 0,
        text: "All",
        value: 'all',
      },
      {
        key: 1,
        text: "Active",
        value: 'active',
      },
      {
        key: 2,
        text: "Created",
        value: 'created',
      },
      {
        key: 3,
        text: "Claimed",
        value: 'claimed',
      },
      {
        key: 4,
        text: "Parked",
        value: 'parked',
      },
      {
        key: 5,
        text: "Cancled",
        value: 'cancled',
      },
    ]
    return (
      <>
        <Dropdown
          text='Filter'
          icon='filter'
          floating
          labeled
          button
          options={filterOptions}
          onChange={this.handleFilter}
          className='icon'
        />        
        <Item.Group divided >
          {
            usersSpaces.map(userSpace => {
            let space = userSpace.space;
            let status = userSpace.status;
            let owner = this.findPerson(space.owner);
            return ( 
              <Item key={userSpace.id}>
                <Item.Image src={space.image} />
                <Item.Content>
                  <Item.Header>{space.address}</Item.Header>
                  <Item.Meta>
                    Created by {owner.name}
                    {
                      space.deadline
                      ? 
                      <div>{space.deadline}</div>
                      :
                      null
                    }
                  </Item.Meta>
                  <Item.Extra>
                    <Label>{this.capitalize(status)}</Label>
                    {
                      !space.available
                      ?
                      <Button 
                        icon='trash' 
                        labelPosition='left'
                        floated='right' 
                        content='Delete Record'
                        onClick={() => this.props.deleteUserSpace(userSpace.id)}
                      />
                      :
                      <Button 
                        icon='eye'
                        labelPosition='left'
                        floated='right' 
                        content='See Record'
                        onClick={() => this.openUserSpace(space)}
                      />
                    }
                  </Item.Extra>
                </Item.Content>
                <div className="map">
                  <Map 
                    userSpace={space} 
                    usViewport={{
                      latitude: parseFloat(space.latitude),
                      longitude: parseFloat(space.longitude)
                    }}  
                  />
                </div>
              </Item>
            ) 
          })
        }
      </Item.Group>
    </>
    )
  }

  render() {
    if (!this.props.currentUser) {
      return null
    } else {
      return (
        <div>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field 
              label="Name" 
              control={Input}
              value={this.state.name}  
              name="name"
              onChange={this.handleChange}
            />
            <Form.Field 
              label="Username" 
              control={Input}
              value={this.state.username}  
              name="username"
              onChange={this.handleChange}
            />
            <Form.Field 
              label="Password" 
              control={Input}
              type="password"
              placeholder="Password"
              value={this.state.password}  
              name="password"
              onChange={this.handleChange}
            />
            <Button type='submit'>Update</Button>
            <Button negative floated="right" onClick={() => this.props.deleteAccount(this.props.currentUser.id, this.props.routerProps.history)}>
              Delete Account
            </Button>
          </Form>
          <Tab panes={this.panes}  />
        </div>
      )
    }
  }

}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    users: state.user.users,
    notifications: state.user.notifications,
    userSpaces: state.user.userSpaces
  }
}

export default connect(msp, {
  editUser,
  deleteUserSpace,
  deleteAllUserSpaces,
  handleNotificationDismiss,
  deleteAllNotifications,
  deleteAccount,
  showSpace
})(Profile);