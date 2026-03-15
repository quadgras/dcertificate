import 
{ 
    type RouteConfig, 
    index, 
    prefix, 
    route, 
    layout 

} from "@react-router/dev/routes";

export default [
    index("routes/home.jsx"),
    // route("search-certificate", ""),
    // route("certificate", ""),
    // ...prefix("recepient", [
    //     route("login", ""),
    //     route("register", ""),
    //     layout("", [
    //         route("account", ""),
    //         route("certificates", "")
    //     ])
    // ]),
    // ...prefix("issuer", [
    //     route("login", ""),
    //     route("register", ""),
    //     layout("", [
    //         route("account", ""),
    //         route("certifications", ""),
    //         route("certificates", ""),
    //         route("approvals", "")
    //     ])
    // ])
] satisfies RouteConfig;
