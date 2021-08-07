# GooseMod Changelog

## v11.0 [2021-08-07]

  - ### Internal Rewrite
    - **GooseMod is now almost half the size as it was before.** Smaller size should help load times and reduces impact of new additions in the future!
    - **Better for GooseMod's future.** GooseMod now uses Rollup; this helps developing GooseMod for the future: improving efficiency and speed of development.

  - ### Error Fail-safing
    - **GooseMod is now resistant to crashes.** You should experience less crashes! GooseMod now hardens most things plugins patch into to resist crashes and just error out instead.

  - ### Better Debugging
    - **GooseMod now is easier and better to debug.** Both plugins and GooseMod itself is now easier to debug. Should let issues be easier to fix in future.

  - ### Patcher API
    - **Adding to context menu for messages now also adds to expanded MiniPopover.** Should help web users who don't have right click menus.
    - **GooseMod commands autocomplete section no longer adds multiple times when in DMs.**
    - **Rewrote ID generation.** Should be a bit faster and more random now.

  - ### Tweaks and Fixes [progress]
    - **Fixed showing no PGP verification warning when adding repo even if repo did have valid PGP.**
    - **Home expanded icon is now stored.**


## v10.2 [2021-07-31]

  - ### PGP Verification
    - **Repos now have PGP verification support.** Repos can now be signed by their maintainers and verified within GooseMod. This should both improve security generally and for some specific attacks. The main advantage PGP adds is that it verifies repos are made and released by their owners. This prevents someone else taking over and publishing malicious updates as the repo would have to be signed with the same private key, which they should not have access to.

  - ### Main Settings
    - **Added copy debug info to utilities.**
    - **Moved reset setting to end of utilities section.**
    - **Added text to experimental section to clarify what it means.**
  
  - ### Commands
    - **Commands now use a custom GooseMod section.** Was previously reverted to using built-in after a Discord update.


## v10.1 [2021-07-26]

  - ### Internal Rewrites
    - **Rewrote logger output to use text and nicer colors.** Now easier to look at and filter.
    - **Rewrote React utils library.** Now supports new React used in Discord Canary and now a bit more efficient.
    - **Rewrote Webpack library.** Additionally also now a bit more efficient and generally better.

  - ### Profile Store
    - **Developer's GooseMod modules are now listed under a category in their user profile.** Added as a new neat way of discovering modules and developers.

  - ### Main Settings
    - **Separated experimental settings into their own category.** Now your settings is even tidier.

  - ### Home
    - **GooseMod home category now stays collapsed after a refresh if it was collapsed previously.**
  
  - ### Tweaks and Fixes [progress]
    - **Fixed custom color picker in settings not appearing.**
    - **Removed excess old debug logging.** Clearing up your console since 2021.
    - **Fixed custom name and footer for GooseMod changelog.**
    - **Fixed repeated class name in home injection container.** No one would have noticed but we fixed it anyway:tm:.
    - **Fixed commands (Canary-only).** Now using built-in instead of a GooseMod category due to internal update changing a lot of things.


## v10.0.0 [2021-07-16]

  - ### Storage
    - **New storage system.** GooseMod now uses WebExtension storage for storing GooseMod preferences, installed modules, cache, etc. This should make storing more reliable, secure, and generally better.

  - ### Desktop Using Extension
    - **GooseMod for desktop clients now uses the GooseMod for Web extension internally.** This simplifies code (avoiding reuse / complications) and should result in faster (~50%) and lighter injection.


## v9.6.0 [2021-07-13]

  - ### Store
    - **Images are now shown larger when clicked.** When clicking a header image, a modal now appears showing all the images for the module (with larger sizing).
    - **Filter times are now faster.** It should be about twice as fast due to some fixes and optimisations under the hood.

  - ### Settings
    - **Added start tour option.** You can now easily go through the tour again to catch up on GooseMod's core functions.
    - **Other UI improvements.** Purge caches is now not marked as dangerous.
    - **Added experimental Snippets option.** More info soon:tm:.

  - ### Patcher API
    - **Added GuildBadges API for adding badges to guild headers.** It's usage is near identical to UserBadges, but adding to the header of guilds instead of badges for users.

  - ### GooseMod Badges
    - **Added badge to GooseNest server to show it's official.**

  - ### Out of The Box [progress]
    - **Removed pack modal.** Now just using a few default modules and relying on users to install their own after being shown the Store.
    - **Settings now scrolls to show the GooseMod section.**

  - ### Tweaks and Fixes [progress]
    - **Tweaked loading screen text.**
    - **Fixed various issues caused by a Discord update breaking i18n.**
    - **Fixed CSS cache keeping old / removed themes, as well as other improvements.**


## v9.5.0 [2021-07-06]

  - ### New First Time Tour
    - **New tour system.** There is now a tour when opening GooseMod for the first time (since this update). It covers the core features of GooseMod: the Store, settings and community (focusing on the Discord server).

  - ### Store Improvements [progress]
    - **Added separate imported tab in Home header.** Now has a tab just for imported modules, and a main Store tab for all.
    - **Fixed bugs with modules not looking removed / added after changing Home page.**
    - **Fixed conflicts with some themes.** Mostly where toggles for modules would show when it shouldn't be shown.

  - ### Fixes and Tweaks [progress]
    - **Fixed some toasts not working.** Previously toasts without options or type would cause errors.


## v9.4.0 [2021-07-03]

  - ### Fixes and Tweaks [progress]
    - **Dramatically decreased Store loading times (40s -> 3s) when loading GooseMod sometimes.** Mostly when opening GooseMod for the first time, purging cache, or sometimes randomly.
    - **Renamed Module Store to Store fully throughout.**
    - **Added refresh prompt when purging cache via setting.**
    - **Fixed some small UI bugs with Firefox.**
    - **Fixed GooseMod commands not working.**
    - **Fixed OOTB to open Themes in Home instead of trying to open it in settings.**


## v9.3.0 [2021-06-28]

  - ### Repos Improvements [progress]
    - **More reliable modal.** Repos which fail to load now show up so you can remove / disable them.
    - **Simplified internals.** Mostly a pro for us, repos are now easier to work with and simpler internally in GooseMod.
  
  - ### Store Improvements [progress]
    - **Loading is more reliable.** Most bugs for being stuck in loading have been fixed, apologies for any issues.

  - ### New Debug Setting [progress]
    - **Debug toasts have been added.** You likely won't need them, but debug toasts have been added. This setting shows some toasts on certain events for insights into internal code.


## v9.2.0 [2021-06-26]

  - ### Backup System
    - **New backup system.** There is a new backup system in GooseMod settings allowing you to backup your modules and settings. Backing up produces a backup file which you can then use to restore later on.

  - ### Store Improvements [progress]
    - **Ludicrous speed.** Clicking on home items is now significantly faster than before.
    - **Squashed bugs.** A bug causing Store pages to load forever has been fixed, as well as some rare crashes. Store in Settings is also now up and working again.
    - **Better sorting and filtering.** Options are now properly shown and applied after going off and back to Store pages.


## v9.1.0 [2021-06-26]

  - ### Settings Improvements
    - **Home now has improved loading.** Should be faster and no longer showing it's loading for the rest of time.
    - **Settings which need a refresh now have a neat prompt.** Instead of the disclaimer text, it now has a prompt for you after you change them.
    - **Icons now have tooltips.** To clear up any confusion, hovering over any setting icons (experimental or debug) now shows a tooltip saying what they mean.
    - **New debug settings.** For plugin developers and us, we now have new debug settings to help test and try out things.


## v9.0.0 [2021-06-25]

  - ### React Settings
    - **It's finally here: React settings.** Long requested by some, it's finally done. We rewrote essentially over 2.5 thousand lines of JS so now our settings are made using React (instead of DOM which it used to use). What this means for you:
    - **More fitting UI.** GooseMod's settings are now even more fitting with Discord's, now featuring animations, new colors, and finer looking items, making it now more seamless than ever.
    - **Plaid speed.** Settings should be noticeably faster both when opening it and when clicking GooseMod pages.
    - **Rewritten home.** We also rewrote some of our home settings code. Now home items should be more reliable, plus a new codebase which allows easier additions and tweaks for the future.
  
  - ### Tweaks and Fixes [progress]
    - **Fixed user badges.** A friendly Discord update broke them sometimes a few days ago but now they are back up and running.
    - **Removed i18n debug option.** Removed as it was no longer being used and caused confusion with some users.


## v8.12.0 [2021-06-22]

  - ### Home [progress]
    - Show loading indicator whilst loading fully, used to just wait for any modules, not all
    - Fixed Store pages not opening when clicked if user has no DMs

  - ### Store [progress]
    - Fixed id cache not being invalidated every day
    - Added localised path support for repo images, like using /images/file.png

  - ### Settings [progress]
    - Use Discord's new green color in switches

  - ### i18n [fixed]
    - Fixed getting Discord's values not working, caused settings and more to not appear correctly

  - ### GooseMod Badges [progress]
    - Added sponsor badge to new sponsors


## v8.11.0 [2021-06-15]

  - ### Toasts
    - New translucent design

  - ### Patcher API
    - Fixed UserBadges sizes being off

  - ### Fixes [fixed]
    - Fixed GooseMod changelog not removing footer and changing title when appearing at startup
    - Fixed store in settings expanding too wide


## v8.10.0 [2021-06-12]

  - ### Store
    - New categories design, having headings and horizontal sections of cards for categories like top starred and recently updated
    - Added repos button to header via cloud icon instead of being in settings
    - Added shadow to cards
    - Removed Discord's default toolbar from the toolbar
    - Reduced delay between id cache queue API requests

  - ### Home
    - Added loading indicator if the store is still loading
    - Improved selection performance
    - Fixed clicking button icons not properly opening store pages
    - Fixed various crashes caused by switching to store from library


## v8.9.0 [2021-06-07]

  - ### Home
    - Made GooseMod section collapsible via an icon in the header
    - Added updated badge to modules which have been updated within 5 days
    - Added update button to page headers for easy updating of store repos
    - Made new modules appearing in home pages easier, specifically without needing to click off then back to home
    - Fixed various crashes caused by switching to store from a DM
    - Fixed clicking a page from a group DM causing member list to remain shown

  - ### Webpack API [progress]
    - Added new common modules: channels, constants

  - ### Fixes [fixed]
    - Fixed changelog not appearing on new update versions


## v8.8.0 [2021-06-05]

  - ### Home
    - GooseMod Store is now in home under a new GooseMod section for better ease of use and visibility

  - ### Main Settings
    - Added option to keep GooseMod Store in settings
    - Added verified mark by repo names which are official (by GooseMod) to the repos modal

  - ### Tweaks [progress]
    - Added new translators to GooseMod badges
    - Changed settings from async waiting for i18n to awaiting i18n at start of load
    - Removed message easter eggs

  - ### Store UI
    - Small tweaks to increase accessibility and ease of use
    - Removed separator

  - ### Fixes [fixed]
    - Fixed avatar data attributes causing errors and not working


## v8.7.0 [2021-05-30]

  - ### Store Redesign
    - New header preview images with author inside
    - New GitHub button

  - ### Data Attributes
    - Added with experimental option (disabled by default), adds some data attributes to some elements as some themes require them

  - ### Main Settings
    - Added "requires refresh" to some options which require it

  - ### Module Store
    - Add better user caching (queueing and time invalidation)
    - Redo sorting and filtering dropdowns when values have been previously set
    - Sort by stars by default

  - ### Settings API
    - Prefix section to possibly fix conflicts with other mods

  - ### Patcher API
    - Fixed username being broken due to update
    - Fixed notices being broken due to update


## v8.6.0 [2021-05-24]

  - ### Features
    - Added GooseMod Badges, built-in custom badges for GooseMod contributors - Sponsors (people who have donated money), Developers (people actively developing GooseMod itself) and Translators (people who have translated GooseMod to other languages)

  - ### Main Settings
    - Added "Force Theme Settings" experimental option, forces all themes to show auto-generated settings
    - Added "GooseMod Badges" option, toggles GooseMod Badges (see features)
    - Better default settings implementation

  - ### Module Store UI
    - Added "Last Updated" option to sort dropdown, orders modules by when their source code was last updated

  - ### Patcher API
    - Added UserBadges, lets you easily add custom badges to users
    - Added Username, lets you easily add custom React elements to usernames
    - Improved base patch to be more reliable when patches don't return proper values
    - Fixed tooltips being semi-broken for ChannelTextAreaButtons and MiniPopover

  - ### Tweaks
    - Removed safe mode
    - Removed some excess debug logging

  - ### Settings API
    - Allowed custom elements to be function called
    - Fixed removeItem removing last item if the item with name provided doesn't exist


## v8.5.0 [2021-05-10]

  - ### Settings API
    - Added new text input item

  - ### Fixes
    - GooseMod's changelog no longer appears incorrectly and properly resets it to Discord's regular changelog


## v8.4.0 [2021-05-08]

  - ### Main Settings
    - Added option to force internal i18n GM lang

  - ### Settings API
    - Added dropdown item for toggle-like but with dropdown like in Store UI
    - Added selected function for dropdowns, to choose which to select
    - Added sessionStoreSelected for dropdowns and dropdown items, for temporary storage of selected item

  - ### Patcher API
    - Added HeaderBarButtons, lets you easily add buttons to the top right header, similar to ChannelTextAreaButtons

  - ### Store UI
    - Disabled Last Updated sort by dropdown option (for now)


## v8.3.0 [2021-05-07]

  - ### Main Settings
    - Renamed "Internals - Bootloader" section to just "Bootloader"
    - Added option to disable Module Store auto updating
    - Added option to force update Module Store repos and modules

  - ### Module Store Redesign
    - Moved repos button to main settings
    - Replaced sidebar with dropdown menus, sort by and imported filter
    - Changed separator texts from general "modules" to specific types ("themes" or "plugins")

  - ### Internals
    - Rewrote changelog API implementation

  - ### Fixes
    - Fixed ChannelTextAreaButtons Patcher API


## v8.2.0 [2021-04-22]

  - ### Features
    - CSS Cache, GooseMod now caches Modules' CSS so most styling will appear as soon as GooseMod begins to inject. This works by detecting CSS which is currently injected and then caching it in local storage during client use, which is then loaded quickly at the start of GooseMod injection
    - GooseMod changelog info is now included in builds instead of depending on online API

  - ### Main Settings
    - Made separate "Utilities" section
    - Added "Purge Caches" button

  - ### Tweaks
    - Removed adding PC Plugins repo when updating to v8.0.0 for the first time


## v8.1.0 [2021-04-18]

  - ### Fixes
    - Fixed rare issues in Module Store settings where not all modules would appear, mostly occuring because of getting user id info being ratelimited
    - Fixed disabled modules appearing unimported in Module Store settings
    - Fixed disabling and enabling changelog setting without refreshing not appearing correctly
    - Fixed Module Store not working with 17 long user ids
    - Fixed failing to inject when using a language without GooseMod translation
    - Fixed first time wizard not working and causing errors
    - Fixed "Reset GooseMod" not working, also tweaked it's confirmation dialog description to clarify further and simplify

  - ### Tweaks
    - Removed excess logging in the notices Patcher API



## v8.0.0 [2021-04-10]

  - ### i18n
    - Added partial i18n support

  - ### Settings
    - Added main GooseMod settings
    - Added settings footer promoting ways to support GooseMod
    - Remade how settings are placed in SettingsView

  - ### Module Store
    - Show toast when getting a repo fails instead of freezing injection
    - Load settings on Module Store import instead of bulk loading after all imports
    - Check for module (plugin and theme) updates every hour and hotupdate

  - ### Performance
    - Made injection init much more async / desynced from other components

  - ### Patcher API
    - Added commands API, allows easy custom commands
    - Added internal message API, allows easy sending of internal (Clyde-like) messages
    - Added notices API, allows easy sending of notices (banners at the top with text and button)

  - ### Webpack API
    - Added new common modules:
      - FluxDispatcher
      - i18n

  - ### Tweaks
    - New logging console output
    - Dynamic local storage removal on goosemod.delete
    - Removed v6 to v7 migration fix
    - Removed adding PC theme repo when updating to v7.2.0 for the first time
    - Removed checking if hash and version matches latest online record

  - ### Fixes
    - Fixed stored repo urls not being removed on goosemod.remove
    - Fixed some usage of window scope instead of local internally


## v7.2.0 [2021-03-19]

  - ### Features
    - Moved Module Store settings into separate "Themes" and "Plugins" items
    - Added GooseMod settings to setting context menu (right clicking the settings cog button)

  - ### Patcher API Improvements
    - Added dynamic sub menu support
    - Added error output when patches fail

  - ### Patcher API Fixes
    - Fixed Patcher Base not overriding toString properly
    - Fixed Patcher Context Menu sub menus causing errors

  - ### Tweaks
    - Made warning toasts for mismatching hash + version show as actual "danger" types rather than normal


## v7.1.0 [2021-02-28]

  - ### Features
    - Module Store individual repos, you can now add external repos for modules which aren't in the official Module Store plus now the Module Store is split up into 3 separate repos
    - [GitHub Issue #2](https://github.com/GooseMod/GooseMod/issues/2): Remembering disabled modules

  - ### Fixes
    - Fixed not all lowercase tags causing errors

  - ### Backend Improvements
    - Rewrote and simplified module manager
    - Moved module settings store exported functions to a seperate object rather than all in the main object


## v7.0.0 [2021-02-06]

  - ### UI Improvements - General
    - Loading Toast: Added newline support
  
  - ### UI Improvements - Module Store
    - Stopped authors with discriminators being separated with just author name
    - Added module popouts when clicking the description of cards
    - Moved disabling and enabling toggle in cards to bottom right
    - Moved version to top right container
    - Added cutting off description and title if they are longer than certain amounts of lines
    - Added GitHub metadata to top right container

  - ### Patcher API Improvements
    - Added error handling if patches cause an error, it now just skips the patch instead of likely crashing
    - [GitHub Issue #18](https://github.com/GooseMod/GooseMod/issues/18): ChannelTextAreaButtons: Added optional options to show button in upload modal and in readonly channel, now both not showing by default
    - [GitHub Issue #22](https://github.com/GooseMod/GooseMod/issues/22): ChannelTextAreaButtons and MiniPopover: Allow React elements as imgSrc instead of only image URLs

  - ### DOM To React
    - [GitHub Issue #26](https://github.com/GooseMod/GooseMod/issues/26): Changed goosemod.confirmDialog to use React instead of DOM

  - ### Internationalization
    - [GitHub Issue #19](https://github.com/GooseMod/GooseMod/issues/19): Fixed failing to get settings button and settings close button when using non-English languages in Discord

  - ### Backend Improvements
    - Use new Module Store API
    - Use new Patcher API for Settings injection

  - ### Fixes
    - Made custom version info in settings more precise and should no longer crash if also using Powercord's BDCompat when opening settings
    - Fixed broken resizing if clicking Module Store setting item after already being in it
    - Fixed crashes for modules using color picker component in settings without initial value
    - Fixed removing a module when it is currently disabled not working


## v6.0.1 [2021-01-22]

  - ### Fixes
    - Fixed sometimes failing to parse authors for some modules using ID(s) as author


## v6.0.0 [2021-01-15]

  - ### UI Improvements
    - Sidebar selectors in Module Store UI are now all off by default and allow selection of each category for mixing
    - Numbers in the Module Store UI sidebar selectors now change as they are chosen and only count visible cards
    - Commas spliting authors in Module Store cards are now grayed out as well
    - Authors in Module Store cards as just IDs are now replaced visually with Username#Discriminator (plus user modal on click)

  - ### New Features
    - Added Safe Mode

  - ### Patcher API Additions
    - Completely new from scratch Patcher base API, with an added compatibility layer for current / old modules
    - Added sub-menu support in Patcher context menu API
    - Added new Patcher ChannelTextArea buttons API, making it now easy for module developers to add buttons to the ChannelTextArea (the buttons to the right of where you type messages)
    - Added new Patcher MiniPopover API, making it now easy for module developers to add buttons to MiniPopovers (the buttons which appear to the right when you hover over a message)

  - ### General API Additions
    - [GitHub Issue #13](https://github.com/GooseMod/GooseMod/issues/13): Added support for checkboxes in context menu patcher API
    - [GitHub PR #17 by SrKomodo](https://github.com/GooseMod/GooseMod/pull/17): Added initial value method for color settings
    - Added ReactDOM to common Webpack modules

  - ### Fixes
    - Fixed re-enabling modules in the Module Store being broken
    - Removed old debug logging to console
    - Fixed error on confirm modal when not in settings

  - ### Internal Improvements
    - New async modules importer on injection, up to 8x faster import times for some users who use a lot of modules
    - Always wait for Discord to load at the start of injection, don't always rely on Untethered
    - Use hash instead of version for JS caching of Module Store modules
    - Use Module Store API's base internally rather than repeating same base, specifically updated changelog and version + hash checking
    - Use GooseMod domain instead of direct Netlify URL base for Module Store API's base

  - ### Build Improvements
    - Added further comments for better explanation
    - Now removes auto-added comment line with incorrect source map link


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
    - [GitHub PR #15 by Fjorge](https://github.com/GooseMod/GooseMod/pull/15): Add standard removeItem function to Settings API
    - Added import and remove confirmation toasts with local modules


## v5.5.0 [2020-12-06]

  - ### Features
    - Display error when a module fails to import instead of causing an error and halting GooseMod loading


## v5.4.0 [2020-12-04]

  - ### Features
    - [GitHub PR #11 by Fjorge](https://github.com/GooseMod/GooseMod/pull/11): Only exclude modules with all (not some) authors unselected in Module Store Sidebar
    - [GitHub PR #12 by Fjorge](https://github.com/GooseMod/GooseMod/pull/12): Add Changelog button to GooseMod settings

  - ### Tweaks
    - Removed uninstall setting option


## v5.3.1 [2020-12-04]

  - ### Fixes
    - Fixed easter egg's audio not playing correctly


## v5.3.0 [2020-12-04]

  - ### Features
    - [GitHub PR #6 by Fjorge](https://github.com/GooseMod/GooseMod/pull/6): Add audio property to easter eggs
    - [GitHub PR #8 by Fjorge](https://github.com/GooseMod/GooseMod/pull/8): Let modules have author as an array


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
