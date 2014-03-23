if (Meteor.isClient) {
  Template.search.searchTerms = function () {
    return Session.get("fts");
  };

  Template.search.events({
    'click #load-more' : function (event) {
      event.preventDefault();
      var options = Session.get("serachOptions") || {};

      options.offset = options.offset ? options.offset + 20 : 20;

      Session.set("serachOptions", options);

      Meteor.call('shopstyleProductSearch', options, function(error, result) {
        if (error) {
          alert('Error Code: ' + error.error + '\nError Reason: ' + error.reason);
          return;
        }

        console.log(result);
        var products = Session.get("products").concat(result.products);

        Session.set("products", products);
      });
    }
  });

  Template.search.products = function () {
    return Session.get("products");
  };

  Handlebars.registerHelper('productUrl', function(object) {
    var product = ({id :object.id });
    return new Handlebars.SafeString(
      Meteor.Router.searchProductPath(product)
    );
  });
}
