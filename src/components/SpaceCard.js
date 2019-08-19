import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment'
import { showSpace, claimSpace, removeSpace } from '../actions'

class SpaceCard extends Component {

  state = {
    time: null
  }

  componentDidMount() {
    if (this.props.space.deadline) {
      let deadline = this.props.space.deadline
      if (deadline > Date.now()) {
        let totalMinutes = (new Date(this.props.space.deadline).getHours() * 60) + (new Date(this.props.space.deadline).getMinutes()) - (new Date().getHours() * 60 + new Date().getMinutes())
        let expiration = new Date(this.props.space.deadline)

        let momentExpiration =  moment(expiration)
        console.log(momentExpiration)
        this.setState({
          time: momentExpiration
        })
      } else {
        this.props.removeSpace(this.props.space.id)
      }
    }
  }

  componentWillUpdate() {
    if (this.state.time) {
      if (moment(this.state.time.diff(this.props.timer)) < 0) {
        this.props.removeSpace(this.props.space.id)
      }
    }
  }

  renderDeadline = () => {
    if (this.state.time) {
      // console.log("TIMER", moment(this.state.time.diff(this.props.timer)))
      return `Expiring in ${moment.duration(this.state.time.diff(this.props.timer)).humanize()}`
    } else {
      return null
    }
  }

  render() {
    return (
      <>
        <button data-id={this.props.space.id} className="accordion" onClick={() => this.props.showSpace(this.props.space)}>
          {this.props.space.address} - {this.props.users.find(user => user.id === this.props.space.owner).name}
          <p>{this.renderDeadline()}</p>
        </button>
      </>
    )
  }
}

function msp(state) {
  return {
    users: state.user.users,
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
