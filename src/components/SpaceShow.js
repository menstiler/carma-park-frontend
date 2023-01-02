import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  dispatchActiveSpace, 
  openNewChat, 
  claimSpace, 
  cancelClaim, 
  removeSpace, 
  openChat,
  finishedParking,
  createSpace,
  hideChat } from '../actions/actions'

const SpaceShow = ({ 
  selectedSpace, 
  activeChat, 
  hideChat, 
  openChat, 
  openNewChat, 
  currentUser,
  claimSpace,
  chats,
  dispatchActiveSpace,
  routerProps,
  claimedSpot,
  removeSpace,
  finishedParking,
  cancelClaim,
  createSpace
}) => {
  const spaceRef = useRef(null);
  const { owner, image } = selectedSpace
  
  useEffect(() => {
    if (spaceRef && spaceRef.current) {
      spaceRef.current.scrollIntoView({
        behavior: "smooth", block: "center"
      });
    }
  }, [spaceRef])

  const claimAction = () => {
    claimSpace(currentUser.id, selectedSpace.id)
  }

  const renderChatButtons = () => {
    if (activeChat === selectedSpace.id) {
      return <button className="ui button" onClick={() => hideChat()}><i className="talk icon"></i>Hide Chat</button> 
    }
    if (!activeChat || (activeChat !== selectedSpace.id)) {
      if (chats.find(chat => chat.space === selectedSpace.id)) {
        return <button className="ui button" onClick={() => openChat(selectedSpace.id)}><i className="talk icon"></i>Continue Chat</button>
      } else {
        return <button  className="ui button" onClick={() => openNewChat(selectedSpace.id, currentUser.id)}><i className="talk icon"></i>Chat</button>
      }
    }
  }

  const renderCreatedBy = () => {
    let { owner, owner_id } = selectedSpace;
    return `Created by ${currentUser.id === owner_id ? 'You' : owner.name}`;
  }
  
  const renderSummary = () => {
    let { claimer, owner_id, claimed } = selectedSpace;
    if (claimed) {
      if (currentUser.id === owner_id) { 
        return <Description user={claimer} text='Claimed by' />
      } else {
        return null;
      }
    } 
  }

  const Description = ({ user, text }) => (
    <div>
      <div className='ui items'>
          <div className='meta'>
            {text} 
          </div>
          <div className='item'>
            {
              user.user_image && user.user_image.content 
              ?
              <div className='ui tiny image'>
                <img src={`data:image/jpeg;base64,${user.user_image.content}`} />  
              </div>
              :
              null
            }
            <div className='content'>
              <h4 className='header'>
                {user.id === currentUser.id ? 'You' : user.name}
              </h4>
              <div className="meta car-info">
                {user.car_make ? <span>{user.car_make}</span> : null}
                {user.car_model ? <span>{user.car_model}</span> : null}
                {user.license_plate ? <span>{user.license_plate}</span> : null}
                {
                  user.car_image && user.car_image.content 
                  ?
                  <img className="ui avatar image" src={`data:image/jpeg;base64,${user.car_image.content}`} />  
                  :
                  null
                }
              </div>
            </div>
          </div>
      </div>
    </div>
  )
  
  if (!currentUser) return null;

  return (
    <>
      <div className="ui card" ref={spaceRef}>
        <div className="content">
          <div className="header">{selectedSpace.address}</div>
        </div>
        <div className="content">
          <div className="meta">
            {
              renderCreatedBy(owner)
            }
          </div>
          <div className="ui small feed">
            <div className="event">
              <div className="content">
                {renderSummary()}
              </div>
            </div>
          </div>
        </div>
        {
          selectedSpace.claimed 
            && selectedSpace.owner_id === currentUser.id
              && selectedSpace.owner_id !== selectedSpace.claimer_id
          ?
          renderChatButtons()
          :
          null
        }
        {
          !selectedSpace.claimed 
          && (selectedSpace.owner_id !== currentUser.id) 
          && !claimedSpot
          ?
            <button className="ui bottom attached button" onClick={claimAction}>
              <i className="car icon"></i>
              Claim
            </button>
          :
          null
        }
        {
          !selectedSpace.claimed && selectedSpace.owner_id === currentUser.id
          ?
          <Link to={'/'}>
            <div className="ui bottom attached button" onClick={() => removeSpace(selectedSpace.id)}>
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
  hideChat,
  finishedParking,
  createSpace
})(SpaceShow);
