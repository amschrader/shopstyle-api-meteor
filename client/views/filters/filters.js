if (Meteor.isClient) {
  defaultFilterState = {
    'brand': [],
    'retailer': [],
    'price': [],
    'discount': [],
    'color': [],
    'size': []
  };

  filterState = {
    filters: _.clone(defaultFilterState),
    dep: new Deps.Dependency,

    get: function () {
      this.dep.depend();
      return this.filters;
    },
    add: function (filterGroup, filterId) {
      // if group is not defined, define it.
      this.filters.filterGroup = this.filters.filterGroup || [];
      this.filters.filterGroup.push(filterId);
      this.dep.changed();
      return this.filters;
    },
    remove: function (filterGroup, filterId) {
      this.filters.filterGroup = this.filters.filterGroup || [];
      _.pull(this.filters.filterGroup, filterId);
      this.dep.changed();
      return this.filters;
    },
    clear: function (filterGroup) {
      if (filterGroup !== undefined) {
        this.filters.filterGroup = [];
      } else {
        this.filters = _.clone(defaultFilterState);
      }
      this.dep.changed();
      return this.filters;
    }
  };

  Template.filters.filterGroups = function () {
    return filterState.get();
  };

  Template.filters.brandHistogram = function () {
    return Session.get("brandHistogram");
  };

  Template.filters.retailerHistogram = function () {
    return Session.get("retailerHistogram");
  };

  Template.filters.colorHistogram = function () {
    return Session.get("colorHistogram");
  };

  Template.filters.priceHistogram = function () {
    return Session.get("priceHistogram");
  };

  Template.filters.discountHistogram = function () {
    return Session.get("discountHistogram");
  };

  Template.filters.events({
    'click .filter-title' : function (event) {
      event.preventDefault();
      jQuery(event.srcElement).siblings('.filter-contents').show();
    }
  });
}
