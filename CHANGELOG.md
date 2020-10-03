# GooseMod Changelog

## v2.2.1

  - ### Fixes
    - Fixed loading toast remaining on screen after injection if not new user


## v2.2.0

  - ### Features
    - New loading process - instead of Discord-like whole screen loading screen, now uses toasts to be less intrusive
    - Only open settings on injection if first time using GooseMod (no settings saved)
    - Better settings injection starting process - fixes bug where settings would sometimes not be injected, also makes it less slow to inject

  - ### Tweaks
    - Text inside toasts are now centered (for multi-line)
    - Return toast element and close function from creating toast function

  - ### Fixes
    - Don't use window object for base scope


## v2.1.1

  - ### Fixes
    - Fixed local (not from module store) modules being saved breaking next install


## v2.1.0

  - ### Tweaks
    - New CSP Bypass URL


## v2.0.1

  - ### Fixes
    - Fixed bug with toasts not displaying properly sometimes


## v2.0.0

  - ### Features
    - Added version hash
    - Added enabling and disabling of modules
    - Added saving settings of modules
    - Only install previously installed modules (mostly for tethered)
    - No longer remove untethered version from being accessible on injection


## v1.11.1

  - ### Fixes
    - Fixed CORS bypasser image method not using CORS proxy variable


## v1.11.0

  - ### Features
    - Allow not using CORS proxy with CSP bypasser methods
    - No longer use CORS proxy with Module Store requests


## v1.10.1

  - ### Tweaks
    - Use new API


## v1.10.0

  - ### Features
    - Added toast API for modules to use
    - May or may not have added easter eggs


## v1.9.1

  - ### Tweaks
    - Updated loading screen to show and link to new GitHub stuff


## v1.9.0

  - ### Tweaks
    - Updated module store URLs to GitHub


## v1.8.1

  - ### Tweaks
    - Tethered version -> Untethered version


## v1.8.0

  - ### Features
    - Added text element to settings API
    - Convert dashes to spaces in categories with Module Store settings UI


## v1.7.0

  - ### Features
    - In injecting loading screen, improve importing default modules step by using newlines and full proper names
    - Better support for GooseMod Tethered
    - Added support for accessing webpack modules


## v1.6.0

  - ### Features
    - Added WYSIWYG Messages, Custom Sounds, Dev Mode and Twitch Emotes to default modules
    - When importing default modules on injection / loading, show which one and the progress


## v1.5.1

  - ### Features
    - Injection loading screen now fades to dark color at the start

  - ### Fixes
    - Fixed loading image / video of Discord logo not looping
    - Fixed importing local module not fully updating settings properly


## v1.5.0

  - ### Features
    - Added local storage support (will help make a lot of modules previously impossible possible)

  - ### Fixes
    - Fixed console error when removing a module not from module store


## v1.4.0

  - ### Features
    - Module store now has remove buttons instead of reimport
    - Renamed reinstall to local reinstall
    - No longer show module manager in browser as it serves no purpose there
    - Hide manage modules in browser as the only purpose it has now is to import local modules

  - ### Fixes
    - Fixed some bugs when updating the module store index


## v1.3.0

  - ### Features
    - Added default (auto-install on injection) modules
    - Settings no longer have to be reopened when importing modules, removing them, etc.

  - ### Fixes
    - Fixed reimport button not turning back into import button not working


## v1.2.0

  - ### Features

    - #### Injector
      - Module Store setting is now filtered into categories and sorted alphabetically
      - CSP Bypasser now queries gateway instead of non-existant page to be more steathy
      - Added Discord-like loading screen when injecting
      - CSP Bypasser initialisation is now much (speeds up entire injection by ~2x) faster as it actually waits for the iframe to load instead of just waiting for 1 second (also will increase reliability)


## v1.1.2

  - ### Fixes

    - #### Injector
      - Increased duration between settings reopen to fix sometimes overlapping settings


## v1.1.1

  - ### Fixes

    - #### Injector
      - Fix bug where module would be deleted before running module store deletion handler


## v1.1.0

  - ### Features

    - #### Injector
      - Added image and blob support to CSPBypasser
      - Now removes reinstall button on browser (unsupported)

  - ### Fixes

    - #### Injector
      - Fixed bug on Windows where closing settings would close Discord
      - Fixed crash
      - Fixed CSPBypasser sometimes failing on some origins

  - ### Other Changes

    - Removed easy injector
    - Moved modules to API repository


## Release v1.0.0

  - ### Features

    - #### Injector
      - Added separator between other GooseMod options and reinstall and uninstall
      - Added Module store
      - Added normal (brand) button and text setting option
      - Now reopens settings when doing some things instead of just closing
      - Removed embedded


## Beta v0.9.2

  - ### Features

    - #### Injector
      - Reallow importing modules in embedded mode, but desktop client only


## Beta v0.9.1

  - ### Features

    - #### Injector
      - Disable importing modules in embedded mode


## Beta v0.9.0

  - ### Features

    - #### Embedder
      - Added embedded mode


## Beta v0.8.1

  - ### Features

    - #### Injector
      - Automatically opens settings on the manage modules page when injected

    - #### Module: RainbowCord (v1.0.0)
      - Added module

    - #### Module: Role Colored Messages (v1.0.0)
      - Added module

    - #### Module: Egg Scrambler (v1.0.0)
      - Added module
    
  - ### Fixes

    - #### Module: Message Scrambler (v1.0.1)
      - Fixed some potential symbol conversion errors


## Beta v0.8.0

  - ### Features

    - #### Injector
      - Added module descriptions to module manager
      - Added subtext option for toggles and danger button setting components
      - Remade module headers for module manager, now including author

    - #### Module: Twitch Emotes (v1.0.0)
      - Added module

    - #### Module: Message Scrambler by Fjorge (v1.0.0)
      - Added module

    - #### Module: Visual Tweaks (v2.0.1)
      - Added description and author
      - Added subtext to some options

    - #### Module: Fucklytics (v1.1.2)
      - Added description and author
      - Added subtext to some options

    - #### Module: Dev Mode (v1.0.1)
      - Added description and author
  
  - ### Backend / Structural Changes

    - Modules now in "category" folders

  - ### Fixes

    - #### Injector
      - Fixed that modules without setting would fail to be removed


## Beta v0.7.0

  - ### Features

    - #### Injector
      - No longer ask for modules on injection immediately
      - Module manager now shows deletion button instead of toggle for removing modules

    - #### Easy Injector
      - Renamed Quick Injector to Easy Injector
      - Reduced size

  - ### Fixes

    - #### Injector
      - Fixed that removing a module would not remove the setting in the current settings layer (from v0.6.0)


## Beta v0.6.0

  - ### Features

    - #### Injector
      - Uninstall option is now colored red like "Log Out" option
      - GooseMod options are now inserted before "Log Out" option
      - Added Reinstall option

    - #### Quick Injector
      - Added quick injector

  - ### Tweaks

    - #### Injector
      - No longer use custom logging for logging version on run
      - Removed version iteration as it was mostly unused
      - Added Discord version channel and desktop version to startup import logging


## Beta v0.5.0

  - ### Features

    - #### Injector
      - Uninstall confirmation uses Discord's confirmation box instead of Electron's (thanks Upsidedown!)
      - Cancelling uninstall no longer shows empty "Uninstall Cancelled" page
      - Added Manage Modules to easily import and remove modules
      - Moved modules into own settings category
    
    - #### Module: Visual Tweaks (v2.0.0)
      - Profile popup background is now colored correctly according to theme
      - Server boost page is now colored correctly according to theme
      - Tweaked some backgrounds for darkest mode
      - Added version and name to export
      - Darkest mode is now default

    - #### Module: Fucklytics (v1.1.1)
      - Added version and name to export

    - #### Module: Dev Mode (v1.0.0)
      - Added version and name to export


## Alpha v0.4.4

  - ### Features

    - ### Module: Visual Tweaks (v1.4.0)
      - Properly color mention and slash autocompletion menu


## Alpha v0.4.3

  - ### Features

    - ### Module: Visual Tweaks (v1.3.0)
      - Properly color friends container section


## Alpha v0.4.2

  - ### Features

    - ### Module: Visual Tweaks (v1.2.0)
      - Added better highlighting for messages on hover for darker (and darkest) modes


## Alpha v0.4.1

  - ### Features

    - #### Injector
      - Added confirmation to Uninstall from settings


## Alpha v0.4.0

  - ### Features

    - #### Injector
      - Modules now have remove handler
      - No longer uses global window variable, much more hidden now
      - Added uninstall option to end of settings which uninstalls / removes GooseMod without reloading / refresh (leaves some small amounts of code but no visual or noticable changes remain, small traces can be removed by refreshing / reloading)

    - #### Module: Visual Tweaks (v1.1.0)
      - Now disables all tweaks on remove handler

    - #### Module: Fucklytics (v1.1.0)
      - Reverts proxy function remove handler


## Alpha v0.3.0 (Bump from Pre-alpha to Alpha!)

  - ### Features

    - #### Injector
      - Now injects version in to info in settings sidebar
      - Made subtitle for settings header in settings pages settable

    - #### Module: Visual Tweaks (v1.0.1)
      - Added version to settings header

    - #### Module: Fucklytics (v1.0.1)
      - Added version to settings header

  - ### Tweaks

    - #### Injector
      - Tweaked version logging in console

  - ### Fixes

    - #### Module: Visual Tweaks (v1.0.1)
      - Fixed help button not being hidden when first imported even when enabled


## Pre-alpha v0.2.1

  - ### Misc. Changes

    - Removed `test` module as it served no use
    - Removed `Test` setting entry


## Pre-alpha v0.2.0

  - ### Features

    - #### Module: Visual Tweaks
      - Added "Darker Mode" to Visual Tweaks Module
      - Added "Darkest Mode" to Visual Tweaks Module

    - #### Injector
      - Added version displaying when injector is ran
  
  - ### Fixes

    - #### Module: Visual Tweaks
      - Fixed tweaks being enabled on import even if being "false"

    - #### Injector
      - Fixed potential future errors in logger if region is not found and not a module
      - Fixed toggles in settings not having bottom margin
      - Fixed headers (not first one) not having top margin
      - Fixed toggles not having dividers after them

  - ### Backend / Structural Changes

    - Renamed `base` directory to `modules` as it is a more accurate and understanding name


## Pre-alpha v0.1.0
  - Initial (Public) Release