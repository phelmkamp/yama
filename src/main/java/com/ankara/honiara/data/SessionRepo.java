package com.ankara.honiara.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ankara.honiara.api.representations.Session;

@Repository
public interface SessionRepo extends JpaRepository<Session, String> {

}
