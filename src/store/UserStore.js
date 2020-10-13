import { action, runInAction, observable } from 'mobx';

class UserStore {
	@observable users = [];

	@action async fetchUsers() {
		const response = await fetch('https://randomuser.me/api/?results=5');
		const data = await response.json();

		runInAction(() => {
			this.users = data.results;
		});
	}
}

const userStore = new UserStore();

export default userStore;
