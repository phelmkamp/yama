package com.ankara.honiara.api.representations;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Message {

	private String sender;
	private String content;
	private String convoId;

	@JsonProperty
	public String getSender() {
		return sender;
	}

	@JsonIgnore
	public void setSender(String sender) {
		this.sender = sender;
	}

	@JsonProperty
	public String getContent() {
		return content;
	}

	@JsonIgnore
	public void setContent(String content) {
		this.content = content;
	}

	@JsonProperty
	public String getConvoId() {
		return convoId;
	}

	@JsonIgnore
	public void setConvoId(String convoId) {
		this.convoId = convoId;
	}
}
