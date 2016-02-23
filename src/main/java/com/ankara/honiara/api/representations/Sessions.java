package com.ankara.honiara.api.representations;

import java.util.List;

public class Sessions {

	private List<Session> allUsers;

	public List<Session> getAllUsers() {
		return allUsers;
	}

	public void setAllUsers(List<Session> allUsers) {
		this.allUsers = allUsers;
	}
}
