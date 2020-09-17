# GooseMod Changelog

## Version Structuring

GooseMod follows semantic versioning, somewhat. However there are 4 release stages:
 - **Pre-alpha** (current) - Highly unstable, not user friendly at all, unrecommended
 - **Alpha** - Quite unstable, somewhat user friendly, still mostly unrecommended
 - **Beta** - Mostly stable, user friendly, mostly recommended
 - **Release** - Completely stable and recommended, etc. (probably unreachable)


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