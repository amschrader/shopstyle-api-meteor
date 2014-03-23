if (Meteor.isClient) {
  Template.home.greeting = function () {
    return "Welcome to shopstyle-api-meteor.";
  };

  Template.home.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
      console.log("You pressed the button");
    }
  });

  Template.header.events({
    'keyup #search' : function (event, element) {
      if (event.keyCode == 13) {
        var searchTerm = $("#search").val();
        //create the initial search options with defaults
        var options = {
          "fts": searchTerm,
          "offset": 0,
          "limit" : 20,
          "filters": "Brand,Size,Color,Price,Discount"
        };

        Session.set("searchOptions", options);
        Meteor.Router.to('/search');
      }
    }
  });

  Template.product.product = function () {
    return Session.get("product");
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  // code to run on server at startup
  });
}

Meteor.Router.add({
  '/': 'home',

  '/search': function() {
    Session.set("products", null);

    var options = Session.get("searchOptions") || {};
    if (options !== undefined) {
      // get the initial products
      Meteor.call('shopstyleProductSearch', options, function(error, result) {
        if (error) {
          alert('Error Code: ' + error.error + '\nError Reason: ' + error.reason);
          return;
        }

        console.log(result);
        Session.set("products", result.products);
      });

      //get the product histogram
      Meteor.call('shopstyleProductHistogram', options, function(error, result) {
        if (error) {
          alert('Error Code: ' + error.error + '\nError Reason: ' + error.reason);
          return;
        }

        console.log(result);
        Session.set("filterHistogram", result);
      });
    } else {
      return "noresults";
    }

    return 'search';
  },

  '/product/:id' : { as: 'searchProduct', to: function(id) {
    Session.set("product", null);
    Session.set('productId', id);

    Meteor.call('shopstyleProductFetch', {'id' : id}, function(error, result) {
      if (error) {
        alert('Error Code: ' + error.error + '\nError Reason: ' + error.reason);
        return;
      }

      console.log(result);
      Session.set("product", result);
    });

    return 'product';
    }
  }
});










