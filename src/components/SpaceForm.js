import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import Search from './Search'
import Map from './Map'
import { Button, Icon} from 'semantic-ui-react'
import { createSpace, prevStep, nextStep, closePopup  } from '../actions/actions'
import '../styles/spaceForm.scss';

const SpaceForm = (props) => {
  const [alert, setAlert] = useState(null)
  const [coords, setCoords] = useState(null)
  const [deadline, setDeadline] = useState({
    minutes: 0,
    hours: 0,
  })

  useEffect(() => {
    props.closePopup();
    let { longitude, latitude } = props.currentPosition;
    let coords = {
      latitude,
      longitude,
    }
    setCoords(coords)
  }, [props.currentPosition])

  useEffect(() => {
    const token = localStorage.token
    if (!token) {
      props.routerProps.history.push('/login')
    }
  }, [])

  const duplicate = (address, coords) => {
    if (!address || !coords) return;
    let sharedAddress = props.spaces.find(space => space.address === address || (JSON.parse(space.longitude) === coords.longitude && JSON.parse(space.latitude) === coords.latitude))
    if (sharedAddress) {
      return sharedAddress
    }
    return false
  }

  const saveAndContinue = (e) => {
    e.preventDefault()
    let nonUnique = duplicate(props.address, props.coords)
    if (props.address && !nonUnique) {
      props.nextStep()
    } else if (nonUnique) {
      setAlert(`This location is already ${nonUnique.available ? 'available' : 'claimed'}.`)
    } else {
      setAlert("Please input a location")
    }

  }

  const back = (e) => {
    e.preventDefault();
    props.prevStep();
    if (props.step === 2) {
      setDeadline({
        hours: 0,
        minutes: 0
      })
    }
  }

  const closeAlert = () => {
    setAlert(null)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    let time = {
      minutes: deadline.minutes,
      hours: deadline.hours
    }
    props.createSpace(props.currentUser.id, props.address, props.coords, time)
    if (!props.loading) {
      props.routerProps.history.push('/')
    }
  }

  const handleTimeChange = (event) => {
    if (event.target.name === "minutes") {
      setDeadline({
        ...deadline,
        minutes: event.target.value
      })
    } else {
      setDeadline({
        ...deadline,
        hours: event.target.value
      })
    }
  }

  const renderOutput = () => {
    if (deadline.hours && deadline.minutes) {
      return `${deadline.hours} ${deadline.hours > 1 ? "hours" : "hour"} and ${deadline.minutes} ${deadline.minutes > 1 ? "minutes" : "minute"}`
    } else if (deadline.hours) {
      return `${deadline.hours} ${deadline.hours > 1 ? "hours" : "hour"}`
    } else if (deadline.minutes) {
      return `${deadline.minutes} ${deadline.minutes > 1 ? "minutes" : "minute"}`
    }
  }

  const updateMap = (coords) => {
    setCoords(coords)
  }
  
  const renderForm = () => {
    const {step} = props;
    switch(step) {
      case 1:
        return (
          <div className="space-form">
          <form>
              {alert ? (
              <section className="ui message">
                <i className="close icon" onClick={closeAlert}></i>
                <div className="header">{alert}</div>
              </section>
                )
                :
                null
              }
              <label><strong>Step 1:</strong> Add Location</label>
              <div className="input-container">
                <Search createSpace={true} updateMap={updateMap} />
              </div>
              <Map createSpace={true} coords={coords} />
              <Button animated floated='right' onClick={saveAndContinue}>
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
                <input type="number" placeholder="00" min="1" max="24" name="hours" onChange={handleTimeChange}/>:
                <input type="number" placeholder="00" min="1" max="59" name="minutes" onChange={handleTimeChange}/>
                <div>
                {
                  deadline.hours || deadline.minutes
                  ?
                  `Parking spot will be available for ${renderOutput()}`
                  :
                  null
                }
                </div>
              </div>
              <Button animated floated='left' onClick={back}>
                <Button.Content visible>Back</Button.Content>
                <Button.Content hidden>
                  <Icon name='arrow left' />
                </Button.Content>
              </Button>
              <Button floated='right' onClick={handleFormSubmit}>Add Parking Spot</Button>
            </form>
          </div>
        )
      default:
        return;
    }
  }

  return renderForm();
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    address: state.form.address,
    coords: state.form.coords,
    step: state.form.step,
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
