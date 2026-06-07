package com.example.innogeeks.app.feature.auth.presentation.login

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.innogeeks.app.R
import com.example.innogeeks.app.core.presentation.designsystem.AppTheme
import com.example.innogeeks.app.core.presentation.designsystem.ThemeMode

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onNavigateToHome: () -> Unit,
    viewModel: LoginViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }
    val bottomSheetState = rememberModalBottomSheetState()
    
    LaunchedEffect(Unit) {
        viewModel.uiEvent.collect { event ->
            when (event) {
                is LoginUiEvent.NavigateToHome -> onNavigateToHome()
                is LoginUiEvent.ShowSnackbar -> snackbarHostState.showSnackbar(event.message)
            }
        }
    }
    
    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = stringResource(R.string.login_welcome),
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = stringResource(R.string.login_agent),
                style = MaterialTheme.typography.headlineLarge,
                color = MaterialTheme.colorScheme.onSurface
            )
            
            // Show masked email hint if coming from RegID recovery
            state.maskedEmailHint?.let { hint ->
                if (!state.showRegIdRecovery) {
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = stringResource(R.string.login_found_account, hint),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.primary,
                        textAlign = TextAlign.Center
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(48.dp))
            
            if (state.isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(48.dp),
                    color = MaterialTheme.colorScheme.primary
                )
            } else {
                Button(
                    onClick = { 
                        viewModel.onEvent(LoginEvent.OnGoogleSignIn("coordinator@college.edu"))
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(stringResource(R.string.login_sign_in_coordinator))
                }
                
                Spacer(modifier = Modifier.height(12.dp))
                
                OutlinedButton(
                    onClick = { 
                        viewModel.onEvent(LoginEvent.OnGoogleSignIn("member@college.edu"))
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(stringResource(R.string.login_sign_in_member))
                }
                
                Spacer(modifier = Modifier.height(12.dp))
                
                OutlinedButton(
                    onClick = { 
                        viewModel.onEvent(LoginEvent.OnGoogleSignIn("unknown@email.com"))
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(stringResource(R.string.login_test_mismatch))
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                TextButton(
                    onClick = { viewModel.onEvent(LoginEvent.OnContinueAsGuest) }
                ) {
                    Text(stringResource(R.string.login_continue_guest))
                }
            }
            
            state.error?.let { error ->
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = error,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodyMedium,
                    textAlign = TextAlign.Center
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = stringResource(R.string.login_terms),
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
        }
        
        if (state.showRegIdRecovery) {
            ModalBottomSheet(
                onDismissRequest = { viewModel.onEvent(LoginEvent.OnRetryLogin) },
                sheetState = bottomSheetState
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = stringResource(R.string.recovery_title),
                        style = MaterialTheme.typography.headlineSmall
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Text(
                        text = stringResource(R.string.recovery_description),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center
                    )
                    
                    Spacer(modifier = Modifier.height(24.dp))
                    
                    OutlinedTextField(
                        value = state.regIdInput,
                        onValueChange = { viewModel.onEvent(LoginEvent.OnRegIdChanged(it)) },
                        label = { Text(stringResource(R.string.recovery_reg_id_label)) },
                        placeholder = { Text(stringResource(R.string.recovery_reg_id_placeholder)) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    
                    // Show found email hint
                    state.foundEmail?.let { hint ->
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = stringResource(R.string.recovery_found_hint, hint),
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(24.dp))
                    
                    // Show different buttons based on whether email was found
                    if (state.foundEmail != null) {
                        // Email found - show "Continue to Login"
                        Button(
                            onClick = { viewModel.onEvent(LoginEvent.OnLoginWithFoundEmail) },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(stringResource(R.string.recovery_continue_login))
                        }
                    } else {
                        // Not found yet - show "Verify" button
                        Button(
                            onClick = { viewModel.onEvent(LoginEvent.OnVerifyRegId) },
                            modifier = Modifier.fillMaxWidth(),
                            enabled = state.regIdInput.isNotBlank() && !state.isLoading
                        ) {
                            if (state.isLoading) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(20.dp),
                                    strokeWidth = 2.dp
                                )
                            } else {
                                Text(stringResource(R.string.recovery_verify))
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(12.dp))
                        
                        // Only show "Continue as Guest" when NOT found
                        TextButton(
                            onClick = { viewModel.onEvent(LoginEvent.OnContinueAsGuest) }
                        ) {
                            Text(stringResource(R.string.login_continue_guest))
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(32.dp))
                }
            }
        }
    }
}

@Preview(showBackground = true, name = "Light")
@Composable
private fun LoginScreenPreviewLight() {
    AppTheme(themeMode = ThemeMode.LIGHT) {
        LoginContentPreview(state = LoginState())
    }
}

@Preview(showBackground = true, name = "Dark", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Composable
private fun LoginScreenPreviewDark() {
    AppTheme(themeMode = ThemeMode.DARK) {
        LoginContentPreview(state = LoginState())
    }
}

@Preview(showBackground = true, name = "With Hint")
@Composable
private fun LoginScreenPreviewWithHint() {
    AppTheme(themeMode = ThemeMode.DARK) {
        LoginContentPreview(state = LoginState(maskedEmailHint = "c***@college.edu"))
    }
}

@Composable
private fun LoginContentPreview(state: LoginState) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Welcome back,",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = "Agent.",
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.onSurface
        )
        
        state.maskedEmailHint?.let { hint ->
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Account found: $hint",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.primary,
                textAlign = TextAlign.Center
            )
        }
        
        Spacer(modifier = Modifier.height(48.dp))
        
        Button(onClick = {}, modifier = Modifier.fillMaxWidth()) {
            Text("Sign in as Coordinator (Mock)")
        }
        Spacer(modifier = Modifier.height(12.dp))
        OutlinedButton(onClick = {}, modifier = Modifier.fillMaxWidth()) {
            Text("Sign in as Member (Mock)")
        }
        Spacer(modifier = Modifier.height(24.dp))
        TextButton(onClick = {}) {
            Text("Continue as Guest")
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Text(
            text = "By logging in, you agree to Club Protocols.",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}
