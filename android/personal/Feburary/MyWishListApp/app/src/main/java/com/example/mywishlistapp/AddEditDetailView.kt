package com.example.mywishlistapp

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.material.Scaffold
import androidx.compose.material.rememberScaffoldState
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.mywishlistapp.data.Wish
import com.example.mywishlistapp.viewmodel.WishViewModel
import kotlinx.coroutines.launch

@Composable
fun AddEditDetailView(
    id : Long,
    viewModel : WishViewModel,
    navController: NavController,
    modifier: Modifier = Modifier
) {

    val snackbarMessage = remember{
        mutableStateOf("")
    }

    val scope = rememberCoroutineScope()

    val scaffoldState = rememberScaffoldState()

    if(id != 0L){
        val wish = viewModel.getAWishById(id).collectAsState(Wish())
        viewModel.onWishTitleChanged(wish.value.title)
        viewModel.onWishDescriptionChanged(wish.value.description)
    }else{
        viewModel.onWishTitleChanged("")
        viewModel.onWishDescriptionChanged("")
    }

    Scaffold(
        topBar = {
            AppBarView(
                title = if(id != 0L) stringResource(id=R.string.update_wish) else stringResource(R.string.add_wish),
                onBackNavClicked = {navController.navigateUp()}
            )
        },
        scaffoldState = scaffoldState
    ) {
        Column(
            modifier = Modifier
                .padding(it)
                .wrapContentSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Spacer(Modifier.height(10.dp))
            WishTextField(
                "Title" ,
                value = viewModel.wishTitleState,
                onValueChanged = {
                    viewModel.onWishTitleChanged(it)
                }
            )
            Spacer(Modifier.height(10.dp))
            WishTextField(
                "Description" ,
                value = viewModel.wishDescriptionState,
                onValueChanged = {
                    viewModel.onWishDescriptionChanged(it)
                }
            )
            Spacer(Modifier.padding(10.dp))
            Button(
                onClick = {
                    if(viewModel.wishTitleState.isNotEmpty()
                        && viewModel.wishDescriptionState.isNotEmpty()){
                        if(id!= 0L){
                            //TODO Update a wish
                            viewModel.updateWish(
                                Wish(
                                    id =id,
                                    title = viewModel.wishTitleState,
                                    description = viewModel.wishDescriptionState
                                )
                            )
                            snackbarMessage.value = "Wish has been updated"
                        }else{
                            //Add a wish
                            viewModel.addWish(
                                Wish(
                                    title = viewModel.wishTitleState.trim(),
                                    description = viewModel.wishDescriptionState.trim()
                                )
                            )
                            snackbarMessage.value = "Wish has been created"
                        }

                    }else{

                    }
                    scope.launch {
                        scaffoldState.snackbarHostState.showSnackbar(snackbarMessage.value)
                        navController.navigateUp()
                    }
                }
            ) {
                Text(
                    text = if(id!= 0L){
                        stringResource(R.string.update_wish)
                    }else{
                        stringResource(R.string.add_wish)
                    },
                    style = TextStyle(
                        fontSize = 18.sp
                    )
                )
            }
        }
    }
}