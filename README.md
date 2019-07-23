# Installation
npm install  
npm install -g ionic  
npm install -g cordova  

Install the android sdk windows if you're on windows  

Install the android sdk linux if you're on mac/linux  

You may need to set both the ANDROID_HOME directory and the JAVA_HOME directory  

You may need to run the following in your git bash  

"$ANDROID_HOME/tools/bin/sdkmanager.bat" "platforms;android-26"  

# Startup  
npm start

# Generate icons (must have 1024x1024 icon.png in /resources)
ionic resources --icon