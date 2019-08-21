import React from 'react';
import Search from '../components/Search'
import { connect } from 'react-redux'
import { Button, Dropdown, Menu, Label, Icon, Form, Input } from 'semantic-ui-react'

import { changeMapStyle, updateDistanceFilter, addToFavorites, goToViewport, deleteFavorite} from '../actions'

class FilterContainer extends React.Component {

  state = {
    form: false,
    name: '',
    showFavorites: false
  }

  openForm = () => {
    this.setState({
      form: !this.state.form,
      name: ''
    })
  }

  toggleViewFavorites = () => {
    this.setState({
      showFavorites: !this.state.showFavorites,
    })
  }

  handleChange = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  handleClick = () => {
    this.props.addToFavorites([this.props.viewport.longitude, this.props.viewport.latitude], this.props.currentUser, this.state.name)
    .then(resp => {
      this.setState({
        form: false,
        showFavorites: true,
        name: ''
      })
    })
  }

  render() {
    const style = (this.props.mapStyle === 'dark-v10' ? 'streets-v11' : 'dark-v10')
    return (
      <>
      <div className="filter-container">
        <div className="filter-column-1">
          <button className="ui button" onClick={this.props.updateDistanceFilter} value={this.props.distanceShow ? null : 10}>{this.props.distanceShow ? "Show All" : "Show Nearby"}</button>
          {this.props.distanceShow ?
            <>
              <div class="filter-field">
                <label>Show Parking Spots within: {this.props.distanceShow} Miles</label>
                <input type="range" name="points" min="0" max="10" onChange={this.props.updateDistanceFilter} />
              </div>
            </>
            :
            null
          }
        </div>
        <div className="filter-column-2">
          <Search />
        </div>
        {
          this.props.currentUser
          ?
          <div className="filter-column-3">
            {
              !this.state.form
              ?
              <Button floated='left' onClick={this.openForm}>Add to Favorites</Button>
              :
              <>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field className="favorites-form">
                  <label>Name</label>
                  <Input
                  required
                  placeholder="e.g., Work, Home"
                  label={<Button type="submit" onClick={this.handleClick}>Add</Button>}
                  labelPosition='right'
                  value={this.state.name}
                  onChange={this.handleChange}
                  />
                </Form.Field>
              </Form>
              <Button floated='left' className="cancel-favorites" onClick={this.openForm}>Cancel</Button>
              </>
            }
            {
              this.props.favorites.length && !this.state.form
              ?
              <Button floated='left' onClick={this.toggleViewFavorites}>{this.state.showFavorites ? "Hide Favorites" : "Show Favorites"}</Button>
              :
              null
            }
          </div>
          :
          null
        }
      </div>
        {
          this.state.showFavorites
          ?
          <div className="favorites-container">
            {this.props.favorites.map(favorite => <Label key={favorite.id} size='large' onClick={() => this.props.goToViewport({ longitude: favorite.longitude, latitude: favorite.latitude}, this.props.spaces)}>{favorite.name} <Icon name='close' onClick={() => this.props.deleteFavorite(favorite)} /></Label>)}
          </div>
          :
          null
        }
      </>
    )
  }

}

function msp(state) {
  return {
    distanceShow: state.form.distanceShow,
    mapStyle: state.map.mapStyle,
    favorites: state.user.favorites,
    viewport: state.map.viewport,
    currentUser: state.user.currentUser,
    spaces: state.map.spaces
  }
}

export default connect(msp, {
  updateDistanceFilter, changeMapStyle, addToFavorites, goToViewport, deleteFavorite
})(FilterContainer);
