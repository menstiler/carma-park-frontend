import React from 'react';
import { connect } from 'react-redux'
import SpaceCard from '../components/SpaceCard'
import { claimSpace, filterData as filterSpaces } from '../actions/actions'
import ChatTable from '../components/ChatTable'

const SpacesContainer = (props) => {
  const renderSpaces = () => {
    let filteredSpaces = filterSpaces(props.spaces, props.currentUser)
    if (filteredSpaces.length < 1) {
      return <div className="no-spaces">No Available Parking Spots</div>
    } 
    return filteredSpaces.map(space => <SpaceCard key={space.id} space={space} routerProps={props.routerProps} />)
  }
  
  const showChat = () => {
    if (props.activeChat 
    && (props.activeChat === props.selectedSpace.id)
    && (props.selectedSpace.owner_id === props.currentUser.id || props.selectedSpace.claimer_id === props.currentUser.id)
     ) {
      return true;
    }
    return false;
  }

  let chatOpen = showChat();

  return(
    <>
      <div className={`space-container ${chatOpen ? 'chat-open' : ''}`}>
        {renderSpaces()}
      </div>
      {
        chatOpen
        ?
        <ChatTable />
        :
        null
      }
    </>
  )
}

function msp(state) {
  return {
    viewport: state.map.viewport,
    currentUser: state.user.currentUser,
    currentPosition: state.map.currentPosition,
    showPopup: state.map.showPopup,
    popupDets: state.map.popupDets,
    spaces: state.map.spaces,
    distanceShow: state.form.distanceShow,
    selectedSpace: state.map.selectedSpace,
    activeChat: state.user.activeChat,
    activeSpace: state.map.activeSpace
  }
}

export default connect(msp, {
  claimSpace
})(SpacesContainer);
