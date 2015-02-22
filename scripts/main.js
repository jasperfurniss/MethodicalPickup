(function() {
  'use strict';
  window.App = window.App || {};


  //********* Models & Collections *********//

  var MenuItemModel = Backbone.Model.extend({
      idAttribute: 'objectId',
      defaults: {
        name: '',
        details: '',
        price: ''
      }
  });

  var OrderModel = Backbone.Model.extend({
      idAttribute: 'objectId',
      defaults: function(attributes){
        attributes = attributes || {};
        return _.defaults(attributes, {
          items: []
       });
      },

      addItem: function(item){
        this.set('items', this.get('items').concat([item.toJSON()]));
      },

      totalPrice: function(){
        return this.get('items').reduce(function(acum, item) {
        return acum + item.price;
        }, 0);
      }
});


  var MenuItems = Backbone.Collection.extend({
    tagName: 'ul',
    className: 'menu-list',
    model: MenuItemModel,
    url: 'https://api.parse.com/1/classes/menuitem',
    parse: function(response){
      console.log(response);
      return response.results;
    }
  });

  var Orders = Backbone.Collection.extend({
    model: OrderModel,
    url: 'http:api.parse.com/1/classes/order',
    parse: function(response){
      console.log(response);
      return response.results;
    }
  });



  //********* Views *********//

  var IndexView = Backbone.View.extend({
    template: _.template($('#menu-list-template').text()),

    render: function(){
      this.$el.html(this.template());
      return this;
    }
  });

  var ItemDetailsView = Backbone.View.extend({
    template: _.template($('#item-details-template').text()),

    render: function(){
      this.$el.html(this.template());
      return this;
    }
  });

  var OrderView = Backbone.View.extend({
    template: _.template($('#order-template').text()),

    render: function(){
      this.$el.html(this.template());
      return this;
    }
  });


  //********* Router *********//

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'menuitem/:name': 'itemDetails'

    },

    initialize: function() {
      this.items = new MenuItems();
      this.items.fetch();

    },

    index: function() {
      // this.items.fetch();
      this.indexView = new IndexView();
      this.indexView.render();
      $('#app-container').html(this.indexView.el);

      this.orderView = new OrderView();
      this.orderView.render();
      $('#app-container').append(this.orderView.el);
    },

    itemDetails: function() {
      this.currentView = new ItemDetailsView();
      this.currentView.render();
      $('#app-container').html(this.currentView.el);

      this.orderView = new OrderView();
      this.orderView.render();
      $('#app-container').append(this.orderView.el);
    }
  });

  //******** Configuration *********//

  $.ajaxSetup({
 headers: {
   "X-Parse-Application-Id": "Atc3zF88fHZjO9egBcWnjos3Xc8U7RpeudTdsFJz",
   "X-Parse-REST-API-Key": "Qy74EWEXW8jnnwu7IR47crQxm8UwVYChlG5iENEY"
 }
});


  //******** Start Your Engines! *********//

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();
  });
})();
