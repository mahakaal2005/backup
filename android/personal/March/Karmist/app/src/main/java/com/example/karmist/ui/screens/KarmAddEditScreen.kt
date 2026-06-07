package com.example.karmist.ui.screens
import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.example.karmist.R
import com.example.karmist.data.model.KarmSource
import com.example.karmist.ui.components.TopAppBar
import com.example.karmist.ui.state.EditKarmUiState
import com.example.karmist.ui.state.KarmEditorState
import com.example.karmist.viewmodel.KarmViewModel
import kotlinx.coroutines.launch
@Composable
fun KarmAddEditScreen(
    id: Long = 0L,
    viewModel: KarmViewModel,
    navController: NavController,
    @SuppressLint("ModifierParameter") modifier: Modifier = Modifier
) {
    val editState by viewModel.editKarmUiState.collectAsStateWithLifecycle()
    val editor = when (val state = editState) {
        is EditKarmUiState.Success -> state.editor
        else -> if (id == 0L) KarmEditorState() else null
    }
    LaunchedEffect(id) {
        viewModel.loadKarmForEdit(id)
    }
    Scaffold(
        topBar = {
            val canEditCompletion = id == 0L || editor?.source == KarmSource.LOCAL
            TopAppBar(
                title = stringResource(if (id == 0L) R.string.add_karm else R.string.edit_karm),
                showBackButton = true,
                showCompletionCheckBox = canEditCompletion,
                checked = editor?.completed ?: false,
                onCheckboxClicked = { viewModel.onKarmCompletedChanged(!(editor?.completed ?: false)) },
                onBackButtonClicked = {
                    navController.popBackStack()
                }
            )
        },
        modifier = modifier
    ) { paddingValues ->
        when (val state = editState) {
            EditKarmUiState.Loading -> {
                if (id == 0L) {
                    AddEditForm(
                        viewModel = viewModel,
                        navController = navController,
                        paddingValues = paddingValues,
                        editor = KarmEditorState()
                    )
                } else {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(paddingValues),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        CircularProgressIndicator()
                    }
                }
            }
            is EditKarmUiState.Error -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = state.message,
                        color = MaterialTheme.colorScheme.error
                    )
                }
            }
            is EditKarmUiState.Success -> {
                AddEditForm(
                    viewModel = viewModel,
                    navController = navController,
                    paddingValues = paddingValues,
                    editor = state.editor
                )
            }
            EditKarmUiState.Idle -> {
                AddEditForm(
                    viewModel = viewModel,
                    navController = navController,
                    paddingValues = paddingValues,
                    editor = editor ?: KarmEditorState()
                )
            }
        }
    }
}
@Composable
private fun AddEditForm(
    viewModel: KarmViewModel,
    navController: NavController,
    paddingValues: androidx.compose.foundation.layout.PaddingValues,
    editor: KarmEditorState
) {
    val scope = rememberCoroutineScope()
    val saveError = remember { mutableStateOf<String?>(null) }
    saveError.value?.let {
        Text(text = it, color = MaterialTheme.colorScheme.error)
    }
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .fillMaxSize()
            .padding(paddingValues)
            .padding(16.dp)
    ) {
        OutlinedTextField(
            value = editor.description,
            onValueChange = { viewModel.onKarmDescriptionChanged(it) },
            label = { Text(text = stringResource(R.string.karm_label)) },
            placeholder = { Text(text = stringResource(R.string.karm_description_hint)) },
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            textStyle = MaterialTheme.typography.bodyLarge
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = {
                scope.launch {
                    viewModel.saveKarm(editor)
                        .onSuccess { navController.popBackStack() }
                        .onFailure { saveError.value = it.message ?: "Failed to save task" }
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .padding(4.dp)
        ) {
            Text(
                text = stringResource(if (editor.id == 0L) R.string.add_karm else R.string.edit_karm),
                style = MaterialTheme.typography.titleMedium
            )
        }
    }
}
