package com.example.unitconverter

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.unitconverter.ui.theme.UnitConverterTheme
import kotlin.math.roundToInt

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            UnitConverterTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    UnitConverter(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun UnitConverter(modifier: Modifier = Modifier) {

    var inputValue by remember { mutableStateOf("") }
    var outputValue by remember { mutableStateOf("0.0") }
    var inputUnit by remember { mutableStateOf("Metres") }
    var outputUnit by remember { mutableStateOf("Metres") }
    var iExpanded by remember { mutableStateOf(false) }
    var oExpanded by remember { mutableStateOf(false) }
    var conversionFactor by remember { mutableStateOf(1.00) }
    var oconversionFactor by remember { mutableStateOf(1.00) }

    fun convertUnit(){
        //?: ->elvis operator
        val inputValueDouble = inputValue.toDoubleOrNull()?:0.0
        val result = (inputValueDouble * conversionFactor * 100.0 /oconversionFactor ).roundToInt() / 100.0
        outputValue = result.toString()
    }

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Unit Converter",
            style = MaterialTheme.typography.headlineLarge
        )
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(
            value = inputValue,
            onValueChange = {
                inputValue = it
                convertUnit() },
            label = { Text("Enter Value")}
        )
        Spacer(modifier = Modifier.height(16.dp))
        Row() {
            //Input Box
            Box(){
                //Input Button
                Button(onClick = {iExpanded = true}) {
                    Text(inputUnit)
                    Icon(
                        imageVector = Icons.Default.ArrowDropDown,
                        contentDescription = "Select Options"
                    )
                }
                DropdownMenu(expanded = iExpanded, onDismissRequest = { iExpanded = false}) {
                    DropdownMenuItem(
                        text = {Text("Metres")},
                        onClick = {
                            inputUnit="Metres"
                            iExpanded = false
                            conversionFactor = 1.0
                            convertUnit()
                        }
                    )
                    DropdownMenuItem(
                        text = {Text("Centimetres")},
                        onClick = {
                            inputUnit="Centimetres"
                            iExpanded = false
                            conversionFactor = 0.01
                            convertUnit()
                        }
                    )
                    DropdownMenuItem(
                        text = {Text("Feet")},
                        onClick = {
                            inputUnit="Feet"
                            iExpanded = false
                            conversionFactor = 0.3048
                            convertUnit()
                        }
                    )
                    DropdownMenuItem(
                        text = {Text("Millimeters")},
                        onClick = {
                            inputUnit="Millimeters"
                            iExpanded = false
                            conversionFactor = 0.001
                            convertUnit()
                        }
                    )
                }
            }
            Spacer(modifier= Modifier.width(16.dp))
            //Output Box
            Box(){
                //Output Button
                Button(onClick = {
                    oExpanded = true
                }) {
                    Text(outputUnit)
                    Icon(
                        imageVector = Icons.Default.ArrowDropDown,
                        contentDescription = "Select Options"
                    )
                }
                DropdownMenu(expanded = oExpanded, onDismissRequest = { oExpanded = false}) {
                    DropdownMenuItem(
                        text = {Text("Metres")},
                        onClick = {
                            outputUnit="Metres"
                            oExpanded = false
                            oconversionFactor = 1.0
                            convertUnit()
                        }
                    )
                    DropdownMenuItem(
                        text = {Text("Centimetres")},
                        onClick = {
                            outputUnit="Centimetres"
                            oExpanded = false
                            oconversionFactor = 0.01
                            convertUnit()
                        }
                    )
                    DropdownMenuItem(
                        text = {Text("Feet")},
                        onClick = {
                            outputUnit="Feet"
                            oExpanded = false
                            oconversionFactor = 0.3048
                            convertUnit()
                        }
                    )
                    DropdownMenuItem(
                        text = {Text("Millimeters")},
                        onClick = {
                            outputUnit= "Millimeters"
                            oExpanded = false
                            oconversionFactor = 0.001
                            convertUnit()
                        }
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Result : ${outputValue} ${outputUnit}",
            style = MaterialTheme.typography.headlineMedium
        )
    }
}


@Preview(
    showBackground = true,
    showSystemUi = true
)
@Composable
private fun UnitConverterPreview() {
    UnitConverterTheme() {
        Surface (modifier = Modifier.fillMaxSize()) {
            UnitConverter(modifier = Modifier.fillMaxSize())
        }
    }

}