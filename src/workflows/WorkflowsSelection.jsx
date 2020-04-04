import React, { useState } from 'react';
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
import { RoutesSelection, Selector } from './../routes/RoutesSelection';

const workflowFiles = {
    Balance,
    ClaimsNotification,
    PaymentNotification,
    PolicyRenewal,
    SendEsignatureEmail,
    ServiceNotification,
    Subscription,
    SubscriptionContinue,
    SubscriptionEnd,
    SubscriptionInit
};

export class WorkflowsSelection extends React.Component {

    state = {
        selectedWorkflow: { value: "" },
        workflowsAxa: [],
    }
    wfState = this.state.workflowsAxa;
    selWf = this.state.selectedWorkflow.value;

    componentWillMount() {
        Object.entries(workflowFiles).forEach(workflow => {
            this.wfState.push({
                fileName: workflow[0], def: workflow[1]
            });
        });
    }

    sendData = (e) => {
        let { name, value } = e.target;
        this.setState({[name]: [value],});
        const workflows = this.wfState.filter(o => o.fileName === value).map(o => o.def);
        this.props.handleChange(workflows[0]);
    }

    /**
     * handle event from routes
     */
    handleChange() {
        //Manage change of Route
    }

    render() {
        const Workflow = () =>
        <Selector options={this.wfState.map(({fileName}) => fileName)} onChangeFuncEve={this.sendData.bind(this.value)}  value={this.selWf} label="Fill Workflow File"/>;

        return (
            <div>
                <Workflow />
                <RoutesSelection handleChange={this.handleChange.bind(this, this.value)}></RoutesSelection>
            </div>
        )
    }
}