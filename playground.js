var fs = require('fs');
var jsdom = require("jsdom");
var shorturl = require('shorturl');
var async = require('async');

var htmlSource = fs.readFileSync("dummy.html", "utf8");

console.log( htmlSource );
jsdom.env(
  htmlSource,
  ["http://code.jquery.com/jquery.js"],
  function (errors, window) {
    async.each(window.$('a').get(), function(element, callback) {
      var el = window.$(element);
      shorturl(el.attr('href'), 'goo.gl', function(result) {
        el.attr('href', result);
        // Register this iteration as done
        callback();
      });
    }, function(){
      console.log(documentToSource(window.document));
    });
  }
);

function documentToSource(doc) {
  // The non-standard window.document.outerHTML also exists,
  // but currently does not preserve source code structure as well

  // The following two operations are non-standard
  return doc.doctype.toString()+doc.innerHTML;
}