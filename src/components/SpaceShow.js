import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  dispatchActiveSpace, 
  openNewChat, 
  claimSpace, 
  cancelClaim, 
  removeSpace, 
  openChat,
  addSpaceAfterParking,
  hideChat } from '../actions/actions'
import { Card } from 'semantic-ui-react'

const SpaceShow = (props) => {

  const spaceRef = useRef(null);
  const owner = props.selectedSpace.users.find(user => user.id === props.selectedSpace.owner)
  const image = props.selectedSpace.image
  
  useEffect(() => {
    if (spaceRef && spaceRef.current) {
      spaceRef.current.scrollIntoView({
        behavior: "smooth", block: "center"
      });
    }
  }, [spaceRef])

  const claimAction = () => {
    props.claimSpace(props.currentUser.id, props.selectedSpace.id)
  }

  const renderChatButtons = () => {
    if (props.activeChat === props.selectedSpace.id) {
      return <button className="ui button" onClick={() => props.hideChat()}><i className="talk icon"></i>Hide Chat</button> 
    }
    if (!props.activeChat || (props.activeChat !== props.selectedSpace.id)) {
      if (props.chats.find(chat => chat.space === props.selectedSpace.id)) {
        return <button className="ui button" onClick={() => props.openChat(props.selectedSpace.id)}><i className="talk icon"></i>Continue Chat</button>
      } else {
        return <button  className="ui button" onClick={() => props.openNewChat(props.selectedSpace.id, props.currentUser.id)}><i className="talk icon"></i>Chat</button>
      }
    }
  }

  const goToActiveSpace = () => {
    props.dispatchActiveSpace(props.selectedSpace)
    props.routerProps.history.push(`/spaces/${props.selectedSpace.id}`)
  }

  const renderCreatedBy = (owner) => {
    let createdBy;
    if (owner.id !== props.selectedSpace.claimer) {
      createdBy = (props.currentUser.id === owner.id) ? "You" : `${owner.name}`
    } else {
      return "You have parked here";
    }
    return `Created by ${createdBy}`
  }
  
  const renderClaimedBy = () => {
    if (props.selectedSpace.claimed) {
      if ((props.selectedSpace.owner === props.currentUser.id) || (props.selectedSpace.claimer === props.currentUser.id)) {
        if (props.selectedSpace.owner !== props.selectedSpace.claimer) {
          if (props.selectedSpace.claimer === props.currentUser.id) {
            return <h4>Claimed by You</h4>  
          }
          return (
            <h4>
              Claimed by {props.users.find(user => user.id === props.selectedSpace.claimer).name}
            </h4>
          )
        } 
      }
    }
    return null
  }

  const renderSummary = () => {
    let { claimer, users, claimed } = props.selectedSpace;
    let claimerProfile = users.find(user => user.id === claimer)
    if (owner.id === props.currentUser.id && claimed) {
      return (
        <div className="info">
          <h4>Claimed by {claimerProfile.name}</h4>
          <div className="car-info">
            <div>
              {
                claimerProfile.user_image && claimerProfile.user_image.content 
                ?
                <img src={`data:image/jpeg;base64,${claimerProfile.user_image.content}`} />  
                :
                null
              }
            </div>
            <div className="text-info">
              <div>
                <span className="license">{claimerProfile.license_plate ? claimerProfile.license_plate : null}</span>
                <div>
                  {claimerProfile.car_make ? claimerProfile.car_make : null}
                  {claimerProfile.car_model ? <span>&nbsp;{claimerProfile.car_model}</span> : null}
                </div>
              </div>
            </div>
            <div>
              {
                claimerProfile.car_image && claimerProfile.car_image.content 
                ?
                <img src={`data:image/jpeg;base64,${claimerProfile.car_image.content}`} />  
                :
                null
              }
            </div>
          </div>
        </div>
      )
    }
  }
  
  return (
    <>
      <div className="ui card" ref={spaceRef}>
        <div className="content">
          <div className="header">{props.selectedSpace.address}</div>
        </div>
        <div className="content">
          <h4 className="ui sub header">
            {
              renderCreatedBy(owner)
            }
          </h4>
          <div className="ui small feed">
            <div className="event">
              <div className="content">
                {
                  image
                  ?
                  <Card raised image={image} className="parking-image" alt={props.selectedSpace.address} />
                  :
                  null
                }
                <div className="summary">
                  {renderSummary()}
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          props.selectedSpace.claimed 
            && props.selectedSpace.claimer === props.currentUser.id
              && props.selectedSpace.claimer !== props.selectedSpace.owner
          ?
          <button className="ui bottom attached button" onClick={goToActiveSpace}>
            <i className="car icon"></i>
            Continue Parking
          </button>
          :
          null
        }
        {
          props.selectedSpace.claimed
            && props.selectedSpace.claimer === props.selectedSpace.owner
          ?
            <button className="ui bottom attached button" onClick={() => props.addSpaceAfterParking(props.currentUser.id, props.selectedSpace.id)}>
            <i className="car icon"></i>
            Add Parking Spot
          </button>
            :
            null
        }
        {
          props.selectedSpace.claimed 
            && props.selectedSpace.owner === props.currentUser.id
              && props.selectedSpace.owner !== props.selectedSpace.claimer
          ?
          renderChatButtons()
          :
          null
        }
        {
          !props.selectedSpace.claimed 
          && (props.selectedSpace.owner !== props.currentUser.id) 
          && !props.claimedSpot
          ?
            <button className="ui bottom attached button" onClick={claimAction}>
              <i className="car icon"></i>
              Claim
            </button>
          :
          null
        }
        {
          !props.selectedSpace.claimed && props.selectedSpace.owner === props.currentUser.id
          ?
          <Link to={'/'}>
            <div className="ui bottom attached button" onClick={() => props.removeSpace(props.selectedSpace.id)}>
                <i className="trash alternate outline icon"></i>
                Cancel
            </div>
          </Link>
          :
          null
        }
      </div>
  </>
  )
}

function msp(state) {
  return {
    selectedSpace: state.map.selectedSpace,
    currentUser: state.user.currentUser,
    chats: state.user.chats,
    activeChat: state.user.activeChat,
    claimedSpot: state.user.claimedSpot
  }
}

export default connect(msp, {
  claimSpace,
  cancelClaim,
  removeSpace,
  openChat,
  openNewChat,
  dispatchActiveSpace,
  addSpaceAfterParking,
  hideChat
})(SpaceShow);
