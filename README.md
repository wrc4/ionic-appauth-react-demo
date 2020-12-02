This mod is based on a [tutorial](https://developer.okta.com/blog/2019/06/20/ionic-4-tutorial-user-authentication-and-registration) by Matt Raible from Okta to add user login to an ionic 4 App. _"The integration uses Ionic's native HTTP plugin for Cordova because the default HTTP from Capacitor uses a capacitor://localhost origin header and Okta only supports http origins."_

Using the same concept I created a Ionic project (Angular) and added auth using schematics:

```
ionic start secure-ionic tabs
npm i -g @angular-devkit/schematics-cli@0.13.4
npm i @oktadev/schematics
schematics @oktadev/schematics:add-auth
```

# Install NPM packages

```
npm i cordova-plugin-advanced-http
npm i @ionic-native/http
npm i cordova-plugin-safariviewcontroller
npm i @ionic-native/safari-view-controller
npm i cordova-plugin-secure-storage-echo
npm i @ionic-native/secure-storage-echo
npm i cordova-plugin-inappbrowser
npm i ionic-appauth@latest
npm i jetifier
npx jetify
```

Notes: 
1. cordova-plugin-inappbrowser needs to be installed explicitly. 
2. use jetifier to migrate support library to AndroidX.

# Android

`ionic cap add android` -- already added

# Code changes

Change AuthService.ts

# Build & Sync

```
ionic build 
ionic cap copy
ionic cap sync
```

# Native code changes

In _InAppBrowser.java_, find: 

`public boolean shouldOverrideUrlLoading(String url, String method)`

add: 

`url.startsWith("{custom_auth_scheme}") ||`

before: 

`url.startsWith("geo:")`

to allow IAP to properly handle callback. Note that after ionic cap copy/sync you need to re-apply the above fix.

In _AndroidManifest.xml_ and add your {custom_auth_scheme} to scheme of `android.intent.action.VIEW` like this:

```
<data android:scheme="@string/custom_url_scheme" />
<data android:scheme="{custom_auth_scheme}" />
```

# iOS

`ionic cap add ios`

iOS should work out of the box. If there is no redirect back to the App after successful login, add your {custom_auth_scheme} to Info.plist under URLTypes (after `capacitor`)
