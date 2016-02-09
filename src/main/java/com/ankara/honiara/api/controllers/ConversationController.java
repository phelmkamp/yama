package com.ankara.honiara.api.controllers;

import java.security.Principal;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ankara.honiara.persistence.entities.Conversation;
import com.ankara.honiara.persistence.repositories.ConversationRepo;

@RestController
//@RequestMapping("/conversations")
public class ConversationController {

	@Autowired
	private ConversationRepo convoRepo;
	
	@RequestMapping(method=RequestMethod.GET)
	public List<Conversation> getConvos(Principal principal) {
		return convoRepo.findByUsers(Collections.singleton(principal.getName()));
	}
}
