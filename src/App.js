import React, { useReducer, Fragment, useEffect, useState } from 'react';
import { Container } from "semantic-ui-react";
import './App.css';
import { Route, Switch, Router, useHistory   } from "react-router-dom";

import {SignIn} from "./pages/SignIn";
import {Aguarde} from "./pages/Aguarde";
import {LogIn} from "./pages/LogIn";
import {LiveEvent} from "./pages/LiveEvent";
import {Quiz} from "./pages/Quiz";
import {Pesquisa} from "./pages/Pesquisa";
import {Associacao} from "./pages/Associacao";
import {Lobby} from "./pages/Lobby";
import {Header} from "./pages/Header";
import {Rodape} from "./pages/Rodape";
import {Ranking} from "./pages/Ranking";
import {Logout} from "./pages/Logout";
import { logginReducer, Dispatch, log } from './hooks/hooks';

export default function App() {

  const reducer = useReducer(logginReducer, {token:false, salas:[]})
  const [{salas}, dispatch] = reducer;

  const localtoken = localStorage.getItem('token');
  const history = useHistory(); 

  const [currentPathname, setcurrentPathname] = useState('/')
  const [currentSearch, setcurrentSearch] = useState(null)

  useEffect(() => {
   // console.log('localtoken:', localtoken)
   // dispatch({type:'token', payload:'localtoken'})
   history.listen((newLocation, action) => {
    log() && console.log(newLocation, action)
   //  getNewPath(newLocation, action)
    
  });

  window.addEventListener('popstate', function (event){
    window.history.pushState("null", document.title,  window.location.href);
});

    if(localtoken !== false){
      //setTimeout(() => {
        dispatch({type:'token', payload:localtoken})
     // },5000)
     // dispatch({type:'logged', payload:true})
      //startConnection() 
    }

    return () => {
      window.onpopstate = null;
    }

  },[])

  const getNewPath = (newLocation, action) => {
    if (action === "PUSH") {
      log() && console.log(newLocation.pathname, currentPathname)
      if (
        newLocation.pathname !== currentPathname ||
        newLocation.search !== currentSearch
      ) {
        // Save new location
        setcurrentPathname(newLocation.pathname);
        setcurrentSearch(newLocation.search);

        // Clone location object and push it to history
        /*history.push({
          pathname: newLocation.pathname,
          search: newLocation.search
        });*/
      }
    } else {
      log() && console.log('back')
      // Send user back if they try to navigate back
      history.go(1);
    }
  }

  /*useEffect(() => {
    history.push({
      pathname: currentPathname,
      search: currentSearch
    });

  },[currentPathname])*/

 

  useEffect(() => {
    //console.log(salas)
   /* console.log('APP')
    setTimeout(() => {
      history.push({
        pathname: '/liveevent',
      });
    },5000)*/
  },[])

  

    return (
      <div>
        <Dispatch.Provider value = {reducer}>
        <Switch>
          <Fragment>
            <Container>
              
                <Route path="/">
                  <Header />
                </Route>
                <Route exact path="/idle">
                  <Aguarde />
                </Route>
                <Route exact path="/lobby">
                  <Lobby />
                </Route>
                <Route exact path="/login">
                  <LogIn />
                </Route>
                <Route exact path="/signin">
                  <SignIn />
                </Route>
                <Route exact path="/liveevent">
                  <LiveEvent />
                </Route>
                <Route exact path="/quiz">
                  <Quiz />
                </Route>
                <Route exact path="/pesquisa">
                  <Pesquisa />
                </Route>
                <Route exact path="/associacao">
                  <Associacao />
                </Route>
                <Route exact path="/ranking">
                  <Ranking />
                </Route>
                <Route exact path="/logout">
                  <Logout />
                </Route>

             
            </Container>
          </Fragment>
        </Switch>
        <Rodape />
        </Dispatch.Provider>
        </div>
    );
  
  }

