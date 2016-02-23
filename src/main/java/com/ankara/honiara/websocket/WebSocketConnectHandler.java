package com.ankara.honiara.websocket;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.socket.messaging.SessionConnectEvent;

import com.ankara.honiara.api.representations.Session;
import com.ankara.honiara.api.representations.Sessions;
import com.ankara.honiara.data.SessionRepo;

public class WebSocketConnectHandler implements ApplicationListener<SessionConnectEvent> {
	
	@Autowired
	private SessionRepo sessionRepo;
	
	private SimpMessageSendingOperations messagingTemplate;

	public WebSocketConnectHandler(SimpMessageSendingOperations messagingTemplate) {
		super();
		this.messagingTemplate = messagingTemplate;
	}

	public void onApplicationEvent(SessionConnectEvent event) {
		MessageHeaders headers = event.getMessage().getHeaders();
		Principal user = SimpMessageHeaderAccessor.getUser(headers);
		if (user == null) {
			return;
		}
		
		String id = SimpMessageHeaderAccessor.getSessionId(headers);
		OAuth2Authentication auth = (OAuth2Authentication) user;
		
		@SuppressWarnings("unchecked")
		Map<String, ?> details = (Map<String, ?>) auth.getUserAuthentication().getDetails();
//		System.out.println("user details: " + details);
		
		Session sesh = new Session(id, user.getName(), (String) details.get("displayName"));
		
		@SuppressWarnings("unchecked")
		Map<String, ?> image = (Map<String, ?>) details.get("image");
		sesh.setIconUrl((String) image.get("url"));
		
		sessionRepo.saveAndFlush(sesh);
		
		Sessions rep = new Sessions();
		rep.setAllUsers(sessionRepo.findAll());
		messagingTemplate.convertAndSend("/topic/users", rep);
	}
}
