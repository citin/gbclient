var root = document.getElementById('root');

// App
//   SearchBar
//   Menu
//   RestultList

var App = {
  view: () => {
    return m("div.container", {}, [
      m(SearchBar),
      //m(Menu),
      m(ResultList)
    ])
  }
}

var SearchBar = {
  view: () => {
    return m("div.jumbotron.d-flex.justify-content-center", {}, [
      m("input.input[type=text].button.w-50#queryText", {}),
      m("a.btn.btn-outline-warning", {onclick: (vnode) => startSearch()}, "Buscar")
    ])
  }
}

function startSearch() {
  var query = document.getElementById("queryText")
  Result.loadList(query.value);
	
  return false;
}
// ==========================

// -- Classes --

var Result = function(data) {
  data = data || {};

  this.title = data.title || "No Title";
  this.sum = data.sum || "No Summary";
  this.url = data.url || "No URL";
  return this;
}

Result.list = [];

Result.loadList = (query) => {
  m.request({
    method: "GET",
    url: "http://buscador.rio20.net/search?c=main&q=" + query + "&format=json",
  })
    .then((result) => {
      Result.list = result.results.map(
	(e) => new Result(e)
      )
    })
}

// -- Components --

var OneResult = {
  view: (vnode) => {
    var result = vnode.attrs.result
    return m('div', [
      m('h4' ,result.title),
      m("a", { href: "//" + result.url}, result.url),
      m('p' ,result.sum)        
    ])
  } 
}

var ResultList = {
  // oninit: () => Result.loadList(),
  view: function() {
    return m("div.list-group", [
      Result.list.map((result) => {
	return m("a.list-group-item.list-group-item-action", {}, m(OneResult, {result: result} ))	
      })
    ])
  }
}

m.mount(root, App)

