import React from 'react';
import { useObserver } from 'mobx-react';
import storeInstance from './store/UserStore';

export default function App() {
	const [loading, setLoading] = React.useState('...');
	React.useEffect(() => {
		storeInstance.fetchUsers().then(() => setLoading());
	}, []);
	return useObserver(() => (
		<>
			{loading}
			{storeInstance.users.map(user => (
				<div className="card" key={user.cell}>
					<div className="imageContainer">
						<img src={user.picture.large} alt="Avatar" />
					</div>
					<div className="container">
						<h4>
							{user.name.title} {user.name.first} {user.name.last}
						</h4>
						<p>{user.email}</p>
						<p>{user.cell}</p>
					</div>
				</div>
			))}
		</>
	));
}
