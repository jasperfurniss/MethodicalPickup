(function() {
  'use strict';
  window.App = window.App || {};


  //********* Models & Collections *********//

  var MenuItemModel = Backbone.Model.extend({
      idAttribute: 'objectId',
  });

//   var OrderModel = Backbone.Model.extend({
//       idAttribute: 'objectId',
//       defaults: function(attributes){
//         attributes = attributes || {};
//         return _.defaults(attributes, {
//           items: []
//        });
//       },
//
//       addItem: function(item){
//         this.set('items', this.get('items').concat([item.toJSON()]));
//       },
//
//       totalPrice: function(){
//         return this.get('items').reduce(function(acum, item) {
//         return acum + item.price;
//         }, 0);
//       }
// });


  var MenuItems = Backbone.Collection.extend({
    model: MenuItemModel,
    url: 'https://api.parse.com/1/classes/menuitem',
    parse: function(response){
      console.log(response);
      return response.results;
    }
  });

  // var Orders = Backbone.Collection.extend({
  //   model: OrderModel,
  //   url: 'https://api.parse.com/1/classes/order',
  //   parse: function(response){
  //     console.log(response);
  //     return response.results;
  //   }
  // });



  //********* Views *********//


  var MenuView = Backbone.View.extend({
    template: _.template($('#menu-list-template').text()),

    el: '.js-menu-item-list',

    initialize: function(){
      this.listenTo(this.collection, 'sync', this.render);
    },

    render: function(){
      var self = this;
        // this.$el.empty();
      this.collection.each(function(MenuItemModel){
        var menuItemView = new ItemView({model: MenuItemModel});
        menuItemView.render();
        self.$el.append(menuItemView.el);
      });
    }
  });

  var ItemView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#menu-list-template').text()),

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  // var OrderView = Backbone.View.extend({
  //   template: _.template($('#order-template').text()),
  //
  //   render: function(){
  //     this.$el.html(this.template());
  //     return this;
  //   }
  // });



  //********* Router *********//

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'menuitem/:name': 'itemDetails'

    },

    initialize: function() {
      this.items = new MenuItems();
      this.itemsList = new MenuView({
        collection: this.items
      });
      this.items.fetch();

    },

    index: function() {
      this.itemsList.render();
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
