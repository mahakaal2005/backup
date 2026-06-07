package com.example.karmist.viewmodel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.karmist.data.entity.Karm
import com.example.karmist.data.model.FilterType
import com.example.karmist.data.model.KarmSource
import com.example.karmist.data.repository.KarmRepository
import com.example.karmist.ui.event.HomeUiEvent
import com.example.karmist.ui.state.EditKarmUiState
import com.example.karmist.ui.state.HomeUiState
import com.example.karmist.ui.state.HomeScreenState
import com.example.karmist.ui.state.KarmEditorState
import com.example.karmist.ui.state.RefreshUiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject
@HiltViewModel
class KarmViewModel @Inject constructor(
    private val karmRepository: KarmRepository
) : ViewModel() {
    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()
    private val _filterType = MutableStateFlow(FilterType.ALL)
    val filterType = _filterType.asStateFlow()
    private val _refreshUiState = MutableStateFlow<RefreshUiState>(RefreshUiState.Idle)
    val refreshUiState = _refreshUiState.asStateFlow()

    private var refreshJob: Job? = null
    private var hasAutoSynced = false
    private val _lastSyncedAt = MutableStateFlow<Long?>(null)
    private val _editKarmUiState = MutableStateFlow<EditKarmUiState>(EditKarmUiState.Idle)
    val editKarmUiState = _editKarmUiState.asStateFlow()
    private var editLoadJob: Job? = null
    private val _homeUiEvent = MutableSharedFlow<HomeUiEvent>(extraBufferCapacity = 1)
    val homeUiEvent = _homeUiEvent.asSharedFlow()
    init {
        autoRefreshOnAppOpen()
    }
    fun onKarmSwipedToDelete(karm: Karm) {
        viewModelScope.launch {
            deleteKarm(karm)
            _homeUiEvent.emit(HomeUiEvent.ShowUndoDelete(karm))
        }
    }
    fun undoDelete(karm: Karm) {
        viewModelScope.launch {
            addKarm(karm)
        }
    }
    private fun autoRefreshOnAppOpen() {
        if (hasAutoSynced) return
        hasAutoSynced = true
        performRefresh()
    }
    fun loadKarmForEdit(id: Long) {
        editLoadJob?.cancel()
        if (id == 0L) {
            _editKarmUiState.value = EditKarmUiState.Success(KarmEditorState())
            return
        }
        _editKarmUiState.value = EditKarmUiState.Loading
        editLoadJob = viewModelScope.launch {
            try {
                val karm = karmRepository.getKarmById(id).first()
                if (karm == null) {
                    _editKarmUiState.value = EditKarmUiState.Error("Note not found")
                    return@launch
                }
                if (karm.source == KarmSource.REMOTE) {
                    _editKarmUiState.value = EditKarmUiState.Error("Remote tasks are read-only")
                    return@launch
                }
                _editKarmUiState.value = EditKarmUiState.Success(
                    KarmEditorState(
                        id = karm.id,
                        description = karm.description,
                        completed = karm.completed,
                        date = karm.date,
                        source = karm.source
                    )
                )
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                _editKarmUiState.value = EditKarmUiState.Error(e.message ?: "Failed to load task")
            }
        }
    }
    fun onSearchQueryChanged(newQuery: String) {
        _searchQuery.value = newQuery
    }
    fun onFilterChanged(newFilter: FilterType) {
        _filterType.value = newFilter
    }
    private fun updateEditorState(transform: (KarmEditorState) -> KarmEditorState) {
        val current = _editKarmUiState.value
        if (current is EditKarmUiState.Success) {
            _editKarmUiState.value = current.copy(editor = transform(current.editor))
        }
    }

    @OptIn(FlowPreview::class)
    private val filteredKarms = combine(
        _searchQuery.debounce(300),
        _filterType
    ) { query, filter ->
        query to filter
    }.flatMapLatest { (query, filter) ->
        karmRepository.getFilteredKarms(
            query = query,
            filterType = filter
        )
    }

    @OptIn(FlowPreview::class)
    val homeUiState: StateFlow<HomeUiState> = combine(
        karmRepository.getAllKarms(),
        filteredKarms,
        _lastSyncedAt
    ) { allKarms, filtered, lastSyncedAt ->
        when {
            allKarms.isEmpty() -> HomeUiState.Empty
            filtered.isEmpty() -> HomeUiState.EmptyFiltered
            else -> HomeUiState.Success(filtered, syncedAt = lastSyncedAt)
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = HomeUiState.Loading
    )

    val homeScreenState: StateFlow<HomeScreenState> = combine(
        homeUiState,
        refreshUiState
    ) { listState, refreshState ->
        HomeScreenState(
            listState = listState,
            refreshState = refreshState
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = HomeScreenState()
    )

    private fun performRefresh() {
        refreshJob?.cancel()
        refreshJob = viewModelScope.launch {
            _refreshUiState.value = RefreshUiState.Loading
            try {
                karmRepository.refreshFromApi()
                val syncedAt = System.currentTimeMillis()
                _lastSyncedAt.value = syncedAt
                _refreshUiState.value = RefreshUiState.Success(syncedAtMillis = syncedAt)
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                _refreshUiState.value = RefreshUiState.Error(e.message ?: "Failed to refresh tasks")
            }
        }
    }
    fun manualRefresh() {
        performRefresh()
    }
    fun retryRefresh() {
        manualRefresh()
    }
    fun onKarmDescriptionChanged(newValue: String) {
        updateEditorState { it.copy(description = newValue) }
    }
    fun onKarmCompletedChanged(newValue: Boolean) {
        updateEditorState { it.copy(completed = newValue) }
    }
    fun addKarm(karm: Karm) {
        viewModelScope.launch {
            karmRepository.insertKarm(karm)
        }
    }
    fun deleteKarm(karm: Karm) {
        viewModelScope.launch {
            karmRepository.deleteKarm(karm)
        }
    }
    fun updateKarm(karm: Karm) {
        viewModelScope.launch {
            karmRepository.updateKarm(karm)
        }
    }
    suspend fun saveKarm(editor: KarmEditorState): Result<Unit> = runCatching {
        if (editor.id != 0L && editor.source == KarmSource.REMOTE) {
            error("Remote tasks are read-only")
        }
        val karm = if (editor.id == 0L) {
            Karm(
                description = editor.description,
                completed = editor.completed,
                date = System.currentTimeMillis(),
                source = editor.source
            )
        } else {
            Karm(
                id = editor.id,
                description = editor.description,
                completed = editor.completed,
                date = editor.date,
                source = editor.source
            )
        }
        if (editor.id == 0L) {
            karmRepository.insertKarm(karm)
        } else {
            karmRepository.updateKarm(karm)
        }
    }
}
