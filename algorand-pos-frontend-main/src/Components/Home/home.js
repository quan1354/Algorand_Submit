import '../Menu/homemenu.css';
import React, { Component } from 'react';

class Home extends Component {
  state = {
    menuItems: [],
  };

  componentDidMount() {
    // Load menu items when the component mounts
    this.loadMenuItems();
  }

  loadMenuItems = () => {
    // Make an HTTP GET request to fetch menu items from the backend
    fetch('http://localhost:5000/getmenu') // Replace with the correct backend URL
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the menu items received from the backend
        this.setState({ menuItems: data });
      })
      .catch((error) => {
        console.error('Error loading menu items:', error);
      });
  };

  render() {
    const menuItemsList = this.state.menuItems.map((item) => (
      <div key={item.UID} className="pos-menu-item">
        <span>{item.item}</span>
      </div>
    ));

    return (
        <div className="login_background">
      <div className="BoxContainer">
        <div >
            {menuItemsList}
            </div>
            </div>
      </div>
    );
  }
}

export default Home;
