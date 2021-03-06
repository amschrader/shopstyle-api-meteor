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
        var options = _.extend(defaultQueryParameters, {
          "fts": searchTerm
        });
        Session.set("queryState", options);
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
  '/': function() {
    Session.set("queryState", defaultQueryParameters);
    return 'search';
  },

  '/search': function() {
    var options = Session.get("queryState") || defaultQueryParameters;
    Session.set("queryState", options);
    return 'search';
  },

  '/product/:id' : {
    as: 'searchProduct',
    to: function(id) {
      Session.set("product", null);
      Session.set('productId', id);
       Session.set("relatedProducts", []);

      Meteor.call('shopstyleProductFetch', {'id' : id}, function(error, result) {
        if (error) {
          alert('Error Code: ' + error.error + '\nError Reason: ' + error.reason);
          return;
        }

        console.log(result);
        Session.set("product", result);

        Meteor.call('shopstyleRelatedProductFetch', {'id' : id}, function(error, result) {
          if (error) {
            alert('Error Code: ' + error.error + '\nError Reason: ' + error.reason);
            return;
          }
          console.log(result);
          Session.set("relatedProducts", result.products);
        });
      });

      return 'product';
    }
  }
});
