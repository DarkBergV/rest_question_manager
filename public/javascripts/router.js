class Router {
    constructor(routes){
    this.routes = routes;
    this.rootElem = document.getElementById('app')

    this.handleRoute();

    window.addEventListener('popstate', () => this.handleRoute());
}

handleRoute(){
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes['/404'];

    this.rootElem.innerHTML = route.template;

    document.title = route.title

}

navigate(path){
    window.history.pushState({}, '', path);
    this.handleRoute();

}
}