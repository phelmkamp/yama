package com.ankara.honiara;

import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

public class StompDisconnectEvent implements ApplicationListener<SessionDisconnectEvent> {
	 
    public void onApplicationEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        System.out.println(sha);
    }
}
