package com.example.innogeeks.app.feature.attendance.presentation

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.innogeeks.app.feature.attendance.domain.model.AttendanceRecord
import com.example.innogeeks.app.feature.attendance.domain.repository.AttendanceRepository
import com.example.innogeeks.app.feature.auth.domain.repository.AuthRepository
import com.example.innogeeks.app.feature.events.domain.model.Event
import com.example.innogeeks.app.feature.events.domain.repository.EventRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject

@HiltViewModel
class TakeAttendanceViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val eventRepository: EventRepository,
    private val attendanceRepository: AttendanceRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {
    
    private val _state = MutableStateFlow(TakeAttendanceState())
    val state = _state.asStateFlow()
    
    private val _uiEvent = Channel<TakeAttendanceUiEvent>()
    val uiEvent = _uiEvent.receiveAsFlow()
    
    init {
        loadData()
    }
    
    private fun loadData() {
        viewModelScope.launch {
            val user = authRepository.currentUser.first()
            val domain = user?.domain ?: "Android"
            
            // Load events for domain
            launch {
                eventRepository.getEventsForDomain(domain).collect { events ->
                    _state.update { it.copy(availableEvents = events) }
                }
            }
            
            // Auto-fetch today's event
            launch {
                val todaysEvent = eventRepository.getTodaysEventForDomain(domain).first()
                _state.update { it.copy(selectedEvent = todaysEvent) }
            }
            
            // Load students (sorted by Most Present)
            launch {
                attendanceRepository.getStudentsForDomain(domain).collect { students ->
                    val items = students.map { StudentAttendanceItem(it, false) }
                    _state.update { it.copy(students = items, isLoading = false) }
                }
            }
        }
    }
    
    fun onEvent(event: TakeAttendanceEvent) {
        when (event) {
            is TakeAttendanceEvent.OnEventSelected -> selectEvent(event.event)
            is TakeAttendanceEvent.OnToggleStudent -> toggleStudent(event.studentId)
            is TakeAttendanceEvent.OnSaveAttendance -> saveAttendance()
            is TakeAttendanceEvent.OnDismissError -> _state.update { it.copy(error = null) }
        }
    }
    
    private fun selectEvent(event: Event) {
        _state.update { it.copy(selectedEvent = event) }
    }
    
    private fun toggleStudent(studentId: String) {
        _state.update { state ->
            val updatedStudents = state.students.map { item ->
                if (item.student.id == studentId) {
                    item.copy(isPresent = !item.isPresent)
                } else item
            }
            state.copy(students = updatedStudents)
        }
    }
    
    private fun saveAttendance() {
        val selectedEvent = _state.value.selectedEvent
        if (selectedEvent == null) {
            _state.update { it.copy(error = "Please select an event") }
            return
        }
        
        viewModelScope.launch {
            _state.update { it.copy(isSaving = true) }
            
            val presentIds = _state.value.students
                .filter { it.isPresent }
                .map { it.student.id }
            
            val record = AttendanceRecord(
                id = UUID.randomUUID().toString(),
                eventId = selectedEvent.id,
                eventTitle = selectedEvent.title,
                domain = selectedEvent.domain,
                date = System.currentTimeMillis(),
                presentStudentIds = presentIds,
                totalStudents = _state.value.students.size
            )
            
            attendanceRepository.saveAttendanceRecord(record)
                .onSuccess {
                    eventRepository.markEventCompleted(selectedEvent.id)
                    _uiEvent.send(TakeAttendanceUiEvent.ShowSnackbar(
                        "Attendance saved: ${presentIds.size}/${_state.value.students.size} present"
                    ))
                    _uiEvent.send(TakeAttendanceUiEvent.NavigateBack)
                }
                .onFailure { e ->
                    _state.update { it.copy(isSaving = false, error = e.message) }
                }
        }
    }
}
