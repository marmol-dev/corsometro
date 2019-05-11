import screens from './screens'
import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import SideBar from '../components/SideBar'
import React from 'react'


const MainNavigator = createDrawerNavigator(
    screens,
    {
        initialRouteName: 'Prizes',
        //headerMode: 'none',
        contentComponent: props => <SideBar {...props} />
    }
);

export default createAppContainer(MainNavigator);

