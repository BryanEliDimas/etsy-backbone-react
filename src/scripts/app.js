/////////////////
// React part //
////////////////

import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'

var app = function(){

  var EtsyView = React.createClass({
    render: function(){
      return(
        <div className="whole-container">
          <NavBar />
          <ListingsContainer etsyColl={this.props.etsyColl} />
        </div>
      )
    }
  })

  var ListingsContainer = React.createClass({
    listings: function(mods){
      var arr = []

      mods.forEach(function(mod){
        arr.push(<SingleListing listingTitle={mod.get("title")} listingImage={mod.get("Images")[0].url_170x135} price={mod.get("price")} seller={mod.get("Shop").shop_name} link={mod.get("url")} key={mod.get("listing_id")} />)
      })

      return arr
    },

    render: function(){
      return(
        <div className="listings-container">
          { this.listings(this.props.etsyColl.models) }
        </div>
      )
    }
  })

  var SingleListing = React.createClass({
    render: function(){
      return(
        <div className="single-listing">
          <img src={this.props.listingImage}></img>
          <h1>{this.props.listingTitle}</h1>
          <p>${this.props.price}</p>
          <p>{this.props.seller}</p>
          <p>{this.props.link}</p>
        </div>
      )
    }
  })

  var NavBar = React.createClass({
    render: function(){
      return(
        <div className="nav-bar">
          <h1>Etsy</h1>
          <input />
        </div>
      )
    }
  })


  ////////////////////
  // Backbone part //
  ///////////////////

  var myColl = Backbone.Collection.extend({
    url: "https://openapi.etsy.com/v2/listings/active.js",
    myKey: "10243cxzp19r2j811w41ocxi",

    parse: function(api_response){
      // the results from the api_response come as json objects,
      // but the parse magic adds those response objects (retuned below) as attributes to each model!
      return api_response.results
    }
  })

  var myRouter = Backbone.Router.extend({
    routes: {
      "home": "activeListings",
      "search/:query": "searchIt",
      "details/:id": "showOne",
      "*catchall": "goHomeBruh"
    },

    initialize: function(){
      Backbone.history.start()
    },

    goHomeBruh: function(){
      location.hash = "home"
    },

    activeListings: function(){
      var etsyColl = new myColl()

      etsyColl.fetch({
        dataType: "jsonp",
        data: {
          api_key: etsyColl.myKey,
          includes: "Images,Shop"
        }
      })
      .then(function(){
        ReactDOM.render(<EtsyView etsyColl={etsyColl} />, document.querySelector(".container"))
        // window.yes = booyah
        console.log(booyah)
      })
      .catch(function(err){
        console.log("Oh, crap. Error in activeListings", err)
      })

    },

    searchIt: function(searchTerm){
      var etsyColl = new myColl()

      etsyColl.fetch({
        dataType: "jsonp",
        data: {
          api_key: etsyColl.myKey,
          keywords: searchTerm
        }
      })
      .then(function(searchResults){
        // window.searchResults = searchResults;
        console.log("Search worked I guess")
      })
      .catch(function(err){
        console.log("Oh, crap. Error in search", err)
      })
    },

    showOne: function(theID){
      var etsyColl = new myColl()
      etsyColl.url = "https://openapi.etsy.com/v2/listings/" + theID + ".js"

      etsyColl.fetch({
        dataType: "jsonp",
        data: {
          api_key: etsyColl.myKey,
        }
      })
      .then(function(resp){
        // window.showOne = etsyColl
        // window.showOne = resp
        // console.log("Showing one item worked I guess. in showOne")
      })
      .catch(function(err){
        console.log("Oh, crap. Error in showOne", err)
      })
    }
  })
  new myRouter()

}

app()



