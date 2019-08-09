import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
  INITIAL_USERS,
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS
} from '../types';

let githubClientId;
let githubClientSecret;
const url = 'https://api.github.com';

if(process.env.NODE_ENV !== 'production') {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false
  }

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  //Initial Users
  const getInitialUsers = async () => {
    setLoading();
    const endpoint = `${url}/users?client_id=${githubClientId}&client_secret=${githubClientSecret}`;
    const res = await axios.get(endpoint);
    dispatch({
      type: INITIAL_USERS,
      payload: res.data
    });
  }

  //Mimic a ComponentDidMount Lifecycle
  useEffect(() => {
    getInitialUsers();
    //eslint-disable-next-line
  }, []);

  //Search for Github Users with Input Form
  const searchUsers = async (text) => {
    setLoading();
    const endpoint = `${url}/search/users?q=${text}&client_id=${githubClientId}&client_secret=${githubClientSecret}`;
    const res = await axios.get(endpoint);
    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items
    });
  }

  //Get a single Github User
  const getUser = async (username) => {
    setLoading();
    const endpoint = `${url}/users/${username}?client_id=${githubClientId}&client_secret=${githubClientSecret}`;
    const res = await axios.get(endpoint);
    dispatch({
      type: GET_USER,
      payload: res.data
    });
  }

  //Get Users Github Repos
  const getUserRepos = async (username) => {
    setLoading();
    const endpoint = `${url}/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`;
    const res = await axios.get(endpoint);
    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  }

  //Clear Users
  const clearUsers = () => dispatch({type: CLEAR_USERS});

  // Set Loading
  const setLoading = () => dispatch({type: SET_LOADING});

  return <GithubContext.Provider
    value={{
      users: state.users,
      user: state.user,
      repos: state.repos,
      loading: state.loading,
      searchUsers,
      clearUsers,
      getUser,
      getUserRepos,
      getInitialUsers
    }}
  >
    { props.children }
  </GithubContext.Provider>

}

export default GithubState;