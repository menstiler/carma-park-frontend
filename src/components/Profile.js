import React, { useState, useEffect } from 'react'
import {
  connect
} from 'react-redux'
import { Popup, Button, Form, Input, Item, Label }  from 'semantic-ui-react'
import {
  editUser,
  deleteAccount
} from '../actions/user'
import {
  showSpace,
  handleAutoLogin,
  dispatchActiveSpace,
  addSpaceAfterParking,
  removeSpace
} from '../actions/actions'
import { findPerson } from '../actions/utils'
import Map from './Map'
import '../styles/profile.scss'
import { Route, Switch, NavLink, Prompt } from 'react-router-dom';
import { withRouter } from 'react-router';
import { useDropzone } from 'react-dropzone';
import _ from 'lodash';
import Notifications from './Notifications';
import Activity from './Activity';
import CarSearch from './CarSearch';

const Profile = (props) => {
 
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    password: "",
    loading: false,
    license_plate: "",
    car_image: "",
    user_image: "",
    car_make: "",
    car_model: ""
  })
  const [oldProfile, setOldProfile] = useState(null)
  const [newProfile, setNewProfile] = useState(null)
  const [isDirty, setIsDirty] = useState(false)
  const [editLoader, setEditLoader] = useState(false)

  useEffect(() => {
    setProfile({
      ...profile,
      loading: true
    })
    const token = localStorage.token
    if (!token) {
      props.routerProps.history.push('/login')
    }
  }, [])

  useEffect(() => {
    if (props.currentUser) {
      setProfile({
        name: props.currentUser.name,
        username: props.currentUser.username,
        password: "",
        license_plate: props.currentUser.license_plate,
        loading: false,
        car_image: props.currentUser.car_image,
        user_image: props.currentUser.user_image,
        car_make: props.currentUser.car_make,
        car_model: props.currentUser.car_model,
      })
    }
  }, [props.currentUser])

  const handleChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setEditLoader(true)
    await props.editUser(profile, props.currentUser.id)
    setIsDirty(false)
    setEditLoader(false)
  }

  const goToActiveSpace = (space) => {
    props.dispatchActiveSpace(space)
    props.routerProps.history.push(`/spaces/${space.id}`)
  }

  const renderActiveSpace = () => {
    if (!props.currentUser) return;
    let userId = props.currentUser.id;
    let activeSpaces = props.currentUser.spaces;
    if (!activeSpaces.length) return <div className="empty">No Active Spaces</div>;

    const renderActiveButton = (activeSpace) => {
      if (activeSpace.owner === userId) {
        return <Button
          icon='trash'
          labelPosition='left'
          floated='right'
          content='Cancel'
          onClick={() => props.removeSpace(activeSpace.id)}
        />
      } else if (activeSpace.claimer === userId && activeSpace.owner !== userId) {
        return <Button
        icon='car'
        labelPosition='left'
          floated='right'
          content='Continue Parking'
          onClick={() => goToActiveSpace(activeSpace)}
        />
      } else if (activeSpace.claimer !== userId && !activeSpace.available) {
        return null
      }
      let claimer = _.find(activeSpace.users, ['id', activeSpace.claimer]);
      return <Label>Claimed by {claimer.name}</Label>
    }
    
    return _.orderBy(activeSpaces, ['updated_at'], ['desc']).map(activeSpace => {
      let space = _.find(props.currentUser.space_logs, ['space_id', activeSpace.id])
      let owner = _.find(space.users, ['id', space.space.owner]);

      return (
        <div className="items ui" key={activeSpace.id}>
          <Item>
            <Item.Image src={activeSpace.image} />
            <Item.Content>
              <div>
                <Item.Header>{activeSpace.address}</Item.Header>
                <Item.Meta>
                  Created by {owner.name}
                  {
                    activeSpace.deadline
                      ?
                      <div>{activeSpace.deadline}</div>
                      :
                      null
                  }
                </Item.Meta>
              </div>
              <Item.Extra>
                {
                  renderActiveButton({ ...activeSpace, users: space.users })
                }
              </Item.Extra>
            </Item.Content>
            <div className="map">
              <Map
                spaceLog={activeSpace}
                usViewport={{
                  latitude: parseFloat(activeSpace.latitude),
                  longitude: parseFloat(activeSpace.longitude)
                }}
              />
            </div>
          </Item>
        </div>
      )
    })
  }

  const openUserSpace = (space) => {
    props.showSpace(space);
    props.routerProps.history.push('/')
    setIsDirty(false)
  }

  useEffect(() => {
    if (!_.isEqual(oldProfile, newProfile) || profile.password) {
      setIsDirty(true)
    } else {
      setIsDirty(false)
    }
  }, [newProfile, profile])

  useEffect(() => {
    let keys = ['name', 'username', 'license_plate', 'car_image', 'car_make', 'car_model']
    let oldProfile = _.pick(props.currentUser, keys);
    let newProfile = _.pick(profile, keys);
    setOldProfile(oldProfile)
    setNewProfile(newProfile)
  }, [props.currentUser, profile])

  const deleteAccount = () => {
    let shouldDelete = window.confirm('Are you sure you want to delete your account?');
    if (shouldDelete) {
      props.deleteAccount(props.currentUser.id, props.routerProps.history)
    }
  }

  const uploadImage = (file, field) => {
    setProfile({
      ...profile,
      [field]: file
    })
  }

  const deleteImage = (e, field) => {
    e.stopPropagation()
    setProfile({
      ...profile,
      [field]: {}
    })
  }

  const updateCar = (field, value) => {
    if (field === 'car_make') {
      setProfile({
        ...profile,
        car_make: value,
        car_model: ""
      })
    } else {
      setProfile({
        ...profile,
        car_model: value
      })
    }
  }

  if (profile.loading) {
    return null
  } else {
    return (
      <div className="profile">
        <Form onSubmit={handleSubmit}>
          <h3>Profile</h3>
          <Form.Group widths='equal'>
            <Form.Field 
              label="Name" 
              control={Input}
              value={profile.name}  
              name="name"
              onChange={handleChange}
            />
            <Form.Field 
              label="Username" 
              control={Input}
              value={profile.username}  
              name="username"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field 
              label="Password" 
              control={Input}
              type="password"
              placeholder="Password"
              value={profile.password}  
              name="password"
              onChange={handleChange}
            />
            <Form.Field 
              label="License Plate Number" 
              control={Input}
              type="text"
              placeholder="License Plate Number"
              value={profile.license_plate || ''}  
              name="license_plate"
              onChange={handleChange}
            />
          </Form.Group>
          <div className="equal width fields images">
            <div className="field">
              <label>Profile Image</label>
              <UploadImage uploadImage={uploadImage} deleteImage={deleteImage} field='user_image' profile={profile} />
            </div>
            <div className="field">
              <label>Car Image</label>
              <UploadImage uploadImage={uploadImage} deleteImage={deleteImage} field='car_image'  profile={profile} />
            </div>
          </div>
          <div className="equal width fields">
            <div className="field">
              <label>Car Make</label>
              <CarSearch type="car_make" updateCar={updateCar} value={profile.car_make} />
            </div>
            <div className="field">
              <label>Car Model</label>
              <CarSearch type="car_model" updateCar={updateCar} car_make={profile.car_make} value={profile.car_model} />
            </div>
          </div>
          <Button type='submit' loading={editLoader}>Update</Button>
          <Button negative floated="right" onClick={deleteAccount}>
            Delete Account
          </Button>
          <Prompt
            when={isDirty}
            message="You have unsaved changes. Are you sure you want to leave?"
          />
        </Form>
        <div className="profile-tabs">
          <div className="ui top attached tabular menu">
            <NavLink exact={true} to='/profile' activeClassName="active" className="item">Spaces</NavLink>
            <NavLink to='/profile/notifications' activeClassName="active" className="item">Notifications</NavLink>
            <NavLink to='/profile/past_activity' activeClassName="active" className="item">Activity</NavLink>
          </div>
          <div className="ui bottom attached active tab segment">
            <Switch>
              <Route path='/profile/notifications' render={() => <div><Notifications /></div>} />
              <Route path='/profile/past_activity' render={() => <div><Activity /></div>} />
              <Route path='/profile' render={() => <div>{renderActiveSpace()}</div>} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

const UploadImage = (props) => {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: (file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        let image = {
          name: file[0].name,
          content: this.result.split(',')[1],
          mimetype: file[0].type,
        }
        props.uploadImage(image, props.field)
      }
      reader.readAsDataURL(file[0]);
    }
  });

  let imageExists = props.profile[props.field] && props.profile[props.field].content;
  return (  
    <div {...getRootProps({ className: `dropzone ${isDragActive ? 'dragging' : ''}` })}>
      <input {...getInputProps()} />
      {
        imageExists
        ?
        <div className="profile_image">
          <img src={`data:image/jpeg;base64,${props.profile[props.field].content}`} />
        </div>
        :
        null
      }
      <div className="buttons">
        <Button>Upload</Button>
        {
          imageExists 
          ?
          <Popup content='Delete Image' basic trigger={<Button className="delete-image" icon='trash' onClick={(e) => props.deleteImage(e, props.field)} />} />
          :
          null
        }
      </div>
    </div>
  )
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    spaces: state.map.spaces
  }
}

export default withRouter(connect(msp, {
  editUser,
  showSpace,
  handleAutoLogin,
  dispatchActiveSpace,
  addSpaceAfterParking,
  deleteAccount,
  removeSpace
})(Profile));
