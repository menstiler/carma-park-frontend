import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment'
import { Icon } from 'semantic-ui-react'
import { showSpace, claimSpace, removeSpace } from '../actions/actions'
import SpaceShow from './SpaceShow';

class SpaceCard extends Component {

  state = {
    time: null
  }

  componentDidMount() {
    if (this.props.space.deadline) {
      let deadline = this.props.space.deadline
      if (deadline > Date.now()) {
        // let totalMinutes = (new Date(this.props.space.deadline).getHours() * 60) + (new Date(this.props.space.deadline).getMinutes()) - (new Date().getHours() * 60 + new Date().getMinutes())
        let expiration = new Date(this.props.space.deadline)

        let momentExpiration =  moment(expiration)
        this.setState({
          time: momentExpiration
        })
      } else {
        this.props.removeSpace(this.props.space.id)
      }
    }
  }

  componentWillUpdate() {
    if (this.props.space.deadline) {
      if (this.state.time) {
        if (moment(this.state.time.diff(this.props.timer)) < 0) {
          this.props.removeSpace(this.props.space.id)
        }
      }
    }
  }

  renderDeadline = () => {
    if (this.state.time && !this.props.space.claimed && this.props.space.deadline) {
      return (
        <>
          <Icon name='hourglass half' />
          {`Expiring in ${moment.duration(this.state.time.diff(this.props.timer)).humanize()}`}
        </>
      )
    } else if (this.props.space.claimed) {
      const claimer = this.props.space.users.find(user => user.id === this.props.space.claimer)
      if (this.props.currentUser.id === claimer.id) {
        if (claimer.id !== this.props.space.owner) {
          return "Claimed by You"
        } else {
          return "You have parked here"
        }
      } else {
        return `Claimed by ${claimer.name}`
      }
    } else {
      return null
    }
  }

  renderCreatedBy() {
    const owner = this.props.space.users.find(user => user.id === this.props.space.owner)
    let createdBy;
    if (owner.id !== this.props.space.claimer) {
      createdBy = (this.props.currentUser && this.props.currentUser.id === owner.id) ? "You" : `${owner.name}`
    } else {
      return null
    }
    return `Created by ${createdBy}` 
  }

  render() {
    if (this.props.selectedSpace && (this.props.selectedSpace.id === this.props.space.id)) {
      return (
        <div className="space-show">
          <SpaceShow routerProps={this.props.routerProps} />
        </div>
      )
    }
    
    return (
      <div 
        data-id={this.props.space.id} 
        className={(this.props.selectedSpace && (this.props.selectedSpace.id === this.props.space.id)) ? "ui card on" : "ui card" } 
        onClick={() => this.props.showSpace(this.props.space)}>
        <div className="content">
          <div className="header">{this.props.space.address}</div>
          <div className="meta">
          {
            this.renderCreatedBy()
          }
          </div>
          <div className="description">
            <p>{this.renderDeadline()}</p>
          </div>
        </div>
      </div>
    )
  }
}

function msp(state) {
  return {
    selectedSpace: state.map.selectedSpace,
    currentUser: state.user.currentUser,
    timer: state.user.timer
  }
}

export default connect(msp, {
  showSpace,
  claimSpace,
  removeSpace
})(SpaceCard);
