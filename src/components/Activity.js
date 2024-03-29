import React, { useState } from 'react';
import { Button, Item, Label, Dropdown }  from 'semantic-ui-react'
import { connect } from 'react-redux'
import {
  deleteSpaceLog,
  deleteAllUserSpaces,
} from '../actions/user'
import { capitalize } from '../actions/utils'
import Map from './Map'
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';

const Activity = (props) => {
  const [filter, setFilter] = useState(null)

  const handleFilter = (e, type) => {
    setFilter(type.value)
  }

  const filterSpaceLogs = () => {
    return props.currentUser.space_logs.filter(spaceLog => {
      switch(filter) {
        case 'all': 
          return spaceLog
        case 'created':
          return spaceLog.status === 'created' 
        case 'claimed':
          return spaceLog.status === 'claimed' 
        case 'parked':
          return spaceLog.status === 'parked'
        case 'canceled':
          return spaceLog.status === 'canceled' 
        default:
          return spaceLog
      }
    });
  }

  let spaceLogsExists = props.currentUser && props.currentUser.space_logs.length > 0
  let filteredSpaceLogs = props.currentUser && filterSpaceLogs();

  let filterOptions = [
    {
      key: 0,
      text: "All",
      value: 'all',
    },
    {
      key: 1,
      text: "Active",
      value: 'active',
    },
    {
      key: 2,
      text: "Created",
      value: 'created',
    },
    {
      key: 3,
      text: "Claimed",
      value: 'claimed',
    },
    {
      key: 4,
      text: "Parked",
      value: 'parked',
    },
    {
      key: 5,
      text: "Canceled",
      value: 'canceled',
    },
  ]
  return (
    <>
      { 
        spaceLogsExists
        ?
        <Dropdown
          text='Filter'
          icon='filter'
          floating
          labeled
          button
          options={filterOptions}
          onChange={handleFilter}
          className='icon'
        />        
        :
        null
      }
      <Item.Group divided >
        {
          spaceLogsExists
          ?
          _.orderBy(filteredSpaceLogs, ['space.updated_at'], ['desc']).map(spaceLog => 
            <SpaceCell
              spaceLog={spaceLog} 
              deleteSpaceLog={deleteSpaceLog} 
              currentUser={props.currentUser}
            />
          ) 
        :
        <div className="empty">No Activity</div>
      }
    </Item.Group>
  </>
  )
}

const SpaceCell = ({ spaceLog, deleteSpaceLog, currentUser }) => {
  const [showMap, setShowMap] = useState(false)
  let space = spaceLog.space
  let status = spaceLog.status
  let isActive = _.find(currentUser.spaces, ['id', space.id]) !== undefined ? true : false;

  return ( 
    <Item key={spaceLog.id}>
      <Item.Content>
        <Item.Header>{space.address}</Item.Header>
        <Item.Meta>
          {
            moment(space.updated_at).format('dddd, MMMM Do YYYY, h:mm a')
          }
        </Item.Meta>
        <Item.Extra>
          <Label>{capitalize(status)}</Label>
          <Button 
            icon='map marker alternate' 
            labelPosition='left'
            floated='right' 
            content={showMap ? 'Hide Map' : 'Show Map'}
            onClick={() => setShowMap(!showMap)}
          />
          {
            isActive
            ?
            null
            :
            <Button 
              icon='trash' 
              labelPosition='left'
              floated='right' 
              content='Delete Record'
              onClick={() => deleteSpaceLog(spaceLog.id)}
            />
          }
        </Item.Extra>
      </Item.Content>
      {
        showMap 
        ?
        <div className="map">
          <Map 
            spaceLog={space} 
            usViewport={{
              latitude: parseFloat(space.latitude),
              longitude: parseFloat(space.longitude)
            }}  
          />
        </div>
        :
        null
      }
    </Item>
  )
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    timer: state.user.timer
  }
}

export default withRouter(connect(msp, {
  deleteSpaceLog,
  deleteAllUserSpaces,
})(Activity));
