import React, { useState } from 'react';
import Continue from './continue.json';
import End from './end.json';
import Init from './init.json';
import Renew from './renew.json';
import Service from './service.json';
import Subscribe from './subscribe.json';

import { RoutesAxa } from './../components/Nodes/Workflow/RoutesAxa';

const routeFiles = {
    Continue,
    End,
    Init,
    Renew,
    Service,
    Subscribe
};

export const Selector = ({options, onChangeFuncEve = () => { }, label, value}) =>
    <div>
        <label>{label}</label>
        <select onChange={onChangeFuncEve} value={value}>
            <option />
            {options.map(o => <option key={o}>{o}</option>)}
        </select>
    </div>;

export class RoutesSelection extends React.Component {
    state = {
        clients: [],
        routesAxa: [],
        selectedOption: { value: "" },
        selectedOption2: { value: "" }
    }

    componentWillMount() {
        Object.entries(routeFiles).forEach(routeFile => {
            this.state.routesAxa.push({
                fileName: routeFile[0], def: routeFile[1].map((route, i) =>
                    new RoutesAxa(JSON.parse(JSON.stringify(route)))
                )
            });
        });
    }

    /** CALLABLE METHODS  */

    sendData = (e) => {
        let { name, value } = e.target;
        this.setState({
            [name]: e,
        });
        let routesJson = JSON.parse(value);
        let routes = [];
        routesJson.forEach(route => {
            routes.push(new RoutesAxa(route));
        });
        this.props.handleChange(routes);
    }

    handleChange = e => {
        this.setState({
            selectedOption: { value: e.target.value }
        });
        console.log(this.state.selectedOption);
    }

    handleChange2 = e => {
        this.setState({
            selectedOption2: { value: e.target.value }
        });
    }

    render() {

        /** CONDITIONS **/
        const currentRoutes = this.state.routesAxa.map(({ fileName }) => fileName);
        const filterClient = this.state.routesAxa.filter(routeFiles => routeFiles.fileName === this.state.selectedOption.value);
        const filterClientOptions = filterClient.length>0?filterClient.map(o => o.def):[{clientId:"",workflow:""}];

        const Client = () => (
            <Selector options={filterClientOptions[0].map(o => o.clientId)} onChangeFuncEve={this.handleChange2} label="Client" value={this.state.selectedOption2.value} />
        );
        const WF = () => (
            <Selector options={filterClientOptions[0].map(o => o.workflow)} onChangeFuncEve={this.handleChange2} label="Workflow" value={this.state.selectedOption2.value} />
        );

        console.log(currentRoutes);
        const Routes = () => <Selector options={currentRoutes} onChangeFuncEve={this.handleChange} label="Routes" value={this.state.selectedOption.value} />

        const selectClient = this.state.selectedOption.value ? <div><Client /><WF /></div> : <div />;

        return (
            <div>
                <Routes />
                {selectClient}
            </div>
        )
    }




}
