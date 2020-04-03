import React from 'react';
import Continue from './continue.json';
import End from './end.json';
import Init from './init.json';
import Renew from './renew.json';
import Service from './service.json';
import Subscribe from './subscribe.json';

import { WorkflowAxa as RoutesAxa } from './../components/Nodes/Workflow/WorkflowAxa';

export class RoutesSelection extends React.Component {

    sendData = (e) => {
        let { name, value } = e.target;
        this.setState({
            [name]: e,
        });
        let routesAxa = JSON.parse(value);
        let myReturn = [];
        routesAxa.forEach(workflow => {
            myReturn.push(new RoutesAxa(workflow));
        });
        this.props.handleChange(myReturn);
    }
    /**
     * get files from path
     */
    getRoutes() {
        return {
            Continue,
            End,
            Init,
            Renew,
            Service,
            Subscribe
        }
    }
    /**
     * read from the json file and push items to RoutesAxa  
     **/
    loadRoutes() {
        let routes = [];
        Object.entries(this.getRoutes()).forEach((element, i) => {
            let routesAxa = [];
            console.log(element)
            element[1].forEach(route => {
                routesAxa.push(new RoutesAxa(JSON.parse(JSON.stringify(route))));
            });
            routes.push(<option value={JSON.stringify(routesAxa)}>{element[0]}</option>);
        });
        return routes;
    }

    render() {
        return (
            <select onChange={this.sendData} styleId="combo-routes"><option></option> {this.loadRoutes()}</select>
        )
    }
}
