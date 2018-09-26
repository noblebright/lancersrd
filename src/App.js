import React, { Component } from 'react';
import { Navbar, NavbarBrand, Jumbotron } from "reactstrap";
import { StoreContext, load } from "./services/Store";
import { Switch, Route, Link } from "react-router-dom";
import Weapons from "./Weapons";
import Systems from "./Systems";
import Actions from "./Actions";
import Shells from "./Shells";
import Statuses from "./Statuses";
import TagDefs from "./TagDefs";
import CoreBonuses from "./CoreBonuses";
import {CorpList, default as Corps} from "./Corps";
import './App.css';

class App extends Component {
  state = {};

  componentDidMount() {
      load().then(data => this.setState(data));
  }

  render() {
    return (
        <div className="app">
          <StoreContext.Provider value={this.state}>
              <Navbar className="navHeader">
                  <NavbarBrand tag={Link} to="/">Omninet - Lancer SRD</NavbarBrand>
              </Navbar>
              <main className="content">
                  {!this.state.loaded ? <div>loading...</div> :
                  <Switch>
                      <Route exact path="/" component={Index}/>
                      <Route path="/coreBonuses" component={CoreBonuses}/>
                      <Route path="/weapons" component={Weapons}/>
                      <Route path="/systems" component={Systems}/>
                      <Route path="/actions" component={Actions}/>
                      <Route path="/shells" component={Shells}/>
                      <Route path="/statuses" component={Statuses}/>
                      <Route path="/tags" component={TagDefs}/>
                      <Route path="/corps" component={Corps}/>
                  </Switch> }
              </main>
          </StoreContext.Provider>
        </div>
    );
  }
}

const Index = () => (
    <div>
        <Jumbotron>
            <h1 className="display-3">Welcome to the Lancer SRD</h1>
            <p className="lead">It’s 5014, and our arm of the galaxy is home to trillions. It is not a safe place, but
                it burns bright</p>
            <hr className="my-2"/>
            <p>The Omninet connects all of humanity to one another, a decentralized network that links every computer,
                every server, every thing to everything. More than just a way to communicate, more than just a way for
                far-ﬂung worlds to read of the galaxy’s news and listen to the music of the spheres, the Omninet
                facilitates government and industry. Data is the new wealth, and the Omninet allows for the sharing of
                the wealth of all worlds.</p>
        </Jumbotron>
        <article className="columns">
            <section className="index">
                <h1>Gear Lists</h1>
                <ul>
                    <li><Link to="/coreBonuses">Core Bonuses List</Link></li>
                    <li><Link to="/weapons">Weapons List</Link></li>
                    <li><Link to="/systems">Systems List</Link></li>
                    <li><Link to="/actions">Granted Actions List</Link></li>
                    <li><Link to="/shells">Shells List</Link></li>
                    <li><Link to="/statuses">Statuses List</Link></li>
                    <li><Link to="/tags">Tags List</Link></li>
                </ul>
            </section>
            <section className="corpIndex">
                <h1>Corporations</h1>
                <CorpList/>
            </section>
        </article>
    </div>
);

export default App;
