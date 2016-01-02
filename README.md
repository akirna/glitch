# Glitch

Install directions:

**To set up the server (currently hard coded to run on brki164-lnx-10):**

1. ssh brki164-lnx-10
2. cd into this directory
3. python glitchserver.py

The server should now be running.

*Note: You can move the server to any location. If you have it in your home directory, you will be able to use the extension with files in all of your subdirectories. If you would like to change the Linux machine on which the server is running, change the host name and port global variables in glitchserver.py, popup.js, and background.js, and then ssh into that machine instead.*

**To install the extension:**

1. Visit the chrome://extensions URL in a Chrome browser
2. Check the box marked Developer mode
3. Click "Load Unpacked Extensions"
4. Choose the folder called Glitch

The extension should now be installed.

