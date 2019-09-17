import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import SmoothieComponent, { TimeSeries } from 'react-smoothie';
import {
	Container,
	Navbar,
	NavbarBrand,
	Button,
	Modal,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Nav,
	NavItem,
	NavLink,
} from 'reactstrap';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

import DownloadFile from 'js-file-download';

import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = openSocket(':3001');

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ts: [],
			plots: [],
		};

		this.toggleModal = this.toggleModal.bind(this);
		this.saveConfig = this.saveConfig.bind(this);
		this.getLog = this.getLog.bind(this);
	}

	componentDidMount() {
		socket.on('setup', (data) => {
			console.log('setup', data);
			const plots = data;
			const ts = [];

			for(const plot of plots){
				ts.push(new TimeSeries({
					resetBounds: true,
					resetBoundsInterval: 3000,
				}));
			}

			this.setState({
				ts: ts,
				plots: plots,
				modal: false,
			});
		});

		socket.on('data', (data) => {
			for(const [i, datum] of data.data.entries()){
				this.state.ts[i].append(data.timestamp, datum);
			}
		});

		socket.on('log', (data) => {
			DownloadFile(data.data.toString(), data.name);
		});
	}

	getLog(){
		socket.emit('getLog');
	}

	toggleModal() {
		this.setState(prevState => ({
			modal: !prevState.modal
		}));
	}

	saveConfig() {
		console.log('save!');
		console.log(this.state.plots);
		this.toggleModal();
	}

	config = {
		test: 'test',
	};

	render() {
		return (
			<div>
				<Navbar color="light" light expand="md">
					<NavbarBrand>Hopper Simpleplot</NavbarBrand>
					<Nav className="ml-auto" navbar>
						<NavItem right>
							<NavLink style={{cursor: 'pointer'}} onClick={this.getLog}>
								<b>Get Latest Log</b>
							</NavLink>
						</NavItem>
					</Nav>
				</Navbar>
				<Container>
					{this.state.ts.map((ts, index) => (
						<div key = {index}>
							<h1>
								{this.state.plots[index].name}
							</h1>
							<SmoothieComponent
								responsive
								height={200}
								series={[
									{
										data: ts,
										strokeStyle: { g: 255 },
										fillStyle: { g: 255 },
										lineWidth: 4,
									}
								]}
							/>
						</div>
					))}
					<Modal isOpen={this.state.modal} toggle={this.toggleModal}>
						<ModalHeader toggle={this.toggle}>Edit Config</ModalHeader>
						<ModalBody>
							<Editor
								value={this.state.plots}
								onChange={this.handleChange}
								ace={ace}
								theme="ace/theme/github"
								// schema={yourSchema}
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" onClick={this.saveConfig}>Save</Button>{' '}
							<Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
						</ModalFooter>
					</Modal>
				</Container>
			</div>
		);
	}
}

export default App;
