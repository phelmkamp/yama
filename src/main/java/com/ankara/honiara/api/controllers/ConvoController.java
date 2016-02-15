package com.ankara.honiara.api.controllers;

import java.security.Principal;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ankara.honiara.api.representations.Convo;

@Controller
public class ConvoController {
	
	@Autowired
	private SimpMessagingTemplate template;

	@MessageMapping("/honiara/newConvos")
	public void newConvo(Convo convo, Principal principal) {		
		convo.setId(UUID.randomUUID().toString());
		convo.getUsers().forEach(user -> {
			String dest = "/topic/users/" + user.getId() + "/newConvos";
			template.convertAndSend(dest, convo);
		});
	}
	
//	@MessageMapping("/honiara/convos/*")
//	public void process(Convo convo, Principal principal, @Header String destination) {
//		String convoId = destination.substring(destination.lastIndexOf('/') + 1);		
//		template.convertAndSend("/topic/convos/" + convoId, convo);
//	}
}
