import React, { Fragment, Component } from 'react';
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


class App extends Component {

  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null
  }

  async componentDidMount() {
    const endpoint = `${url}/users?client_id=${id}&client_secret=${secret}`;
    this.setState({ loading: true });
    const res = await axios.get(endpoint);
    setTimeout(() => {
      this.setState({ users: res.data, loading: false });
    }, 1800);
  }

  //Search for Github Users with Input Form
  searchUsers = async (text) => {
    const endpoint = `${url}/search/users?q=${text}&client_id=${id}&client_secret=${secret}`;
    this.setState({ loading: true });
    const res = await axios.get(endpoint);
    setTimeout(() => {
      this.setState({ users: res.data.items, loading: false });
    }, 1800);
  }

  //Get a single Github User
  getUser = async (username) => {
    const endpoint = `${url}/users/${username}?client_id=${id}&client_secret=${secret}`;
    this.setState({ loading: true });
    const res = await axios.get(endpoint);
    setTimeout(() => {
      this.setState({ user: res.data, loading: false });
    }, 1800);
  }

  //Get Users Github Repos
  getUserRepos = async (username) => {
    const endpoint = `${url}/users/${username}/repos?per_page=5&sort=created:asc&client_id=${id}&client_secret=${secret}`;
    this.setState({ loading: true });
    const res = await axios.get(endpoint);
    setTimeout(() => {
      this.setState({ repos: res.data, loading: false });
    }, 1800);
  }

  //Clear Users from State
  clearUsers = () => {
    this.setState({ users: [], loading: false });
  }

  //Set Alert
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });

    setTimeout(() => {
      this.setState({ alert: null })
    }, 5000);
  }

  render() {
    const { loading, users, user, alert, repos } = this.state;
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
                      searchUsers={ this.searchUsers }
                      clearUsers={ this.clearUsers }
                      showClear={ users.length > 0 ? true : false }
                      setAlert={ this.setAlert }
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
                    getUser={ this.getUser }
                    getUserRepos={ this.getUserRepos }
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
}

export default App;
