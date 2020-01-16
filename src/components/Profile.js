import React, { Component } from 'react'
import {
  connect
} from 'react-redux'
import { Button, Form, Input, Item, Image, Label, Tab, Table, Icon} from 'semantic-ui-react'
import { editUser } from '../actions/user'
import Map from './Map'
import '../styles/profile.scss'
class Profile extends Component {
 
  constructor(props) {
    super(props)
    if (props.currentUser) {
      this.state = {
        name: this.props.currentUser.name,
        username: this.props.currentUser.username,
        password: this.props.currentUser.password,
      }
    } else {
      this.props.routerProps.history.push('/')
    }
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

  findPerson(id, type) {
    this.users.find(user => user.id)
  }

  panes = [
    { menuItem: 'Spaces', render: () => this.renderUsersSpaces() },
    { menuItem: 'Notifications', render: () => this.renderUserNotifications() },
    { menuItem: 'Active Space', render: () => this.renderUsersActiveSpace() },
  ]

  renderUserNotifications = () => {
    if (this.props.currentUser.notifications.length) {
      return (
        <Table >
          <Table.Header>
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
              >
              <Icon name='trash' />Delete All
            </Button>
            </Table.HeaderCell>
          </Table.Header>
          {
            this.props.currentUser.notifications.map(notification => {
              return (
                <Table.Row>
                  <Table.Cell>{notification.message}</Table.Cell>
                  <Table.Cell>12/2/4 3:00 PM</Table.Cell>
                  <Table.Cell textAlign='center'><Button size='small'>Delete</Button></Table.Cell>
                </Table.Row>
              )
            })
          }
        </Table>
      )
    } else {
      return <div>No notifications</div>
    }
  }

  renderUsersActiveSpace = () => {
    let activeSpace = this.props.currentUser.spaces.find(space => space.claimed && space.available);
    if (activeSpace) {
      return (
        <Item.Group className="active-space">
          <Item>
            <Item.Image src={activeSpace.image} />
            <Item.Content>
              <Item.Header>{activeSpace.address}</Item.Header>
              <Item.Meta>
                {activeSpace.owner}
                {
                  activeSpace.deadline
                  ? 
                  <div>activeSpace.deadline</div>
                  :
                  null
                }
              </Item.Meta>
              <Item.Extra>
                <Label>Status of Space</Label>
                <Button floated='right'>
                  Delete Record
                </Button>
              </Item.Extra>
            </Item.Content>
            <div className="map">
              <Map />
            </div>
          </Item>
        </Item.Group >
      )
    } else {
      return <div>No active parking spaces</div>
    }
  }

  renderUsersSpaces = () => {
    return (
      <Item.Group divided >
        {this.props.currentUser.spaces.map(space => {
          return ( 
            <Item>
              <Item.Image src={space.image} />
              <Item.Content>
                <Item.Header>{space.address}</Item.Header>
                <Item.Meta>
                  {space.owner}
                  {
                    space.deadline
                    ? 
                    <div>space.deadline</div>
                    :
                    null
                  }
                </Item.Meta>
                <Item.Extra>
                  <Label>Claimed</Label>
                  <Button floated='right'>
                    Delete Record
                  </Button>
                </Item.Extra>
              </Item.Content>
            </Item>
          ) 
        })
      }
    </Item.Group>
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
              value={this.state.password}  
              name="password"
              onChange={this.handleChange}
            />
            <Button type='submit'>Update</Button>
            <Button negative floated="right">Delete Account</Button>
          </Form>
          <Tab panes={this.panes} />
        </div>
      )
    }
  }

}

function msp(state) {
  return {
    currentUser: state.user.currentUser
  }
}

export default connect(msp, {
  editUser
})(Profile);