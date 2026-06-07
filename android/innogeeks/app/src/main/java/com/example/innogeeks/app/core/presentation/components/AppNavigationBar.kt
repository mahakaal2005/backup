package com.example.innogeeks.app.core.presentation.components

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.MenuBook
import androidx.compose.material.icons.automirrored.outlined.MenuBook
import androidx.compose.material.icons.filled.Analytics
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.Analytics
import androidx.compose.material.icons.outlined.DateRange
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.People
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.example.innogeeks.app.R
import com.example.innogeeks.app.feature.auth.domain.model.UserRole

/**
 * Navigation item data class
 */
data class NavItem(
    val route: String,
    val labelResId: Int,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
)

/**
 * Role-specific navigation items
 */
object NavigationItems {
    
    val memberItems = listOf(
        NavItem("home", R.string.nav_home, Icons.Filled.Home, Icons.Outlined.Home),
        NavItem("resources", R.string.nav_resources, Icons.AutoMirrored.Filled.MenuBook, Icons.AutoMirrored.Outlined.MenuBook),
        NavItem("events", R.string.nav_events, Icons.Filled.DateRange, Icons.Outlined.DateRange),
        NavItem("profile", R.string.nav_profile, Icons.Filled.Person, Icons.Outlined.Person)
    )
    
    val coordinatorItems = memberItems
    
    val coreTeamItems = listOf(
        NavItem("home", R.string.nav_home, Icons.Filled.Home, Icons.Outlined.Home),
        NavItem("analytics", R.string.nav_analytics, Icons.Filled.Analytics, Icons.Outlined.Analytics),
        NavItem("members", R.string.nav_members, Icons.Filled.People, Icons.Outlined.People),
        NavItem("profile", R.string.nav_profile, Icons.Filled.Person, Icons.Outlined.Person)
    )
    
    val guestItems = listOf(
        NavItem("home", R.string.nav_home, Icons.Filled.Home, Icons.Outlined.Home),
        NavItem("profile", R.string.nav_profile, Icons.Filled.Person, Icons.Outlined.Person)
    )
    
    fun getItemsForRole(role: UserRole?): List<NavItem> = when (role) {
        UserRole.CORE_TEAM -> coreTeamItems
        UserRole.COORDINATOR -> coordinatorItems
        UserRole.MEMBER, UserRole.ALUMNI -> memberItems
        UserRole.GUEST, null -> guestItems
    }
}

/**
 * Floating transparent bottom navigation with animated sliding indicator.
 * Premium cyber-glass style per PRD.
 */
@Composable
fun AppBottomBar(
    userRole: UserRole?,
    selectedRoute: String,
    onItemSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val items = NavigationItems.getItemsForRole(userRole)
    val selectedIndex = items.indexOfFirst { it.route == selectedRoute }.coerceAtLeast(0)
    
    // Calculate dimensions
    val itemWidth = 64.dp
    val indicatorWidth = 56.dp
    val totalWidth = itemWidth * items.size
    
    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 16.dp),
        contentAlignment = Alignment.Center
    ) {
        // Main nav container - transparent with blur effect
        Box(
            modifier = Modifier
                .width(totalWidth + 16.dp)
                .height(64.dp)
                .clip(RoundedCornerShape(32.dp))
                .background(
                    color = MaterialTheme.colorScheme.surfaceContainerHigh.copy(alpha = 0.85f)
                )
        ) {
            // Animated sliding indicator
            val indicatorOffset by animateDpAsState(
                targetValue = (itemWidth * selectedIndex) + ((itemWidth - indicatorWidth) / 2) + 8.dp,
                animationSpec = spring(
                    dampingRatio = Spring.DampingRatioMediumBouncy,
                    stiffness = Spring.StiffnessLow
                ),
                label = "indicator"
            )
            
            Box(
                modifier = Modifier
                    .offset(x = indicatorOffset)
                    .padding(vertical = 8.dp)
                    .size(indicatorWidth, 48.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(MaterialTheme.colorScheme.primaryContainer)
            )
            
            // Navigation items
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                items.forEachIndexed { index, item ->
                    val isSelected = index == selectedIndex
                    
                    NavItemIcon(
                        item = item,
                        isSelected = isSelected,
                        onClick = { onItemSelected(item.route) },
                        modifier = Modifier.width(itemWidth)
                    )
                }
            }
        }
    }
}

@Composable
private fun NavItemIcon(
    item: NavItem,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scale by animateFloatAsState(
        targetValue = if (isSelected) 1.15f else 1f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessMedium
        ),
        label = "scale"
    )
    
    val iconColor = if (isSelected) {
        MaterialTheme.colorScheme.primary
    } else {
        MaterialTheme.colorScheme.onSurfaceVariant
    }
    
    Box(
        modifier = modifier
            .height(64.dp)
            .clickable(
                onClick = onClick,
                indication = null,
                interactionSource = remember { MutableInteractionSource() }
            ),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = if (isSelected) item.selectedIcon else item.unselectedIcon,
            contentDescription = stringResource(item.labelResId),
            tint = iconColor,
            modifier = Modifier
                .size(26.dp)
                .scale(scale)
        )
    }
}
