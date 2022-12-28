import React, { useState } from 'react';
import Search from '../components/Search'
import { connect } from 'react-redux'
import { Button, Dropdown, Menu, Label, Icon, Form, Input } from 'semantic-ui-react'
import '../styles/filterContainer.scss';

import { changeMapStyle, updateDistanceFilter, addToFavorites, goToViewport, deleteFavorite} from '../actions/actions'

const FilterContainer = (props) => {
  const [form, setForm] = useState(false);
  const [name, setName] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const openForm = () => {
    setForm(!form)
    setName('')
  }

  const toggleViewFavorites = () => {
    setShowFavorites(!showFavorites)
  }

  const handleChange = (e) => {
    setName(e.target.value)
  }

  const handleClick = () => {
    props.addToFavorites([props.viewport.longitude, props.viewport.latitude], props.currentUser.id, name)
    .then(resp => {
      setForm(false)
      setShowFavorites(true)
      setName('')
    })
  }

  const style = (props.mapStyle === 'dark-v10' ? 'streets-v11' : 'dark-v10')
  
  return (
    <div className="filter-bar">
      <div className="filter-container">
        {/* <div className="filter-column-1">
          <button className="ui button" onClick={props.updateDistanceFilter} value={props.distanceShow ? null : 10}>{props.distanceShow ? "Show All" : "Show Nearby"}</button>
          {props.distanceShow ?
            <>
              <div className="filter-field">
                <label>Show Parking Spots within: {props.distanceShow} Miles</label>
                <input type="range" name="points" min="0" max="10" onChange={props.updateDistanceFilter} />
              </div>
            </>
            :
            null
          }
        </div> */}
        <div className="filter-column-2">
          <Search />
        </div>
        {/* <Favorites {...props} /> */}
      </div>
    </div>
  )
}

const Favorites = (props) => {
  return (
    <>
      {
        props.currentUser
        ?
        <div className="filter-column-3">
          {
            !props.form
            ?
            <Button floated='left' onClick={props.openForm}>Add to Favorites</Button>
            :
            <>
            <Form onSubmit={props.handleSubmit}>
              <Form.Field className="favorites-form">
                <label>Name</label>
                <Input
                required
                placeholder="e.g., Work, Home"
                label={<Button type="submit" onClick={props.handleClick}>Add</Button>}
                labelPosition='right'
                value={props.name}
                onChange={props.handleChange}
                />
              </Form.Field>
            </Form>
            <Button floated='left' className="cancel-favorites" onClick={props.openForm}>Cancel</Button>
            </>
          }
          {
            props.favorites && (props.favorites.length && !props.form)
            ?
            <Button floated='left' onClick={props.toggleViewFavorites}>{props.showFavorites ? "Hide Favorites" : "Show Favorites"}</Button>
            :
            null
          }
        </div>
        :
        null
      }
      {
        props.showFavorites
        ?
        <div className="favorites-container">
          {props.favorites.map(favorite => <Label key={favorite.id} size='large' onClick={() => props.goToViewport({ longitude: favorite.longitude, latitude: favorite.latitude}, props.spaces)}>{favorite.name} <Icon name='close' onClick={() => props.deleteFavorite(favorite)} /></Label>)}
        </div>
        :
        null
      }
    </>
  )
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
