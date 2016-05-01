package com.ankara.honiara.api.representations;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.validator.constraints.SafeHtml;
import org.hibernate.validator.constraints.SafeHtml.WhiteListType;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Convo {

	@SafeHtml(whitelistType = WhiteListType.NONE)
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
		if (content != null) {
			for (Entry<String, String> entry : content.entrySet()) {
				if (!Jsoup.isValid(entry.getKey(), Whitelist.none())) {
					throw new IllegalArgumentException();
				}
				entry.setValue(StringUtils.right(Jsoup.clean(entry.getValue(), Whitelist.relaxed()), 140));
			}
		}
		this.content = content;
	}
}
