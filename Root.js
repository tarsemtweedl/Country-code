import React, { Component } from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import App from './App';
import SecondScreen from './SecondScreen';

const Root = createStackNavigator({
  App: {
    screen: App,
  },
  SecondScreen: {
    screen: SecondScreen,
  },
}, {
  initialRouteName: 'App',
});
export default createAppContainer(Root);
