import React, {useEffect, useContext, useState, useCallback} from 'react'
import { log } from '../hooks/hooks';
import { useHistory, useLocation } from "react-router-dom";

export const Logout = () => {

    const history = useHistory();

    useEffect(() => {
        //alert('LOGOUT')
        log() && console.log('LOGOUT')
        localStorage.removeItem('token');
        setTimeout(() => {
            document.location.reload(true);
        }, 500)
        
        /*history.push({
            pathname: '/login',
        })*/
        return () => {

        } 
    },[])

    return (
        <div className='topMost'>
           
       
        </div>)
}