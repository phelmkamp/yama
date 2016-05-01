package com.phelmkamp.yama.api.representations;

import org.hibernate.validator.constraints.SafeHtml;
import org.hibernate.validator.constraints.SafeHtml.WhiteListType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Message {

	@SafeHtml(whitelistType = WhiteListType.NONE)
	private String sender;
	@SafeHtml(whitelistType = WhiteListType.RELAXED)
	private String content;
	@SafeHtml(whitelistType = WhiteListType.NONE)
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
