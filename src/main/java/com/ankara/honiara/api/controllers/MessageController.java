package com.ankara.honiara.api.controllers;

import java.security.Principal;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ankara.honiara.api.representations.Message;
import com.ankara.honiara.persistence.entities.Conversation;
import com.ankara.honiara.persistence.repositories.ConversationRepo;

@Controller
public class MessageController {

	@Autowired
	private ConversationRepo convoRepo;
	
	@Autowired
	private SimpMessagingTemplate template;
	
	@MessageMapping("/honiara/convos/*")
	public void process(Message msg, Principal principal, @Header String destination) {
		msg.setSender(principal.getName());
		
		String convoId = destination.substring(destination.lastIndexOf('/'));
		if (convoId.equals("/")) {
			Conversation convo = new Conversation();
			convo.setUsers(Collections.singleton(msg.getSender()));
			convo = convoRepo.save(convo);
			convoId = convo.getId();
		} else {
			convoId = convoId.substring(1);
		}
		
		template.convertAndSend("/topic/convos/" + convoId, msg);
	}
}
