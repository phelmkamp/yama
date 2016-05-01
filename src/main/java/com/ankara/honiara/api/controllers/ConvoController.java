package com.ankara.honiara.api.controllers;

import java.security.Principal;
import java.util.UUID;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ankara.honiara.api.representations.Convo;

@Controller
public class ConvoController {
	
	@Autowired
	private SimpMessagingTemplate template;

	@MessageMapping("/newConvo")
	public void newConvo(@Valid Convo convo, Principal principal) {		
		convo.setId(UUID.randomUUID().toString());
		convo.getUsers()
			 .forEach(user -> template.convertAndSendToUser(user.getName(), "/queue/convos", convo));
	}
}
