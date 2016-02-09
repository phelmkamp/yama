package com.ankara.honiara.persistence.repositories;

import java.util.List;
import java.util.Set;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.ankara.honiara.persistence.entities.Conversation;

public interface ConversationRepo 
		extends PagingAndSortingRepository<Conversation, String> {

	public List<Conversation> findByUsers(@SuppressWarnings("rawtypes") Set users);
}
