import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'
import { capitalize } from '../actions/utils';

const initialState = {
  loading: false,
  results: [],
  value: '',
}

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }
    default:
      throw new Error()
  }
}

function SearchExampleStandard(props) {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  const { loading, results, value } = state
  let [cars, setCars] = useState([])

  useEffect(() => {
    dispatch({ type: 'UPDATE_SELECTION', selection: props.value })
  }, [props.value])

  useEffect(() => {
    (async () => {
      let fetchingCarMake = props.type === "car_make";
      if (!fetchingCarMake && !props.car_make) return;
      let carMakeUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
      let carModelUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${props.car_make}?format=json`
      let url = fetchingCarMake ? carMakeUrl : carModelUrl;
      await fetch(url)
      .then(res => res.json())
      .then(data => {
        let original = data.Results.map(car => fetchingCarMake ? car.MakeName : car.Model_Name)
        let unique = [... new Set(original)]
        let cars = unique.map(car => ({
          title: capitalize(car.toLowerCase())
        }))
        setCars(cars)
      })
    })()
  }, [props.car_make])

  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i')
      const isMatch = (result) => re.test(result.title)

      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(cars, isMatch),
      })
    }, 300)
  }, [cars])

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleSelection = (e, data) => {
    dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
    props.updateCar(props.type, data.result.title)
  }

  return (
    <Search
      loading={loading}
      onResultSelect={(e, data) => handleSelection(e, data)}
      name={props.type}
      onSearchChange={handleSearchChange}
      results={results}
      value={value || ''}
    />
  )
}

export default SearchExampleStandard