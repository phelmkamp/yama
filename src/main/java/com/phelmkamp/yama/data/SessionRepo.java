package com.phelmkamp.yama.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.phelmkamp.yama.api.representations.Session;

@Repository
public interface SessionRepo extends JpaRepository<Session, String> {

}
