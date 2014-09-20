if (Meteor.isClient) {

  Template.product.relatedProducts = function () {
    return Session.get("relatedProducts");
  };
}
