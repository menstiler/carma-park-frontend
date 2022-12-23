import React, { Component } from 'react';
import { connect } from 'react-redux'
import Search from './Search'
import Map from './Map'
import { Button, Form, Icon, Progress } from 'semantic-ui-react'
import { createSpace, prevStep, nextStep, closePopup  } from '../actions/actions'
import '../styles/spaceForm.scss';

class SpaceForm extends Component {

  state = {
    minutes: 0,
    hours: 0,
    image: null,
    alert: null,
    coords: null
  }

  componentWillMount() {
    this.props.closePopup();
    let { longitude, latitude } = this.props.currentPosition;
    let coords = {
      latitude,
      longitude,
    }
    this.setState({
      coords
    })
  }

  componentDidMount() {
    const token = localStorage.token
    if (!token) {
      this.props.routerProps.history.push('/login')
    }
  }

  duplicate = (address, coords) => {
    if (!address || !coords) return;
    let sharedAddress = this.props.spaces.find(space => space.address === address || (JSON.parse(space.longitude) === coords.longitude && JSON.parse(space.latitude) === coords.latitude))
    if (sharedAddress) {
      return sharedAddress
    }
    return false
  }

  saveAndContinue = (e) => {
    e.preventDefault()
    let nonUnique = this.duplicate(this.props.address, this.props.coords)
    if (this.props.address && !nonUnique) {
      this.props.nextStep()
    } else if (nonUnique) {
      this.setState({
        alert: `This location is already ${nonUnique.available ? 'available' : 'claimed'}.`
      })
    } else {
      this.setState({
        alert: "Please input a location"
      })
    }

  }

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
    if (this.props.step === 2) {
      this.setState({
        image: null,
        hours: 0,
        minutes: 0
      })
    }
  }


  closeAlert = () => {
    this.setState({
      alert: null
    })
  }

  removeGoogleStreetView = (e) => {
    e.preventDefault()
    this.setState({
      image: null
    })
  }
  
  grabGoogleStreetView = (e) => {
    e.preventDefault()
    this.setState({
      image: `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${parseFloat(this.props.coords.latitude)},${parseFloat(this.props.coords.longitude)}&fov=90&heading=200&pitch=5&key=${process.env.REACT_APP_GOOGLE_TOKEN}`
    })
  }

  handleFormSubmit = (event) => {
    event.preventDefault()
    let time = {
      minutes: this.state.minutes,
      hours: this.state.hours
    }
    this.props.createSpace(this.props.currentUser.id, this.props.address, this.props.coords, time, this.state.image)
    if (!this.props.loading) {
      this.props.routerProps.history.push('/')
    }
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

  updateMap = (coords) => {
    this.setState({
      coords: coords
    })
  }

  renderForm = () => {
    const {step} = this.props;
    switch(step) {
      case 1:
        return (
          <div className="space-form">
          <form>
            {this.state.alert ? (
             <section className="ui message">
               <i className="close icon" onClick={this.closeAlert}></i>
               <div className="header">{this.state.alert}</div>
             </section>
              )
              :
              null
            }
              <label><strong>Step 1:</strong> Add Location</label>
              <div className="input-container">
                <Search createSpace={true} updateMap={this.updateMap} />
              </div>
              <Map createSpace={true} coords={this.state.coords} />
              <Button animated floated='right' onClick={this.saveAndContinue}>
                <Button.Content visible>Next</Button.Content>
                <Button.Content hidden>
                  <Icon name='arrow right' />
                </Button.Content>
              </Button>
            </form>
          </div>
        )
      case 2:
        return (
          <div className="space-form">
            <form>
              <label><strong>Step 2:</strong> Add a Deadline (optional)</label>
              <div className="setTime">
                <input type="number" placeholder="00" min="1" max="24" name="hours" onChange={this.handleTimeChange}/>:
                <input type="number" placeholder="00" min="1" max="59" name="minutes" onChange={this.handleTimeChange}/>
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
              <Button animated floated='left' onClick={this.back}>
                <Button.Content visible>Back</Button.Content>
                <Button.Content hidden>
                  <Icon name='arrow left' />
                </Button.Content>
              </Button>
              <Button animated floated='right' onClick={this.saveAndContinue}>
                <Button.Content visible>Next</Button.Content>
                <Button.Content hidden>
                  <Icon name='arrow right' />
                </Button.Content>
              </Button>
            </form>
          </div>
        )
      case 3:
        return (
          <div className="space-form">
            <form >
              <label><strong>Step 2:</strong> Add an Image (optional)</label>
              <div className="streetview-image">
              {
                this.state.image
                ?
                <Button onClick={this.removeGoogleStreetView}>Remove Street View Image</Button>
                :
                <Button onClick={this.grabGoogleStreetView}>Add Street View Image</Button>
              }
                {
                  this.state.image
                  ?
                  <img src={this.state.image} />
                  :
                  null
                }
              </div>
              <Button animated floated='left' onClick={this.back}>
                <Button.Content visible>Back</Button.Content>
                <Button.Content hidden>
                  <Icon name='arrow left' />
                </Button.Content>
              </Button>
              <Button floated='right' onClick={this.handleFormSubmit}>Add Parking Spot</Button>
            </form>
          </div>
        )
      default:
        return;
    }
  }

  render() {
    return this.renderForm()
  }
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    address: state.form.address,
    coords: state.form.coords,
    step: state.form.step,
    progress: state.form.progress,
    loading: state.form.loading,
    spaces: state.map.spaces,
    currentPosition: state.map.currentPosition
  }
}

export default connect(msp, {
  createSpace,
  nextStep,
  prevStep,
  closePopup
})(SpaceForm);
