import React from 'react';
import { workflows as Balance } from './balance_update.json';
import { workflows as ClaimsNotification } from './claims_notification.json';
import { workflows as PaymentNotification } from './payment_notification.json';
import { workflows as PolicyRenewal } from './policy_renewal.json';
import { workflows as SendEsignatureEmail } from './send_esignature_email.json';
import { workflows as ServiceNotification } from './service_notification.json';
import { workflows as Subscription } from './subscription.json';
import { workflows as SubscriptionContinue } from './subscription_continue.json';
import { workflows as SubscriptionEnd } from './subscription_end.json';
import { workflows as SubscriptionInit } from './subscription_init.json';
import { WorkflowAxa } from './../components/Nodes/Workflow/WorkflowAxa';
import { RoutesSelection } from './../routes/RoutesSelection';

export class WorkflowsSelection extends React.Component {
    /**
     * send callback
     */
    sendData = (e) => {
        let { name, value } = e.target;
        this.setState({
            [name]: e,
        });

        let myReturn = [];
        if(value){
            let workflowsAxa = JSON.parse(value);
            workflowsAxa.forEach(workflow => {
                myReturn.push(new WorkflowAxa(workflow));
            });
        }
        this.props.handleChange(myReturn);
    }
    /**
     * handle event from routes
     */
    handleChange(){
        //Manage change of Route
    }
    /**
     * get files from path
     */
    getWorkflows() {
        return { Balance, ClaimsNotification, PaymentNotification, PolicyRenewal, SendEsignatureEmail, ServiceNotification, Subscription, SubscriptionContinue, SubscriptionEnd, SubscriptionInit };
    }
    /**
     * read from the json file and push items to workflowAxa    let
     **/
    loadJsonWorkflow() {
        let workflows = [];
        Object.entries(this.getWorkflows()).forEach((element, i) => {
            let workflowsAxa = [];
            element[1].forEach(workflow => {
                workflowsAxa.push(new WorkflowAxa(JSON.parse(JSON.stringify(workflow))));
            });
            workflows.push(<option value={JSON.stringify(workflowsAxa)}>{element[0]}</option>);
        });
        return workflows;
    }

    render() {
        return (
            <div>
                <label>Routes:</label> <RoutesSelection handleChange={this.handleChange.bind(this, this.value)}></RoutesSelection>
                <label>Workflow:</label><select onChange={this.sendData} styleId="combo-workflows"><option></option> {this.loadJsonWorkflow()}</select>
            </div>
        )
    }
}
