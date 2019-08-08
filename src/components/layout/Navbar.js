import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


const Navbar = (props) => {
  const { icon, title } = props;

  return (
    <nav className='navbar bg-primary'>
      <Link to='/'>
        <h1>
          <i className={ icon } /> { title }
        </h1>
      </Link>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
      </ul>
    </nav>
  )

}

//Default Props used if no props are passed
Navbar.defaultProps = {
  title: 'Github Finder',
  icon: 'fab fa-github'
};

//PropTypes are Type checkings
Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
}

export default Navbar;
