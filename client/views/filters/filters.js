if (Meteor.isClient) {
  defaultFilterState = {
    'brand': {
      'shortName': 'b',
      'activeFilters': []
    },
    'retailer': {
      'shortName': 'r',
      'activeFilters': []
    },
    'price': {
      'shortName': 'p',
      'activeFilters': []
    },
    'discount': {
      'shortName': 'd',
      'activeFilters': []
    },
    'color': {
      'shortName': 'c',
      'activeFilters': []
    },
    'size': {
      'shortName': 's',
      'activeFilters': []
    },
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
      var group = this.filters[filterGroup] || {};
      group.activeFilters.push(filterId);
      this.dep.changed();

      var allFilters = [];
      for (g in this.filters) {
        var group = this.filters[g];
        if (group.activeFilters.length > 0) {
          for (idx in group.activeFilters) {
            allFilters.push(group.shortName + group.activeFilters[idx]);
          }
        }
      }

      // can only apply one filter at a time.
      var options = _.extend(Session.get("queryState"), {
        "fl": allFilters
      });
      Session.set("queryState", options);
      return this.filters;
    },
    remove: function (filterGroup, filterId) {
      var group = this.filters[filterGroup] || {};
      _.pull(group.activeFilters, filterId);
      this.dep.changed();
      return this.filters;
    },
    clear: function (filterGroup) {
      if (filterGroup !== undefined) {
        this.filters.filterGroup.activeFilters = [];
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
    },
    'click .filter-contents li' : function (event) {
      event.preventDefault();
      filterId = jQuery(event.srcElement).data('id');
      filterGroup = jQuery(event.srcElement).parents('.filter-section').data('group');
      filterState.add(filterGroup , filterId);
    }
  });
}
