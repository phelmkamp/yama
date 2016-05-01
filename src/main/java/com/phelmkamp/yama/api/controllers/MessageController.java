package com.phelmkamp.yama.api.controllers;

import java.security.Principal;

import javax.validation.Valid;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.phelmkamp.yama.api.representations.Convo;
import com.phelmkamp.yama.api.representations.Message;

@Controller
public class MessageController {

	@Autowired
	private SimpMessagingTemplate template;

	@MessageMapping("/convos/{convoId}")
	public void process(@Valid Convo convo, Principal principal, @DestinationVariable String convoId) {
		Message msg = new Message();
		msg.setContent(convo.getContent().get(principal.getName()));
		msg.setConvoId(convoId);
		msg.setSender(principal.getName());

		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		if (!validator.validate(msg).isEmpty()) {
			throw new IllegalArgumentException();
		}

		convo.getUsers().stream().filter(user -> !user.getName().equals(principal.getName()))
				.forEach(user -> template.convertAndSendToUser(user.getName(), "/queue/messages", msg));
	}
}
