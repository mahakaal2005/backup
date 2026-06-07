package com.example.innogeeks.app.feature.events.presentation

sealed interface EventsEvent {
    data class OnDomainFilterSelected(val domain: String?) : EventsEvent
    data class OnEventClicked(val eventId: String) : EventsEvent
}
