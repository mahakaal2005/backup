# Lottie Splash Screen Implementation

## What was done:

1. **Added Lottie dependency** to your project
   - Updated `gradle/libs.versions.toml` with Lottie version 6.3.0
   - Added Lottie library to `app/build.gradle.kts`

2. **Created SplashActivity**
   - New Activity: `SplashActivity.kt`
   - Displays for 3 seconds before navigating to MainActivity
   - Can be customized by changing the `SPLASH_DELAY` constant

3. **Created splash screen layout**
   - New layout: `activity_splash.xml`
   - Contains a LottieAnimationView (300dp x 300dp)
   - Shows app name below the animation
   - Clean white background

4. **Updated AndroidManifest.xml**
   - Set SplashActivity as the launcher activity
   - Added NoActionBar theme to remove title bar
   - MainActivity is now a regular activity (non-exported)

5. **Added sample Lottie animation**
   - Created `res/raw/splash_animation.json`
   - Simple rotating circle animation included as placeholder

## Next Steps:

### To use your own Lottie animation:

1. Visit [LottieFiles.com](https://lottiefiles.com/)
2. Browse and find an animation you like
3. Download the JSON file (free account required for some)
4. Replace `/app/src/main/res/raw/splash_animation.json` with your downloaded file
5. Make sure the file name stays as `splash_animation.json` or update the reference in `activity_splash.xml`

### To customize:

- **Change animation duration**: Modify `SPLASH_DELAY` in `SplashActivity.kt`
- **Animation size**: Edit `android:layout_width` and `android:layout_height` in `activity_splash.xml`
- **Animation speed**: Add `app:lottie_speed="1.5"` attribute in the LottieAnimationView
- **Background color**: Change `android:background` in the root ConstraintLayout
- **Loop animation**: Already set to `app:lottie_loop="true"`

### To build and run:

```bash
./gradlew clean build
```

Then run the app on your device or emulator through Android Studio.

## File Structure:
```
app/src/main/
├── java/com/example/lottiefiles/
│   ├── SplashActivity.kt (NEW)
│   └── MainActivity.kt
├── res/
│   ├── layout/
│   │   ├── activity_splash.xml (NEW)
│   │   └── activity_main.xml
│   └── raw/
│       └── splash_animation.json (NEW)
└── AndroidManifest.xml (UPDATED)
```

## Popular Lottie Animation Sources:
- https://lottiefiles.com/ - Largest collection
- https://lottiefiles.com/featured - Featured animations
- Search for: "loading", "splash", "logo reveal", "welcome"

Enjoy your new splash screen! 🎉
