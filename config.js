/* ============================================================================
   PARADOXVRP LOADING SCREEN -- SETTINGS

   This folder is a WEB PAGE, not a Garry's Mod addon. Do not upload it to the
   server's addons. It lives on GitHub Pages:
       https://jpherbst37.github.io/paradox-loading/
   and the server addon 1rploading points the server at it.

   Change anything below, save, and upload this file to GitHub again
   (Add file > Upload files -- a file with the same name is replaced).
   ============================================================================ */

var LOADING = {

	/* Shown until the game tells the page the real server name. */
	SERVER_NAME: "ParadoxVRP",

	/* The clone whose helmet camera this is. */
	CLONE_ID: "CT-6116",

	/*
		DAYS STRANDED counts up for real, one a day, from this date
		(year, month, day). Set FIXED_DAYS to a number to freeze it instead.
	*/
	STRANDED_SINCE: [2026, 3, 6],
	FIXED_DAYS: 0,

	LOCATION: "WASSKAH  //  KASHYYYK SYSTEM",

	/*
		THE PICTURE. Put a PNG or JPG in this folder and write its file name
		here. Leave it "" for the painted, moving scene. Best at 1920 x 1080.
	*/
	SCENE_IMAGE: "clone.jpg",

	/*
		THE LIGHT IN THE PICTURE, for the glow laid over it:
		  "moon"  cold and pale -- a night picture (the jungle one)
		  "sun"   warm and gold -- a sunset picture
		LIGHT_X / LIGHT_Y say where it is (0 to 1 across, 0 to 1 down).
	*/
	LIGHT: "moon",
	LIGHT_X: 0.86,
	LIGHT_Y: 0.04,

	/* fireflies drifting through the dark, and mist creeping along the ground */
	FIREFLIES: true,
	MIST: true,

	/*
		THE MUSIC: a music file in this folder -- an .mp3 or .ogg -- played as
		the "audio log". Put the file next to index.html and write its name
		here, e.g. "music.mp3". Leave it "" for silence.

		Keep it under 25 MB (GitHub's upload page refuses bigger files): about
		20 minutes of music at normal quality. It loops, and starts somewhere
		random in the track each time.

		USE MUSIC YOU ARE ALLOWED TO PUT ON A WEBSITE -- a track you made, one
		the artist said yes to, or one with a free licence. A ripped track can
		get the whole page taken down.
	*/
	MUSIC: true,
	MUSIC_FILE: "",
	MUSIC_VOLUME: 0.6,
	MUSIC_RANDOM_START: true,
	MUSIC_CREDIT: "",

	/* Turned every few seconds at the bottom of the screen. */
	TIPS: [
		"F4 opens your datapad. Everything you need is in there.",
		"New here? Open TUTORIAL from the main menu.",
		"F1 opens the field manual: controls, commands, rules and guides.",
		"Lost? Ask in /ooc or call a staff member from F4.",
		"Hold R with your hands empty to open the emote wheel.",
		"Right click on the death screen to pick where you redeploy.",
		"Fortify: left click a blueprint with the pad to build it.",
		"Ammunition and medical crates refill with PACK THE CRATE.",
		"Stay in character. The Republic is watching.",
		"Medals unlock warbonds in the armoury.",
		"File operation reports to earn medals.",
		"Combat Engineers build the dispenser. Pack crates to fill it.",
		"Respect your officers. Earn your rank.",
		"Never leave a brother behind.",
		"If a droid is on its own, it is not on its own."
	]
};
