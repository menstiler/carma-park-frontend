import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import moment from 'moment'
import { Icon } from 'semantic-ui-react'
import { showSpace, claimSpace, removeSpace } from '../actions/actions'
import SpaceShow from './SpaceShow';

const SpaceCard = (props) => {
  const [time, setTime] = useState(null)

  useEffect(() => {
    if (props.space.deadline) {
      let deadline = props.space.deadline
      if (deadline > Date.now()) {
        // let totalMinutes = (new Date(props.space.deadline).getHours() * 60) + (new Date(props.space.deadline).getMinutes()) - (new Date().getHours() * 60 + new Date().getMinutes())
        let expiration = new Date(props.space.deadline)

        let momentExpiration =  moment(expiration)
        setTime(momentExpiration)
      } else {
        props.removeSpace(props.space.id)
      }
    }
  }, [])

  useEffect(() => {
    if (props.space.deadline) {
      if (time) {
        if (moment(time.diff(props.timer)) < 0) {
          props.removeSpace(props.space.id)
        }
      }
    }
  }, [])

  const renderDeadline = () => {
    if (time && !props.space.claimed && props.space.deadline) {
      return (
        <>
          <Icon name='hourglass half' />
          {`Expiring in ${moment.duration(time.diff(props.timer)).humanize()}`}
        </>
      )
    } else if (props.space.claimed) {
      const claimer = props.space.claimer
      if (props.currentUser.id === claimer.id) {
        if (claimer.id !== props.space.owner) {
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

  const renderCreatedBy = () => {
    const { owner_id, owner } = props.space
    let createdBy = (props.currentUser && props.currentUser.id === owner_id) ? "You" : `${owner.name}`;
    return `Created by ${createdBy}` 
  }

  if (props.selectedSpace && (props.selectedSpace.id === props.space.id)) {
    return (
      <div className="space-show">
        <SpaceShow routerProps={props.routerProps} />
      </div>
    )
  }
  
  const showSpace = (e) => {
    e.stopPropagation()
    props.showSpace(props.space)
  }

  return (
    <div 
      data-id={props.space.id} 
      className={(props.selectedSpace && (props.selectedSpace.id === props.space.id)) ? "ui card on" : "ui card" } 
      onClick={showSpace}>
      <div className="content">
        <div className="header">{props.space.address}</div>
        <div className="meta">
        {
          renderCreatedBy()
        }
        </div>
        <div className="description">
          <p>{renderDeadline()}</p>
        </div>
      </div>
      <button className="ui bottom attached button" onClick={showSpace}>
        View Details
      </button>
    </div>
  )
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
