package com.ankara.honiara.api.representations;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Convo {

	private String id;
	private List<Session> users;
	private Map<String, String> content;
	
	@JsonProperty
	public String getId() {
		return id;
	}
	
	@JsonIgnore
	public void setId(String id) {
		this.id = id;
	}

	public List<Session> getUsers() {
		return users;
	}

	public void setUsers(List<Session> users) {
		this.users = users;
	}

	public Map<String, String> getContent() {
		return content;
	}

	public void setContent(Map<String, String> content) {
		this.content = content;
	}
}
