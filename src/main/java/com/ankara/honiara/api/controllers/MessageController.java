package com.ankara.honiara.api.controllers;

import java.security.Principal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ankara.honiara.api.representations.Convo;
import com.ankara.honiara.api.representations.Message;

@Controller
public class MessageController {
	
	@Autowired
	private SimpMessagingTemplate template;
	
	@MessageMapping("/convos/{convoId}")
	public void process(Convo convo, Principal principal, @DestinationVariable String convoId) {		
		Message msg = new Message();
		msg.setContent(convo.getContent().get(principal.getName()));
		msg.setConvoId(convoId);
		msg.setSender(principal.getName());
		
		convo.getUsers()
			 .stream()
			 .filter(user -> !user.getName().equals(principal.getName()))
			 .forEach(user -> template.convertAndSendToUser(user.getName(), "/queue/messages", msg));
	}
}
