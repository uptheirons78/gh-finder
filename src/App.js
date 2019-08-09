/**
 * React Hooks Section:
 * This is a Functional Component
 * and it uses the use State and useEffect Hooks
 * both to manage state and to perform side effects in function components
 */
import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import axios from 'axios';
import './App.css';
const url = 'https://api.github.com';
const id = process.env.REACT_APP_GITHUB_CLIENT_ID;
const secret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;


const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const getInitialUsers = async () => {
    const endpoint = `${url}/users?client_id=${id}&client_secret=${secret}`;
    setLoading(true);
    const res = await axios.get(endpoint);
    setUsers(res.data);
    setTimeout(() => {
      setLoading(false);
    }, 1800);
  }

  useEffect(() => {
    getInitialUsers();
    //eslint-disable-next-line
  }, []);


  //Search for Github Users with Input Form
  const searchUsers = async (text) => {
    const endpoint = `${url}/search/users?q=${text}&client_id=${id}&client_secret=${secret}`;
    setLoading(true);
    const res = await axios.get(endpoint);
    setUsers(res.data.items);
    setTimeout(() => {
      setLoading(false);
    }, 1800);
  }

  //Get a single Github User
  const getUser = async (username) => {
    const endpoint = `${url}/users/${username}?client_id=${id}&client_secret=${secret}`;
    setLoading(true);
    const res = await axios.get(endpoint);
    setUser(res.data);
    setTimeout(() => {
      setLoading(false);
    }, 1800);
  }

  //Get Users Github Repos
  const getUserRepos = async (username) => {
    const endpoint = `${url}/users/${username}/repos?per_page=5&sort=created:asc&client_id=${id}&client_secret=${secret}`;
    setLoading(true);
    const res = await axios.get(endpoint);
    setRepos(res.data);
    setTimeout(() => {
      setLoading(false);
    }, 1800);
  }

  //Clear Users from State
  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  }

  //Set Alert
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  }


  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Alert alert={ alert } />
          <Switch>
            <Route
              exact
              path='/'
              render={props => (
                <Fragment>
                  <Search
                    searchUsers={ searchUsers }
                    clearUsers={ clearUsers }
                    showClear={ users.length > 0 ? true : false }
                    setAlert={ showAlert }
                  />
                  <Users loading={ loading } users={ users } />
                </Fragment>
              )}
            />
            <Route exact path='/about' component={ About }/>
            <Route
              exact
              path='/user/:login'
              render={props => (
                <User
                  { ...props }
                  getUser={ getUser }
                  getUserRepos={ getUserRepos }
                  user={ user }
                  repos={ repos }
                  loading={ loading }
                />
              )}
            />
          </Switch>
        </div>
      </div>
    </Router>
  );

}

export default App;
