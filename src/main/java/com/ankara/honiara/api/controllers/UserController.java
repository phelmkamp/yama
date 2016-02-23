package com.ankara.honiara.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import com.ankara.honiara.api.representations.Sessions;
import com.ankara.honiara.data.SessionRepo;

@Controller
public class UserController {
	
	@Autowired
	private SessionRepo sessionRepo;
	
	@SubscribeMapping("/users")
	public Sessions onUsersSubscribe() {
		Sessions rep = new Sessions();
		rep.setAllUsers(sessionRepo.findAll());
		return rep;
	}
}
