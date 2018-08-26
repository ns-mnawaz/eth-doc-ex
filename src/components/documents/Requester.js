import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requesterDocs } from "../../redux/actions/documents";
import accountsConst from '../../constants/accounts';
import Loader from "../common/Loader";
import {Redirect} from "react-router-dom";
import menu from "../../constants/menu";
import truncate from 'lodash/truncate';

@connect((store) => {
  return {
    user: store.user,
    documents: store.documents
  };
})

export default class Requester extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getStatusLabel: accountsConst.getStatusLabel,
      redirect: false,
      documents: menu.documents,
      isRequester: props.user.details.type === 1,
      url: ''
    };
  }
  componentDidMount(){
    this.props.dispatch(requesterDocs({account: this.props.user.details.account, total: this.props.user.count.total}));
    if (!this.state.isRequester)
      this.setState({redirect: true, url: this.state.documents.list})
  }
  back = () =>{
    this.setState({redirect: true, url: this.state.documents.list})
  };
  render() {
    if(this.props.documents.loading)
      return (<Loader />);
    if(this.state.redirect)
      return (<Redirect to={this.state.url}/>);
    return (
      <div className='container'>
        <div className='row align-center'>
          <div className='col-12'>
            <table className="table table-hover">
              <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Address</th>
                <th>Status</th>
                <th>View</th>
              </tr>
              </thead>
              <tbody>
              {
               this.props.documents.requesterDocs.map((doc, index)=>{
                 let statusLabel = this.state.getStatusLabel(doc.status).label;
                 return (
                   <tr key={index}>
                   <td>{doc.name}</td>
                   <td>{doc.description}</td>
                   <td data-toggle="tooltip" title={doc.address}>{truncate(doc.address, {length: 15})}</td>
                   <td className={statusLabel}>{statusLabel}</td>
                     <td><a href={doc.link} target='_blank'> View </a></td>
                 </tr>
                 );
               })
              }
              </tbody>
            </table>
          </div>
        </div>
        <div className='float-right'>
          <button type="button" className="btn btn-info" onClick={this.back}>Back</button>
        </div>
        <div className='clear'> </div>
      </div>
    );
  }

};