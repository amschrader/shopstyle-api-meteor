// We do this manually so we can have multiple fl params on the url
_generateApiUrl = function(url, options) {
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      if (key.indexOf('fl') > -1) {
        for (filter in options[key]) {
          url = _addParam(url, key, options[key][filter]);
        }
      } else {
        url = _addParam(url, key, options[key]);
      }
    }
  }
  return url;
},

_addParam = function(url, key, value) {
  if (_.contains(url, '?')) {
    url += '&' + key + '=' + value;
  } else {
    url += '?' + key + '=' + value;
  }
  return url;
}

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

    this.unblock();

    var url = _generateApiUrl(apiUrl, options);
    Meteor._debug(url + "\n");

    var res = Meteor.http.get(url);

    if (res.statusCode === 200) {
      return res.data;
    } else {
      return res.error;
    }
  }
});
