iTunes Artwork Finder
=====================

Ben Dodson's iTunes Artwork Finder rewritten purely in JavaScript with a 1000x1000 artwork preset for the Genius community. Works out of the box - client only, no server required.

To use on your own site, simply upload itunes.js and then initialize the script with something like:

	<div>
		<form action="" method="get" accept-charset="utf-8" id="iTunesSearch">
			<select name="entity" id="entity">
				<option value="tvSeason">TV Show</option>
				<option value="movie">Movie</option>
				<option value="ebook">iBook</option>
				<option value="album">Album</option>
				<option value="software">App (iPhone or Universal)</option>
				<option value="iPadSoftware">App (iPad)</option>
				<option value="macSoftware">App (macOS)</option>
				<option value="audiobook">Audiobook</option>
				<option value="podcast">Podcast</option>
				<option value="musicVideo">Music Video (may not work)</option>
				<option value="id">Apple ID (Movie)</option>
				<option value="idAlbum">Apple ID (Album)</option>
				<option value="shortFilm">Short Film</option>
			</select>
			<input type="text" class="text" name="query" id="query" />
			<select name="country" id="country">
				<option value='us'>United States of America</option>
				<option value='gb'>United Kingdom</option>
			</select>
			<input type="submit" class="submit" value="Get the artwork" />
		</form>
	</div>

	<div id="results">

	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="itunes.js"></script>

## Local

Run locally:

```python3 -m http.server```

Then navigate to http://localhost:8000.
