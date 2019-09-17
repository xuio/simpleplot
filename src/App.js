import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import SmoothieComponent, { TimeSeries } from 'react-smoothie';
import {
	Container,
	Navbar,
	NavbarBrand,
} from 'reactstrap';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = openSocket('http://localhost:3001');

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ts: [],
			plots: [],
		};
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
			})
		});

		socket.on('data', (data) => {
			for(const [i, datum] of data.entries()){
				this.state.ts[i].append(new Date().getTime(), datum);
			}
		});
	}

	render() {
		return (
			<div>
				<Navbar color="light" light expand="md">
					<NavbarBrand>Hopper Simpleplot</NavbarBrand>
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
