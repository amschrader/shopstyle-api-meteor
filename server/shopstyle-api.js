Meteor.methods({
  shopstyleCredentials: function() {
    return {
      pid: 'uid3156-3365966-87',
    };
  },

  shopstyleFilterTypes: [
    'Category',
    'Brand',
    'Retailer',
    'Price',
    'Discount',
    'Size',
    'Color'
  ],

  shopstyleEndpoints: function() {
    return {
      product: '/products/',
      productSearch: '/products',
      productsHistogram: '/products/histogram',
    };
  },

  shopstyleProductFetch: function(options) {
    var endpoint = Meteor.call('shopstyleEndpoints').product + options.id;
    var res = Meteor.call('shopstyleFetch', endpoint, options);

    if (res.id > 0) {
      return res;
    } else {
      return new Meteor.Error(res);
    }
  },

  shopstyleRelatedProductFetch: function(options) {
    var endpoint = Meteor.call('shopstyleEndpoints').product + options.id + '/related';
    var res = Meteor.call('shopstyleFetch', endpoint, options);

    if (res.products) {
      return res;
    } else {
      return new Meteor.Error(res);
    }
  },

  shopstyleProductSearch: function(options) {
    var endpoint = Meteor.call('shopstyleEndpoints').productSearch;
    var res = Meteor.call('shopstyleFetch', endpoint, options);

    if (res.products) {
      return res;
    } else {
      return new Meteor.Error(res);
    }
  },

  shopstyleProductHistogram: function(options) {
    if (options.filters === null) {
      return Meteor.Error("No filter groups provided");
    }
    var endpoint = Meteor.call('shopstyleEndpoints').productsHistogram;
    var res = Meteor.call('shopstyleFetch', endpoint, options);

    if (res.metadata.histograms) {
      return res;
    } else {
      return new Meteor.Error(res);
    }
  },

  shopstyleFetch: function(endpoint, options) {
    var apiUrl = 'http://api.shopstyle.com/api/v2' + endpoint;
    apiUrl += "?pid=" + Meteor.call('shopstyleCredentials').pid;
    Meteor._debug(apiUrl + "\n");

    this.unblock();

    var res = Meteor.http.get(apiUrl, {params: options});

    if (res.statusCode === 200) {
      return res.data;
    } else {
      return res.error;
    }
  }
});
