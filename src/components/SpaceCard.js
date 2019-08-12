import React, { Component } from 'react';
import { connect } from 'react-redux'

import { showSpace, claimSpace } from '../actions'
import SpaceShow from './SpaceShow'

class SpaceCard extends React.Component {

  componentDidUpdate() {
    if (this.props.selectedSpace && this.props.selectedSpace.id === this.props.space.id) {
      let element = document.querySelector(`[data-id="${this.props.space.id}"]`)
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  render() {
    return (
      <>
      <button data-id={this.props.space.id} className="accordion" onClick={() => this.props.showSpace(this.props.space)}>
      {this.props.space.address} - {this.props.users.find(user => user.id === this.props.space.owner).name}
      </button>
      {this.props.selectedSpace && this.props.selectedSpace.id === this.props.space.id
        ?
        <SpaceShow routerProps={this.props.routerProps} />
        :
        null
      }
      </>
    )
  }
}

function msp(state) {
  return {
    users: state.map.users,
    selectedSpace: state.map.selectedSpace,
    currentUser: state.user.currentUser
  }
}

export default connect(msp, {
  showSpace,
  claimSpace
})(SpaceCard);
