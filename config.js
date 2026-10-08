/* ============================================================================
   PARADOXVRP LOADING SCREEN -- SETTINGS

   This folder is a WEB PAGE, not a Garry's Mod addon. Do not upload it to the
   server's addons. It goes on GitHub Pages (see README.txt), and the server's
   server.cfg points at it:   sv_loadingurl "https://YOURNAME.github.io/paradox-loading/"

   Change anything below, save, and upload the file again.
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
		YOUR OWN PICTURE INSTEAD OF THE PAINTED SCENE. Put a PNG or JPG in this
		folder and write its file name here, e.g. "campfire.png". Leave it "" to
		keep the painted, moving scene. Best at 1920 x 1080.
	*/
	SCENE_IMAGE: "clone.jpg",

	/* where the sun is in the picture (0 to 1 across, 0 to 1 down), for the haze */
	SUN_X: 0.84,
	SUN_Y: 0.2,

	/*
		THE MUSIC: "4 Hours of Post Apocalyptic Acoustic Guitar (S.T.A.L.K.E.R./Metro
		Inspired with campfire ambience)" by Joe Mathews, played through YouTube's own
		player in the AUDIO LOG window (YouTube only allows its player to be shown,
		not hidden). It starts somewhere random in the four hours each time.
		Set MUSIC to false for silence.
	*/
	MUSIC: true,
	MUSIC_VOLUME: 0.6,

	YOUTUBE_ID: "i2VjesyosKM",
	YOUTUBE_SECONDS: 14400,
	YOUTUBE_CREDIT: "JOE MATHEWS  --  POST APOCALYPTIC ACOUSTIC GUITAR",

	/* Turned every few seconds at the bottom of the screen. */
	TIPS: [
		"F4 opens your datapad. Everything you need is in there.",
		"Lost? Ask in /ooc or call a staff member from F4.",
		"Hold R with your hands empty to open the emote wheel.",
		"Right click on the death screen to pick where you redeploy.",
		"Fortify: left click a blueprint with the pad to build it.",
		"Ammunition and medical crates refill with PACK THE CRATE.",
		"Stay in character. The Republic is watching.",
		"Medals buy commendations in the armoury.",
		"Combat Engineers build the dispenser. Pack crates to fill it.",
		"Respect your officers. Earn your rank.",
		"Never leave a brother behind.",
		"If a droid is on its own, it is not on its own."
	]
};
