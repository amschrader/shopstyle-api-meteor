  Handlebars.registerHelper('productUrl', function(object) {
    var product = ({id :object.id });
    return new Handlebars.SafeString(
      Meteor.Router.searchProductPath(product)
    );
  });
