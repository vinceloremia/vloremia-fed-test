import React from 'react';
import ReactDOM from 'react-dom';
import storeInstance from './store/UserStore';
import App from './App';
import './css/main.css';

export const StoreContext = React.createContext();

ReactDOM.render(
	<React.StrictMode>
		<StoreContext.Provider value={storeInstance}>
			<App />
		</StoreContext.Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
