if (Meteor.isClient) {
  Template.search.searchTerms = function () {
    return Session.get("fts");
  };

  Template.search.events({
    'click #load-more' : function (event) {
      event.preventDefault();
      var options = Session.get("searchOptions") || {};

      options.offset = options.offset ? options.offset + 20 : 20;

      Session.set("searchOptions", options);

      Meteor.call('shopstyleProductSearch', options, function(error, result) {
        if (error) {
          alert('Error Code: ' + error.error + '\nError Reason: ' + error.reason);
          return;
        }

        console.log(result);
        searchResults.append(result.products);
      });
    }
  });

  searchResults = {
    products: [],
    dep: new Deps.Dependency,
    get: function () {
      this.dep.depend();
      return this.products;
    },
    set: function (newProducts) {
      this.products = newProducts;
      this.dep.changed();
      return this.products;
    },
    append: function (newProducts) {
      this.products = this.products.concat(newProducts);
      this.dep.changed();
      return this.products;
    }
  };

  Template.search.products = function() {
    return searchResults.get();
  };
}
