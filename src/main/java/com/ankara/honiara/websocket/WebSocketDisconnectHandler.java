package com.ankara.honiara.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.ankara.honiara.api.representations.Sessions;
import com.ankara.honiara.data.SessionRepo;

public class WebSocketDisconnectHandler
		implements ApplicationListener<SessionDisconnectEvent> {
	
	@Autowired
	private SessionRepo sessionRepo;
	
	private SimpMessageSendingOperations messagingTemplate;
	
	public WebSocketDisconnectHandler(SimpMessageSendingOperations messagingTemplate) {
		super();
		this.messagingTemplate = messagingTemplate;
	}
	
	public void onApplicationEvent(SessionDisconnectEvent event) {
		String id = event.getSessionId();
		if (id == null) {
			return;
		}
		
		sessionRepo.delete(id);
		sessionRepo.flush();
		
		Sessions rep = new Sessions();
		rep.setAllUsers(sessionRepo.findAll());
		messagingTemplate.convertAndSend("/topic/users", rep);
	}
}
