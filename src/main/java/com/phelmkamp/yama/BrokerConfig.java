package com.phelmkamp.yama;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

import com.phelmkamp.yama.websocket.WebSocketConnectHandler;
import com.phelmkamp.yama.websocket.WebSocketDisconnectHandler;

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
		registry.addEndpoint("/yama").withSockJS();
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
