import React from 'react';

jest.mock(
	'./App',
	() =>
		function App() {
			return <div>Mock App</div>;
		}
);

describe('App Mount', () => {
	it('mounts the App into the DOM root node', () => {
		const rootElement = document.createElement('div');
		rootElement.id = 'root';
		document.body.appendChild(rootElement);

		require('./index.js'); // eslint-disable-line global-require

		expect(rootElement.innerHTML).toMatchSnapshot();
	});
});
