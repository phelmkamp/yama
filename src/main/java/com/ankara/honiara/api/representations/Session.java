package com.ankara.honiara.api.representations;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Entity
public class Session {

	@Id
	private String id;
	private String username;
	private String displayName;
	private String iconUrl;

	public Session() {}
	
	public Session(String id, String username, String displayName) {
		this.username = username;
		this.id = id;
		this.setDisplayName(displayName);
	}
	
	public String getName() {
		return username;
	}

	public void setName(String id) {
		this.username = id;
	}
	
	public boolean equals(Object other) {
		if (!(other instanceof Session)) {
			return false;
		}
		Session otherUser = (Session) other;
		return Objects.equals(id, otherUser.id);
	}
	
	public int hashCode() {
		return Objects.hash(id);
	}

	public String getSession() {
		return id;
	}

	public void setSession(String session) {
		this.id = session;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String getIconUrl() {
		return iconUrl;
	}

	public void setIconUrl(String iconUrl) {
		this.iconUrl = iconUrl;
	}
}
