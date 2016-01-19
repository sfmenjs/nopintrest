angular.module('app').filter('searchFilter', function() {
   return function(items, word) {
    if(!word) return items;
    var filtered = [];

    var pushed;
    angular.forEach(items, function(item) {
      if(item.hasOwnProperty('title'))
        if(item.title.toLowerCase().indexOf(word.toLowerCase()) !== -1){
            filtered.push(item);
            return;
        }
      if(item.hasOwnProperty('hashtag'))
        if(item.hashtag.join().toLowerCase().indexOf(word.toLowerCase()) !== -1) {
          filtered.push(item);
          return;
        }
      if(item.username.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
        filtered.push(item);
      }
    });

    return filtered;
  };
});
