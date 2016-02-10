package com.ankara.honiara.api.controllers;

import java.security.Principal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ankara.honiara.api.representations.Message;

@Controller
public class MessageController {
	
	@Autowired
	private SimpMessagingTemplate template;
	
	@MessageMapping("/honiara/convos/*")
	public void process(Message msg, Principal principal, @Header String destination) {
		msg.setSender(principal.getName());
		
		String convoId = destination.substring(destination.lastIndexOf('/') + 1);		
		template.convertAndSend("/topic/convos/" + convoId, msg);
	}
}
