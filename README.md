# 10xRashed's AP37 Launcher - script

`user_script.js` for AP37 Text-based Launcher

A custom-built, highly efficient Text-User Interface (TUI) launcher script designed for the **AP37 Text-based Launcher** on Android. This script offers a streamlined and visually distinct app launching experience, integrating a full-featured QWERTY keyboard and the popular Dracula color scheme.

## Key Features

*   **Dracula Theme:** A modern and consistent color palette (`#282a36`, `#f8f8f2`, `#ff79c6`, etc.) provides a sharp, high-contrast interface that is easy on the eyes.
*   **Integrated QWERTY Keyboard:** An on-screen, interactive QWERTY keyboard facilitates rapid text input for searching. It includes dedicated layouts for uppercase, numbers, and symbols, enhancing usability.
*   **Dynamic App Filtering:** Type to instantly filter your installed applications, enabling quick location and launch of desired apps.
*   **Horizontal App Navigation:** Applications are displayed in an optimized horizontal grid, making efficient use of screen space for easy browsing.
*   **Real-time System Metrics:** The launcher's header provides a glanceable display of essential device information, including current time, battery level, and a customizable user identifier (`10xRashed`).
*   **Adaptive Layout:** The app display area intelligently adjusts its size to accommodate the presence or absence of the on-screen keyboard, ensuring optimal content presentation.
*   **Full Touch Responsiveness:** Designed for intuitive interaction through touch gestures, providing a seamless experience on Android devices.

## Installation

This launcher is provided as a single JavaScript file (`user_script.js`) for direct implementation within the AP37 Text-based Launcher environment.

1.  **Install AP37 Text-based Launcher:** If not already installed, download the official launcher from the Google Play Store:
    [https://play.google.com/store/apps/details?id=com.aurhe.ap37](https://play.google.com/store/apps/details?id=com.aurhe.ap37)
2.  **Access Script Editor:** Open the AP37 Text-based Launcher app, navigate to its settings, and locate the "Script Editor" or "User Script" section.
3.  **Paste Script:** Copy the entire content of this `user_script.js` file and paste it into the AP37 script editor.
4.  **Enable as Launcher:** In the AP37 settings, activate the "Set as launcher" option and select your newly added script.
5.  **Restart (Recommended):** For all changes to take full effect, it is advisable to restart the AP37 Text-based Launcher or your Android device.

## Usage

Interaction with the launcher is designed to be straightforward and efficient:

*   **Launch Applications:** Tap directly on an app's name in the displayed list. Alternatively, highlight an app and press `Enter` on the keyboard.
*   **Search Functionality:** Tap the `[TAP HERE]` prompt in the header (or the `[SHOW KB]` button in the footer) to reveal the on-screen keyboard. As you type, the app list will dynamically filter.
*   **Keyboard Operation:**
    *   **`bksp`**: Delete the last character.
    *   **`shift`**: Toggle between uppercase and lowercase letters.
    *   **`123`**: Switch to the numeric character layout.
    *   **`#+=`**: Access special symbols.
    *   **`ABC`**: Return to the standard QWERTY layout.
    *   **`space`**: Insert a space character.
    *   **`X` (Close) / `[HIDE KB]`**: Dismiss the on-screen keyboard.
*   **System Information:** The current time and battery percentage are continuously updated and displayed in the top-right corner of the header.

## Customization

The launcher's visual elements are highly customizable through the `config` object located at the beginning of the `user_script.js` file. This allows users to personalize the color scheme and interface characters.

```javascript
// ============================================================================
// CONFIGURATION - DRACULA THEME
// ============================================================================
var config = {
  colors: {
    background: '#282a36',    // Dracula Background
    currentLine: '#44475a',   // Dracula Current Line
    // ... adjust other color definitions here
  },
  chars: {
    horizontal: '─',
    vertical: '│',
    // ... modify border and bullet characters here
  }
};
```

Feel free to modify these hexadecimal color codes and character definitions to match your personal aesthetic preferences.

## Credits

Developed by **10xRashed**.

## License

This script is distributed under the MIT License.
