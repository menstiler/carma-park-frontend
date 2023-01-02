import React, { useState, useEffect } from 'react'
import {
  connect
} from 'react-redux'
import { Popup, Button, Form, Input, Item, Label, Icon }  from 'semantic-ui-react'
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
import Map from './Map'
import '../styles/profile.scss'
import { Route, Switch, NavLink, Prompt, withRouter } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import _ from 'lodash';
import Notifications from './Notifications';
import Activity from './Activity';
import CarSearch from './CarSearch';
import moment from 'moment';

const Profile = (props) => {
 
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    password: "",
    license_plate: "",
    car_image: "",
    user_image: "",
    car_make: "",
    car_model: ""
  })
  const [loading, setLoading] = useState(false);
  const [oldProfile, setOldProfile] = useState(null)
  const [newProfile, setNewProfile] = useState(null)
  const [isDirty, setIsDirty] = useState(false)
  const [editLoader, setEditLoader] = useState(false)

  useEffect(() => {
    setLoading(true)
    const token = localStorage.token
    if (!token) {
      props.history.push('/login')
    }
  }, [])

  useEffect(() => {
    if (props.currentUser) {
      setProfile({
        name: props.currentUser.name,
        username: props.currentUser.username,
        password: "",
        license_plate: props.currentUser.license_plate,
        car_image: props.currentUser.car_image,
        user_image: props.currentUser.user_image,
        car_make: props.currentUser.car_make,
        car_model: props.currentUser.car_model,
      })
      setLoading(false)
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
  }

  const renderActiveSpace = () => {
    if (!props.currentUser) return;
    let userId = props.currentUser.id;
    let activeSpaces = props.currentUser.spaces;
    if (!activeSpaces.length) return <div className="empty">No Active Spaces</div>;

    const renderActiveButton = (activeSpace) => {
      if (activeSpace.owner_id === userId && !activeSpace.claimed) {
        return <Button
          icon='trash'
          labelPosition='left'
          floated='right'
          content='Cancel'
          onClick={() => props.removeSpace(activeSpace.id)}
        />
      } else if (activeSpace.claimer_id === userId && activeSpace.owner_id !== userId) {
        return <Button
        icon='car'
        labelPosition='left'
          floated='right'
          content='Continue Parking'
          onClick={() => props.history.push('/')}
        />
      }
      return <Label>Claimed by {activeSpace.claimer.name}</Label>
    }
    
    return _.orderBy(activeSpaces, ['updated_at'], ['desc']).map(activeSpace => {
      let space = _.find(props.currentUser.space_logs, ['space_id', activeSpace.id])
      let deadline = space && space.space.deadline;
      let time;
      if (deadline) {
        if (deadline > Date.now()) {
          let expiration = new Date(deadline)
  
          let momentExpiration =  moment(expiration)
          time = momentExpiration
        } 
      }

      return (
        <div className="items ui" key={activeSpace.id}>
          <Item>
            <Item.Content>
              <Item.Header>{activeSpace.address}</Item.Header>
              <Item.Meta>
                Created by {activeSpace.owner.name}
              </Item.Meta>
              {
                deadline
                ? 
                <Item.Meta>
                  <Icon name='hourglass half' />
                  {`Expiring in ${moment.duration(time.diff(props.timer)).humanize()}`}
                </Item.Meta>
                :
                null
              }
              <Item.Extra>
                {
                  renderActiveButton(activeSpace)
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
    props.history.push('/')
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
      props.deleteAccount(props.currentUser.id, props.history)
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

  if (loading) {
    return null
  } else {
    return (
      <div className="profile">
        <Form onSubmit={handleSubmit}>
          <h3>Profile</h3>
          <div className='forms'>
            <div className='ui form'>
              <div className='ui header'>Account Details</div>
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
              <Form.Field 
                label="Password" 
                control={Input}
                type="password"
                placeholder="Password"
                value={profile.password}  
                name="password"
                onChange={handleChange}
              />
              <div className="field">
                <label>Profile Image</label>
                <UploadImage uploadImage={uploadImage} deleteImage={deleteImage} field='user_image' profile={profile} />
              </div>
            </div>
            <div className='ui form'>
              <div className='ui header'>Car Details</div>
              <div className="field">
                <label>Car Make</label>
                <CarSearch type="car_make" updateCar={updateCar} value={profile.car_make} />
              </div>
              <div className="field">
                <label>Car Model</label>
                <CarSearch type="car_model" updateCar={updateCar} car_make={profile.car_make} value={profile.car_model} />
              </div>
              <Form.Field 
                label="License Plate Number" 
                control={Input}
                type="text"
                placeholder="License Plate Number"
                value={profile.license_plate || ''}  
                name="license_plate"
                onChange={handleChange}
              />  
              <div className="field">
                <label>Car Image</label>
                <UploadImage uploadImage={uploadImage} deleteImage={deleteImage} field='car_image'  profile={profile} />
              </div>
            </div>
          </div>
          <div className='btn-container'>
            <Button negative floated="left" onClick={deleteAccount}>
              Delete Account
            </Button>
            <Prompt
              when={isDirty}
              message="You have unsaved changes. Are you sure you want to leave?"
            />
            <Button type='submit' floated="right" className='primary' loading={editLoader}>Update</Button>
          </div>
        </Form>
        <div className="profile-tabs">
          <div className="ui top attached tabular menu">
            <NavLink exact={true} to='/profile' activeClassName="active" className="item">Spaces</NavLink>
            <NavLink to='/profile/notifications' activeClassName="active" className="item">
              Notifications
              {
                  props.notifications 
                  ?
                  <Label color='teal' id="toggleNotifications" > {
                    props.notifications.length
                  } 
                  </Label>
                  :
                  <Label>0</Label>
              }
            </NavLink>
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
    spaces: state.map.spaces,
    notifications: state.user.notifications,
    timer: state.user.timer,
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
