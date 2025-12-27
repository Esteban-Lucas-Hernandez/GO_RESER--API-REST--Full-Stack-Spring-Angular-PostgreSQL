package com.example.Back.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "chat_intents")
public class ChatIntent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "keywords", nullable = false, columnDefinition = "TEXT")
    private String keywords;

    @Column(name = "action_type", nullable = false, columnDefinition = "TEXT")
    private String actionType;

    @Column(name = "response", columnDefinition = "TEXT")
    private String response;

    // Default constructor
    public ChatIntent() {
    }

    // Constructor with parameters
    public ChatIntent(Integer id, String keywords, String actionType, String response) {
        this.id = id;
        this.keywords = keywords;
        this.actionType = actionType;
        this.response = response;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}