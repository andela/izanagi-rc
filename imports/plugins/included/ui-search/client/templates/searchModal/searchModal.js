import _ from "lodash";

import { Template } from "meteor/templating";
import { ProductSearch, Tags, OrderSearch, AccountSearch } from "/lib/collections";
import { IconButton } from "/imports/plugins/core/ui/client/components";

/*
 * searchModal extra functions
 */
function tagToggle(arr, val) {
  if (arr.length === _.pull(arr, val).length) {
    arr.push(val);
  }
  return arr;
}

/**
 * Custom helper function for sorting the return array based on maximum price comparison
 * @param {String} order - "asc" to sort in ascending order or "desc" to sort in descending order
 * @param {Array} productSearchResults - Array containg all the documents returned from a Products collections
 * @return {Array} - the passed in products array with all elements sorted based on their maximum price
 */
function sortByPrice(order, productSearchResults) {
  return _.orderBy(productSearchResults, ["price.max"], [order]);
}

/**
 * Custom helper function to sort product search results by date created (Newest Item)
 * @param {String} order - "asc" to sort in ascending order or "desc" to sort in descending order
 * @param {Array} productSearchResults - Array containing all the records returned from the ProductSearch collection.
 * @return {Array} - The passed in array sorted by dateCreated.
 */
function sortByDateCreated(order, productSearchResults) {
  return _.orderBy(productSearchResults,
    value => {
      return Date.parse(value.createdAt);
    },
    order);
}

/**
 * Custom helper method to sort product search results by quantity sold.
 * @param {String} order - specify the sort order (asc to sort in ascending and desc to sort in descending order)
 * @param {Array} productSearchResults - Array containing all the records returned from the ProductSearch collection
 * @return {Array} - The  produdsSearchResults array sorted accordingly.
 */
function sortByQuantitySold(order, productSearchResults) {
  return _.orderBy(productSearchResults, ["quantitySold"], [order]);
}

/**
 * Helper function for sorting the ProductSearch results based on different criterias
 * @param {String} sortOption - Option to sort the search results (newest, desPrice, ascPrice)
 * @param {Array} productSearchResults - Array containing the products search results to be sorted
 * @return {Array} the productsResults sorted based on the sort option
 */
function sortProductSearchResults(sortOption, productSearchResults) {
  switch (sortOption) {
    case "ascPrice": {
      return sortByPrice("asc", productSearchResults);
    }
    case "descPrice": {
      return sortByPrice("desc", productSearchResults);
    }
    case "newest": {
      return sortByDateCreated("desc", productSearchResults);
    }
    case "quantitySold": {
      return sortByQuantitySold("desc", productSearchResults);
    }
    default: {
      return productSearchResults;
    }
  }
}

/**
 * search modal extra function to help filter the search result based on returned venddors
 * @param{String} vendor - vendor we want to filter our search results by.
 * @param{Array} productSearchResults - Array containing current product search results.
 * @return{Array} Array containing products by the specified vendor
 */
function filterSearchByVendors(vendors, productSearchResults) {
  if (vendors.length === 0) {
    return productSearchResults;
  }
  const filteredSearchResult = [];
  productSearchResults.forEach((product) => {
    vendors.forEach((vendor) => {
      if (product.vendor === vendor) {
        filteredSearchResult.push(product);
      }
    });
  });
  return filteredSearchResult;
}

/*
 * searchModal onCreated
 */
Template.searchModal.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    initialLoad: true,
    slug: "",
    canLoadMoreProducts: false,
    searchQuery: "",
    productSearchResults: [],
    tagSearchResults: [],
    filterVendors: [],
    sortOption: "descPrice", // default sort option (descending price)
    productSearchVendors: [] // holds all brands found
  });


  // Allow modal to be closed by clicking ESC
  // Must be done in Template.searchModal.onCreated and not in Template.searchModal.events
  $(document).on("keyup", (event) => {
    if (event.keyCode === 27) {
      const view = this.view;
      $(".js-search-modal").fadeOut(400, () => {
        $("body").css("overflow", "visible");
        Blaze.remove(view);
      });
    }
  });


  this.autorun(() => {
    const searchCollection = this.state.get("searchCollection") || "products";
    const searchQuery = this.state.get("searchQuery");
    const facets = this.state.get("facets") || [];
    const sortOption = this.state.get("sortOption");
    const sub = this.subscribe("SearchResults", searchCollection, searchQuery, facets);
    const filterVendors = this.state.get("filterVendors");
    if (sub.ready()) {
      /*
       * Product Search
       */
      if (searchCollection === "products") {
        const productResults = ProductSearch.find().fetch();
        const productResultsCount = productResults.length;
        this.state.set("productSearchResults", filterSearchByVendors(filterVendors, sortProductSearchResults(sortOption, productResults)));
        this.state.set("productSearchCount", productResultsCount);

        const hashtags = [];
        const vendors = [];
        for (const product of productResults) {
          if (product.hashtags) {
            for (const hashtag of product.hashtags) {
              if (!_.includes(hashtags, hashtag)) {
                hashtags.push(hashtag);
              }
            }
          }
          // populate vendors array
          const vendor = product.vendor;
          console.log(vendor);
          if (vendor) {
            if (vendors.indexOf(vendor) === -1) {
              vendors.push(vendor);
            }
          }
        }
        this.state.set("productSearchVendors", vendors);

        const tagResults = Tags.find({
          _id: { $in: hashtags }
        }).fetch();
        this.state.set("tagSearchResults", tagResults);

        // TODO: Do we need this?
        this.state.set("accountSearchResults", "");
        this.state.set("orderSearchResults", "");
      }

      /*
       * Account Search
       */
      if (searchCollection === "accounts") {
        const accountResults = AccountSearch.find().fetch();
        const accountResultsCount = accountResults.length;
        this.state.set("accountSearchResults", accountResults);
        this.state.set("accountSearchCount", accountResultsCount);

        // TODO: Do we need this?
        this.state.set("orderSearchResults", "");
        this.state.set("productSearchResults", "");
        this.state.set("tagSearchResults", "");
      }

      /*
       * Order Search
       */
      if (searchCollection === "orders") {
        const orderResults = OrderSearch.find().fetch();
        const orderResultsCount = orderResults.length;
        this.state.set("orderSearchResults", orderResults);
        this.state.set("orderSearchCount", orderResultsCount);


        // TODO: Do we need this?
        this.state.set("accountSearchResults", "");
        this.state.set("productSearchResults", "");
        this.state.set("tagSearchResults", "");
      }
    }
  });
});


/*
 * searchModal helpers
 */
Template.searchModal.helpers({
  productOptions() {
    const sortOptions = [{
      label: "Highest Price", value: "Highest Price"
    }, {
      label: "Lowest Price", value: "Lowest Price"
    }, {
      label: "Newest Item", value: "Newest Item"
    }, {
      label: "Best Seller", value: "Best Seller"
    }];
    return sortOptions;
  },
  productSelectOptions() {
    const instance = Template.instance();
    return {
      buttonClass: "btn btn-white",
      nonSelectedText: "Check option",
      maxHeight: 200,
      buttonWidth: "290px",
      dropRight: true,
      onChange(option) {
        const selection = $(option).val();
        // sort in Ascending price
        if (selection === "Highest Price") {
          instance.state.set("sortOption", "descPrice");
        }
        // sort in Descending price
        if (selection === "Lowest Price") {
          instance.state.set("sortOption", "ascPrice");
        }
        // sort by Newest item (date created)
        if (selection === "Newest Item") {
          instance.state.set("sortOption", "newest");
        }
        // sort by Best seller
        if (selection === "Best Seller") {
          instance.state.set("sortOption", "quantitySold");
        }
      }
    };
  },
  vendorOptions() {
    const instance = Template.instance();
    const templateVendors = instance.state.get("productSearchVendors");
    const options = [];
    templateVendors.forEach((vendor) => {
      const option = {
        label: vendor,
        value: vendor
      };
      options.push(option);
    });

    return options;
  },
  vendorSelectOptions() {
    const instance = Template.instance();
    return {
      buttonClass: "btn btn-white",
      nonSelectedText: "Check option",
      maxHeight: 200,
      buttonWidth: "290px",
      templates: {
        filter: `<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon">
        <i class="fa fa-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>`,
        filterClearBtn: `<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button">
        <i class="fa fa-times"></i></button></span>`
      },
      selectAllText: "All Vendors",
      enableFiltering: true,
      enableCaseInsensitiveFiltering: true,
      disableIfEmpty: true,
      onChange(option, checked) {
        const filterVendor = $(option).val();
        if (checked) {
          const newFilterVendors = instance.state.get("filterVendors");
          newFilterVendors.push(filterVendor);
          instance.state.set("filterVendors", newFilterVendors);
        } else {
          const newFilterVendors = instance.state.get("filterVendors");
          newFilterVendors.splice(newFilterVendors.indexOf(filterVendor), 1);
          instance.state.set("filterVendors", newFilterVendors);
        }
      }
    };
  },
  IconButtonComponent() {
    const instance = Template.instance();
    const view = instance.view;

    return {
      component: IconButton,
      icon: "fa fa-times",
      kind: "close",
      onClick() {
        $(".js-search-modal").fadeOut(400, () => {
          $("body").css("overflow", "visible");
          Blaze.remove(view);
        });
      }
    };
  },
  productSearchResults() {
    const instance = Template.instance();
    const results = instance.state.get("productSearchResults");
    return results;
  },
  tagSearchResults() {
    const instance = Template.instance();
    const results = instance.state.get("tagSearchResults");
    return results;
  },
  showSearchResults() {
    return false;
  }
});


/*
 * searchModal events
 */
Template.searchModal.events({
  // on type, reload Reaction.SaerchResults
  "keyup input": (event, templateInstance) => {
    event.preventDefault();
    const searchQuery = templateInstance.find("#search-input").value;
    templateInstance.state.set("searchQuery", searchQuery);
    templateInstance.state.set("filterVendors", []);
    $(".search-modal-header:not(.active-search)").addClass(".active-search");
    if (!$(".search-modal-header").hasClass("active-search")) {
      $(".search-modal-header").addClass("active-search");
    }
  },
  "click [data-event-action=filter]": function (event, templateInstance) {
    event.preventDefault();
    const instance = Template.instance();
    const facets = instance.state.get("facets") || [];
    const newFacet = $(event.target).data("event-value");

    tagToggle(facets, newFacet);

    $(event.target).toggleClass("active-tag btn-active");

    templateInstance.state.set("facets", facets);
  },
  "click [data-event-action=productClick]": function () {
    const instance = Template.instance();
    const view = instance.view;
    $(".js-search-modal").delay(400).fadeOut(400, () => {
      Blaze.remove(view);
    });
  },
  "click [data-event-action=clearSearch]": function (event, templateInstance) {
    $("#search-input").val("");
    $("#search-input").focus();
    const searchQuery = templateInstance.find("#search-input").value;
    templateInstance.state.set("searchQuery", searchQuery);
  },
  "click [data-event-action=searchCollection]": function (event, templateInstance) {
    event.preventDefault();
    const searchCollection = $(event.target).data("event-value");

    $(".search-type-option").not(event.target).removeClass("search-type-active");
    $(event.target).addClass("search-type-active");

    $("#search-input").focus();

    templateInstance.state.set("searchCollection", searchCollection);
  }
});


/*
 * searchModal onDestroyed
 */
Template.searchModal.onDestroyed(() => {
  // Kill Allow modal to be closed by clicking ESC, which was initiated in Template.searchModal.onCreated
  $(document).off("keyup");
});
