package com.ankara.honiara;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

import com.ankara.honiara.websocket.WebSocketConnectHandler;
import com.ankara.honiara.websocket.WebSocketDisconnectHandler;

import org.springframework.session.ExpiringSession;
import org.springframework.session.web.socket.config.annotation.AbstractSessionWebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@EnableScheduling
public class BrokerConfig<S extends ExpiringSession>
		extends AbstractSessionWebSocketMessageBrokerConfigurer<S> {

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/topic", "/queue");
		registry.setApplicationDestinationPrefixes("/app", "/topic");
	}
	
	@Override
	protected void configureStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/honiara").withSockJS();
	}
	
	@Bean
	public WebSocketConnectHandler webSocketConnectHandler(SimpMessageSendingOperations messagingTemplate) {
		return new WebSocketConnectHandler(messagingTemplate);
	}

	@Bean
	public WebSocketDisconnectHandler webSocketDisconnectHandler(SimpMessageSendingOperations messagingTemplate) {
		return new WebSocketDisconnectHandler(messagingTemplate);
	}
}
