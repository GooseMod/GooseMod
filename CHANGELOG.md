# GooseMod Changelog

## [DEV] v5.8.0 [2021-01-0X]

  - ### Features
    - Sidebar selectors in Module Store UI are now all off by default and allow selection of each category for mixing
    - Numbers in the Module Store UI sidebar selectors now change as they are chosen and only count visible cards
    - Use hash instead of version for JS caching of Module Store modules

  - ### API Additions
    - [GitHub Issue #13](https://github.com/GooseMod/Injector/issues/13): Added support for checkboxes in context menu patcher API
    - [GitHub PR #17 by SrKomodo](https://github.com/GooseMod/Injector/pull/17): Add initial value method for color settings
    - Added ReactDOM to common Webpack modules


## v5.7.0 [2021-01-05]

  - ### Features
    - New injecting UI (as shown in changelog header)
    - Added support for videos in changelog modal

  - ### Tweaks
    - Updated changelog image to new injecting UI

  - ### Fixes
    - Fixed changelog modal being broken by videos in official changelog


## v5.6.0 [2020-12-07]

  - ### Features
    - [GitHub PR #15 by Fjorge](https://github.com/GooseMod/Injector/pull/15): Add standard removeItem function to Settings API
    - Added import and remove confirmation toasts with local modules


## v5.5.0 [2020-12-06]

  - ### Features
    - Display error when a module fails to import instead of causing an error and halting GooseMod loading


## v5.4.0 [2020-12-04]

  - ### Features
    - [GitHub PR #11 by Fjorge](https://github.com/GooseMod/Injector/pull/11): Only exclude modules with all (not some) authors unselected in Module Store Sidebar
    - [GitHub PR #12 by Fjorge](https://github.com/GooseMod/Injector/pull/12): Add Changelog button to GooseMod settings

  - ### Tweaks
    - Removed uninstall setting option


## v5.3.1 [2020-12-04]

  - ### Fixes
    - Fixed easter egg's audio not playing correctly


## v5.3.0 [2020-12-04]

  - ### Features
    - [GitHub PR #6 by Fjorge](https://github.com/GooseMod/Injector/pull/6): Add audio property to easter eggs
    - [GitHub PR #8 by Fjorge](https://github.com/GooseMod/Injector/pull/8): Let modules have author as an array


## v5.2.0 [2020-11-30]

  - ### Fixes
    - Updated Module Store's Sidebar selection UI to use Discord's new radio buttons


## v5.1.2 [2020-11-29]

  - ### Fixes
    - Fixed getting localStorage / loading erroring out when using (B)BD


## v5.1.1 [2020-11-16]

  - ### Fixes
    - Fixed extra info not being sent to handlers properly for context menu patcher
    - Removed extra unneeded logging in context menu patcher


## v5.1.0 [2020-11-15]

  - ### Features
    - Clicking on (some) authors now opens their profile in Module Store

  - ### Tweaks
    - Clicking title / main text on card no longer toggles switch in Module Store

  - ### Fixes
    - Fixed toggling modules in Module Store with switch would try and call the module's loading finished event handler even if it did not exist


## v5.0.1 [2020-11-12]

  - ### Tweaks
    - Removed some extra debug logging

  - ### Fixes
    - Fixed GooseMod settings being injected in all sidebars instead of just settings


## v5.0.0 [2020-11-09]

  - ### Features
    - Native / React settings sidebar injection instead of DOM, resulting in no lag caused by GooseMod when opening settings and them being there with no delay
    - Added native patcher library / API (based on Powercord <3)
    - Added native context menu injection library / API, this now allows modules to easily add their own entries to context menus with only a couple lines oF JS instead of needing to reinvent the wheel everytime
    - Moved version info into separate version info section, there is now a divider after Discord's version info and then GooseMod's own

  - ### Tweaks
    - Slightly optimized Module Store settings UI generation
    - Module Store no longer readjusts settings UI width again when importing or removing a module


## v4.10.0 [2020-11-05]

  - ### Features
    - Added author and imported sections to Module Store sidebar

  - ### Fixes
    - Fixed GooseMod changelog being cached
    - Fixed Module Store's card container rows being too high and resulting in strange gaps (sometimes when filtering)


## v4.9.0 [2020-11-03]

  - ### Features
    - Changed Manage Modules setting into "Local Modules", only shows and allows management of local modules (imported local files) to avoid confusion / duplication


## v4.8.1 [2020-11-02]

  - ### Features
    - Made new version checking asynchronous so it does not result in delay when initialising


## v4.8.0 [2020-11-02]

  - ### Features
    - Added hash checksum and version checking on initation for security / verification


## v4.7.0 [2020-11-02]

  - ### Features
    - Module Store UI improvements, now keeps search bar and sidebar filtering after importing or removing modules via buttons

  - ### Tweaks
    - Shrunk Module Store UI's sidebar slightly to allow more cards


## v4.6.0 [2020-11-01]

  - ### Tweaks
    - No longer uses janky CSP bypass, instead now relies on it being disabled when GooseMod is injected
    - Cleaned up some code, removed some now unneeded logging and some unnecessary old comments


## v4.5.0 [2020-10-31]

  - ### Features
    - Added complete new dialog / wizard for setup / first time injection, now asks what "pack" (set of modules) you want to install as well as what theme you want to install. Pre-existing users won't be affected.


## v4.4.1 [2020-10-30]

  - ### Tweaks
    - Stopped using version specific / special changelog images

  - ### Fixes
    - Fixed changelog sometimes being glitchy, could sometimes occur when some Discord experiments / special changelog types override the changelog


## v4.4.0 [2020-10-30]

  - ### Features
    - Added custom component to settings UI API

  - ### Tweaks
    - Reduced old logging in sidebar settings generation


## v4.3.0 [2020-10-29]

 - ### Features
   - Added GooseMod changelog, it appears whenever GooseMod updates with the latest info from Injector repo's CHANGELOG.md
   - Rewrote CSP Bypasser, it now uses the object's fetch function directly 
   - Added UserScript support in CSP Bypasser, thanks to [AAGaming](https://github.com/AAGaming00) for creating a UserScript for web


## v4.2.2

  - ### Tweaks
    - Added class to injected GooseMod settings to allow easier styling of them


## v4.2.1

  - ### Fixes
    - Fixed local module importing and only ask for one file
    - Fix large (>~1MB) modules failing to load


## v4.2.0

  - ### Features
    - Added color picker to Settings UI API
    - New CSP bypasser which uses standard URI


## v4.1.0

  - ### Features
    - Added sidebar to Module Store UI


## v4.0.0

  - ### Tweaks
    - Hid local reinstall option (and divider) as it is mostly useless / never used

  - ### Backend
    - Rewrote to not use global / window object - fixes many potential bugs and is more secure
    - Moved some misc. settings options into goosemod.settings instead of bloating the parent scope
    - Module functions are no longer binded to goosemod scope, instead it is avaliable as an object in the module eval


## v3.2.1

  - ### Features
    - Added separator to Module Store UI

  - ### Fixes
    - Fixed being able to input newlines in Module Store UI search box


## v3.2.0

  - ### Features
    - Revamped Module Store UI to use cards, and now has a search bar


## v3.1.0

  - ### Features
    - Added hash checking to Module Store for each module

  - ### Fixes
    - Fixed local module importing being broken
    - Fixed reinjecting after being removed in the past not working and still thinking it had been removed

  - ### Backend
    - Sleep and ab2str specific util JS files / imports as they are used through out (more than once)
    - Cleaned up some code when initially loading


## v3.0.1

  - ### Tweaks
    - Removed migration code replacing for modules to fix issues
    - Removed old unneeded logging on startup
    - New way of getting injector version hash
    - Add version toast on injection


## v3.0.0

  - ### Backend
    - Rewritten to use multiple JS files with Parcel


## v2.4.0

  - ### Features
    - Added new settings injector backup system to fix settings injection when settings button click event fails
    - Added module JS cache - installed modules have their JS code installed and that cache is used if there are no updates for the module, reducing network requests and latency


## v2.3.0

  - ### Features
    - Put theme and hardcoded color fixer to start of to install modules on injection always
    - Made Dracula Theme new default theme (used to be Darkest)


## v2.2.2

  - ### Fixes
    - Fixed some issues when injecting whilst settings are open


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
