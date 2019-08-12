import React from 'react'
import { connect } from 'react-redux'
import { handleEditChange, setInitialValueForForm, editSpace } from '../actions'

class EditSpace extends React.Component {

  componentDidMount() {
    this.props.setInitialValueForForm(this.props.selectedSpace.address)
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.editSpace(this.props.selectedSpace.id, this.props.address)
    .then(resp => {
      this.props.routerProps.history.push('/')
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <input value={this.props.address} onChange={this.props.handleEditChange}/>
      <input type="submit" value="Update" />
      </form>
    )
  }
}


function msp(state) {
  return {
    selectedSpace: state.map.selectedSpace,
    address: state.form.address
  }
}

export default connect(msp, {
  handleEditChange,
  setInitialValueForForm,
  editSpace
})(EditSpace);
