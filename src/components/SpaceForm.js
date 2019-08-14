import React, { Component } from 'react';
import { connect } from 'react-redux'
import Search from './Search'
import Map from './Map'
import { createSpace  } from '../actions'

class SpaceForm extends React.Component {

  state = {
    minutes: 0,
    hours: 0
  }

  handleFormSubmit = (event) => {
    event.preventDefault()
    let time = {
      minutes: this.state.minutes,
      hours: this.state.hours
    }
    this.props.createSpace(this.props.currentUser, this.props.address, this.props.coords, time)
    this.props.routerProps.history.push('/')
  }

  handleTimeChange = (event) => {
    if (event.target.name === "minutes") {
      this.setState({
        minutes: event.target.value
      })
    } else {
      this.setState({
        hours: event.target.value
      })
    }
  }

  renderOutput = () => {
    if (this.state.hours && this.state.minutes) {
      return `${this.state.hours} ${this.state.hours > 1 ? "hours" : "hour"} and ${this.state.minutes} ${this.state.minutes > 1 ? "minutes" : "minute"}`
    } else if (this.state.hours) {
      return `${this.state.hours} ${this.state.hours > 1 ? "hours" : "hour"}`
    } else if (this.state.minutes) {
      return `${this.state.minutes} ${this.state.minutes > 1 ? "minutes" : "minute"}`
    }
  }

  render() {
    return (
      <>
      <form onSubmit={(event) => this.handleFormSubmit(event)}>
        <Search createSpace={true} />
        <Map createSpace={true} />
        <div className="setTime">
          <label>Add Deadline:</label>
          <input type="number" placeholder="0" min="1" max="24" name="hours" onChange={this.handleTimeChange}/>:
          <input type="number" placeholder="0" min="1" max="59" name="minutes" onChange={this.handleTimeChange}/>
          <div>
          {
            this.state.hours || this.state.minutes
            ?
            `Parking spot will be available for ${this.renderOutput()}`
            :
            null
          }
          </div>
        </div>
        <input type="submit" value="Add Parking Spot" />
      </form>
      </>
    );
  }
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    address: state.form.address,
    coords: state.form.coords
  }
}

export default connect(msp, {
  createSpace
})(SpaceForm);
