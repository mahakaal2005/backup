package com.example.innogeeks.app.feature.resources.presentation

sealed interface ResourcesEvent {
    data class OnSearchQueryChanged(val query: String) : ResourcesEvent
    data class OnDomainFilterSelected(val domain: String?) : ResourcesEvent
    data class OnResourceClicked(val url: String) : ResourcesEvent
}
