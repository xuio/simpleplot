import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import SmoothieComponent, { TimeSeries } from 'react-smoothie';
import {
	Container,
	Navbar,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
} from 'reactstrap';

import DownloadFile from 'js-file-download';

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

	saveConfig() {
		console.log('save!');
		console.log(this.state.plots);
		this.toggleModal();
	}

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
				</Container>
			</div>
		);
	}
}

export default App;
