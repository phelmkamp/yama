package com.ankara.honiara.api.representations;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Convo /*extends BaseRep*/ {

	private String id;
	private List<User> users;
//	private Map<String, String> content;
	
	@JsonProperty
	public String getId() {
		return id;
	}
	
	@JsonIgnore
	public void setId(String id) {
		this.id = id;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	/*public Map<String, String> getContent() {
		return content;
	}

	public void setContent(Map<String, String> content) {
		this.content = content;
	}*/
}
