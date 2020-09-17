# GooseMod Changelog

## Version Structuring

GooseMod follows semantic versioning, somewhat. However there are 4 release stages representing how usable it is:
 - ~~**Pre-alpha** - Highly unstable, not user friendly at all, unrecommended~~
 - **Alpha** (current) - Quite unstable, a bit user friendly, still mostly unrecommended
 - **Beta** - Mostly stable, user friendly, mostly recommended
 - **Release** - Completely stable and recommended, etc. (probably unreachable)


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