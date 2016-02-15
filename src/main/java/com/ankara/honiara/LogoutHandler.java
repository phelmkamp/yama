package com.ankara.honiara;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;

import com.ankara.honiara.api.representations.User;

public class LogoutHandler extends SimpleUrlLogoutSuccessHandler {

	@Autowired
	private SimpMessagingTemplate template;
	
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		
		template.convertAndSend("/topic/exitingUsers", new User(authentication.getName()));
		
		super.onLogoutSuccess(request, response, authentication);
	}
}
