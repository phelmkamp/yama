package com.ankara.honiara.api.representations;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Message /*extends BaseRep*/ {

	private String sender;
	private String content;

	@JsonProperty
	public String getSender() {
		return sender;
	}

	@JsonIgnore
	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
}
