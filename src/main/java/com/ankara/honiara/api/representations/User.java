package com.ankara.honiara.api.representations;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

//@EqualsAndHashCode
public class User {

	private String id;

	public User() {}
	
	public User(String id) {
		this.id = id;
	}
	
	@JsonProperty
	public String getId() {
		return id;
	}

	@JsonIgnore
	public void setId(String id) {
		this.id = id;
	}
	
	public boolean equals(Object other) {
		if (!(other instanceof User)) {
			return false;
		}
		User otherUser = (User) other;
		return Objects.equals(id, otherUser.id);
	}
	
	public int hashCode() {
		return Objects.hash(id);
	}
}
