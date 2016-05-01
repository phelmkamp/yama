package com.phelmkamp.yama.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import com.phelmkamp.yama.api.representations.Sessions;
import com.phelmkamp.yama.data.SessionRepo;

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
