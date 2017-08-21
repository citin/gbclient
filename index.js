var root = document.getElementById('root');

// App
//   SearchBar
//   Menu
//   RestultList

// -- Components --

var App = {
  view: () => {
    return m("div.container", {}, [
      m(SearchBar),
      //m(Menu),
      m(ResultList),
      m(PageList)
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
  view: () => {
    return m("div.list-group", [
      Result.list.map((result) => {
        return m("a.list-group-item.list-group-item-action", {}, m(OneResult, {result: result} ))	
      })
    ])
  }
}


var PageList = {
  oninit: () => {
    Paginator.current = new Paginator();
  },
  view: () => {
    return m("ul.pagination.justify-content-center", {}, [
      m("li.page-item", [m("a.page-link", {href: "#",
        onclick: () => { 
          Paginator.current.previous();
          startSearch();
        }   
      }, "<<")]),
      // m("li.page-item", [m("a.page-link", {href: "#"}, "1")]),
      // m("li.page-item", [m("a.page-link", {href: "#"}, "2")]),
      // m("li.page-item", [m("a.page-link", {href: "#"}, "3")]),
      m("li.page-item", [m("a.page-link", {href: "#",
        onclick: () => { 
          Paginator.current.next();
          startSearch();
        }   
      }, ">>")])
    ])
  }
}

// parametros importantes para la query llamado:
// n=2 => cantidad de resultados
// s=2 => desde donde empezar a listar
// spell=1 => suggestions 
// relqueries
// sortby => Use 0 to sort results by relevance, 1 to sort by most 
//  recent spider date down, and 2 to sort by oldest spidered results first.
//

// parametros de respuesta imporatnets:
// "moreResultsFollow":1
// spellingSuggestion

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
    url: "http://buscador.rio20.net/search?c=main&" +
      "q=" + query + 
      "&format=json" + 
      "&n=" + Paginator.results_per_page() +
      "&s=" + Paginator.current_index(),
  })
    .then((result) => {
      // global results params
      
      // each result
      Result.list = result.results.map(
        (e) => new Result(e)
      )
    })
}

var Paginator = function(page, total) {
  page = page || 0;
  total  = total  || 1;

  this.current_page = page;
  this.total        = total;
  this.next         = () => this.current_page = this.current_page + 1;
  this.previous     = () => this.current_page = this.current_page - 1;

  return this;
}

Paginator.current = {};
Paginator.results_per_page = () => { return 10 };
Paginator.current_index    = () => { return Paginator.current.current_page * Paginator.results_per_page() };

// =========== init app =========== //  

m.mount(root, App)

