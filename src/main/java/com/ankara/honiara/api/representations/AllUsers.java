package com.ankara.honiara.api.representations;

import java.util.List;

public class AllUsers {

	private List<User> allUsers;

	public List<User> getAllUsers() {
		return allUsers;
	}

	public void setAllUsers(List<User> allUsers) {
		this.allUsers = allUsers;
	}
}
