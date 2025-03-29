
class Router {
    constructor(routes){
        this.routes = routes;
        this._loadInitialRoute();
    }

    loadRoute(questions,id){
        const matchedRoute = this._matchUrlToRoute(question);
        const url = `/${[questions, id].join('/')}`

        history.pushState({}, '', url)

        const routerOutletElement = document.querySelectorAll('[data-router-outlet]')[0];
        routerOutletElement.innerHTML = matchedRoute.getTemplate(matchedRoute.params);
    }

    _matchUrlToRoute(urlSegments){
        const routeParams = {}
        
        const matchedRoute = this.routes.find(route => {
            const routePathSegments = route.path.split('/').slice(1);

            if (routePathSegments.length !== urlSegments.length){
                return false
            }

            const match =  routePathSegments.every((routePathSegment, i) => {
                return routePathSegment === urlSegments[i] || routePathSegment[0] === ':';
            });
        

        if (match) {
            routePathSegments.forEach((urlSegments,i) => {
                if (segment[0] === ':'){
                    const propName = segment.slice(1);
                    routeParams[propName] = decodeURIComponent(urlSegments[i])
                }
            });
        }
        return match 
    });
    return {matchedRoute, params: routeParams}
    }

    _loadInitialRoute(){
        const pathnameSplit = window.location.pathname.split('/');
        const pathSegments = pathnameSplit.length > 1 ?pathnameSplit.slice(1) : '';

        this.loadRoute(pathSegments);
    }
}