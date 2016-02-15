package com.ankara.honiara.api.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ankara.honiara.api.representations.AllUsers;
import com.ankara.honiara.api.representations.User;

@Controller
public class UserController {

	@Autowired
	private SimpMessagingTemplate template;
	
	@MessageMapping("/honiara/newUsers")
	public void newUser(Principal principal) {
		template.convertAndSend("/topic/newUsers", new User(principal.getName()));
	}
	
	@MessageMapping("/honiara/users/*/allUsers")
	public void allUsers(AllUsers rep, @Header String destination) {
		String dest = destination.substring(12);
		template.convertAndSend("/topic" + dest, rep);
	}
}
