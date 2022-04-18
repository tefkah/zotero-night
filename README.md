# Night

![](./IMG-20220419-WA0000.jpg)
Install by downloading the [latest version](https://github.com/ThomasFKJorna/zotero-night/releases/latest)

Night theme for Zotero UI &amp; Pdf

Kind of jank but it works

# Install

Download the xpi from [Releases](https://github.com/ThomasFKJorna/zotero-night/releases). As always, if you're on Firefox, right-click.

# Todo

- [ ] I can't figure out how to run JS after the pdf is fully loaded. The way it's set up now is that when switching tabs you it will check for the theme
- [ ] The popup menus are kind of difficult to style
- [ ] Make prettier, more curves. Basically redesign zotero a bit
- [ ] Add night/day toggle
- [ ] Add user selectable input
- [ ] Write contributing guide

# Contributing

You're help is very welcome!
However, getting setup for Zotero plugin development is a bit of a pain in the ass.

What you need to do

- [ ] Download Zotero 60 ESR
- [ ] Git clone
- [ ] yarn
- [ ] do the zotero plugin stuff (expound on this)
- [ ] Launch zotero with --debugger and -somethingcaches
- [ ] Launch Firefox 60
- [ ] In Firefox, go to devtools, go to settings, click "enable remote debugging" and the one next to it that's also about debugging.
- [ ] In Zotero, go to setting, advanced, config editor, look up "debugging" and click on "allow remote debugging"
- [ ] In Firefox, click the hamburger menu in the top right -> web developer -> Connect...
- [ ] ENter localhost:6100
- [ ] Connnct
- [ ] Click "Inspect Main Process"

Wow now you can finally do things.
