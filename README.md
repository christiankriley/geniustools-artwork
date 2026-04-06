iTunes Artwork Finder
=====================

Ben Dodson's iTunes Artwork Finder rewritten purely in JavaScript (and no jQuery!) with a 1000x1000 artwork preset for the Genius community. The tool is more specifically designed with music in mind, meaning we expect Album/Song Apple IDs and Album/Song queries. Works out of the box.

By default, you can only search iTunes (client only, no server required).

However, with a Cloudflare function and an Apple Music developer token, you can get an expanded search including Apple Music-only releases. Just set the ENABLE_APPLE_MUSIC const to "true" in itunes.js and add your token to an environment variable called APPLE_MUSIC_TOKEN. The search is handled by /functions/am-search.js with no other config required.

To use on your own site, simply upload itunes.js and then initialize the script with something like:

	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>iTunes Artwork Finder</title>
	</head>
	<body>

		<div>
			<form action="" method="get" accept-charset="utf-8" id="iTunesSearch">
				<select name="entity" id="entity">
					<option value="album">Title</option>
					<option value="idAlbum">Apple ID</option>
				</select>
				<input type="text" class="text" name="query" id="query" placeholder="Search iTunes..." />
				<select name="country" id="country"></select>
				<input type="submit" class="submit" value="Search" />
			</form>
		</div>

		<div id="results">
			</div>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
		<script src="itunes.js"></script>

	</body>
	</html>

## Local

Run locally:

```python3 -m http.server```

Then navigate to http://localhost:8000.
