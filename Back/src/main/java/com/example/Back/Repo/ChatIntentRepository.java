package com.example.Back.Repo;

import com.example.Back.Models.ChatIntent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatIntentRepository extends JpaRepository<ChatIntent, Integer> {
}