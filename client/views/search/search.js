if (Meteor.isClient) {
  defaultQueryParameters = {
    "offset": 0,
    "limit": 20,
    "initial": true
  };

  Template.search.searchTerms = function () {
    return Session.get("fts");
  };

  Template.search.events({
    'click #load-more' : function (event) {
      event.preventDefault();
      var options = Session.get("queryState") || defaultQueryParameters;

      options.offset = options.offset ? options.offset + 20 : 20;
      options.initial = false;

      Session.set("queryState", options);
    },
    'click #filters .filter' : function (event) {
      event.preventDefault();
      var options = Session.get("queryState") || defaultQueryParameters;

      options.offset = options.offset ? options.offset + 20 : 20;
      options.initial = false;

      Session.set("queryState", options);
    }
  });

  Deps.autorun(function (c) {
    if (Session.get("queryState") !== undefined) {
      var options = Session.get("queryState");
      Meteor.call('shopstyleProductSearch', options, function(error, result) {
        if (error) {
          alert('Error Code: ' + error.error + '\nError Reason: ' + error.reason);
          return;
        }

        console.log(result);
        if (options.initial === true) {
          searchResults.set(result.products);
        } else {
          searchResults.append(result.products);
        }
      });

      var hOptions = _.extend(options, {
        'filters': 'Brand,Retailer,Size,Color,Price,Discount'
      });
      Meteor.call('shopstyleProductHistogram', hOptions, function(error, result) {
        if (error) {
          alert('Error Code: ' + error.error + '\nError Reason: ' + error.reason);
          return;
        }

        console.log(result);
        Session.set("brandHistogram", result.brandHistogram);
        Session.set("retailerHistogram", result.retailerHistogram);
        Session.set("sizeHistogram", result.sizeHistogram);
        Session.set("colorHistogram", result.colorHistogram);
        Session.set("priceHistogram", result.priceHistogram);
        Session.set("discountHistogram", result.discountHistogram);
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
